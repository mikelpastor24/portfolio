import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const args = process.argv.slice(2)
const executableIndex = args.indexOf('--ffmpeg')
const temporaryTools = path.join(root, 'artifacts/media-tools/imageio_ffmpeg/binaries')
const temporaryExecutable = existsSync(temporaryTools)
  ? readdirSync(temporaryTools).find((filename) => filename.endsWith('.exe'))
  : undefined
const executable = executableIndex >= 0
  ? args[executableIndex + 1]
  : process.env.FFMPEG_PATH || (temporaryExecutable ? path.join(temporaryTools, temporaryExecutable) : 'ffmpeg')

if (!executable) throw new Error('Provide an executable path after --ffmpeg.')

function runEncoder(parameters) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, ['-hide_banner', '-loglevel', 'warning', '-nostdin', ...parameters], { stdio: 'inherit', windowsHide: true })
    child.once('error', reject)
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg exited with code ${code}.`)))
  })
}

const sourceRoot = path.join(root, 'assets')
for (const project of readdirSync(sourceRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const sourceDirectory = path.join(sourceRoot, project.name)
  const outputDirectory = path.join(root, 'public/media', project.name)
  const videos = readdirSync(sourceDirectory).filter((filename) => filename.toLowerCase().endsWith('.mp4'))
  if (!videos.length) continue
  mkdirSync(outputDirectory, { recursive: true })
  for (const filename of videos) {
    const source = path.join(sourceDirectory, filename)
    const poster = path.join(outputDirectory, `${path.parse(filename).name}.jpg`)
    const output = path.join(outputDirectory, filename)
    if (!existsSync(poster)) {
      console.log(`Preparing poster: ${project.name}/${filename}`)
      await runEncoder(['-ss', '10', '-i', source, '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', '-update', '1', poster])
    }
    if (args.includes('--posters-only') || existsSync(output)) continue
    console.log(`Preparing web video: ${project.name}/${filename}`)
    await runEncoder([
      '-i', source, '-map', '0:v:0', '-map', '0:a:0?',
      '-vf', 'scale=1280:-2,fps=24', '-c:v', 'libx264', '-preset', 'veryfast',
      '-crf', '26', '-maxrate', '600k', '-bufsize', '1200k', '-pix_fmt', 'yuv420p', '-threads', '2',
      '-c:a', 'aac', '-b:a', '48k', '-ac', '2', '-movflags', '+faststart', output,
    ])
    console.log(`Prepared ${project.name}/${filename}: ${(statSync(output).size / 1048576).toFixed(1)} MiB`)
  }
}
