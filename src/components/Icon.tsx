type IconProps = {
  name: 'arrow-up-right' | 'arrow-down' | 'arrow-up' | 'close' | 'menu' | 'plus' | 'sun' | 'moon' | 'monitor'
  className?: string
}

const paths: Record<IconProps['name'], string> = {
  'arrow-up-right': 'M6 18 18 6M6 6h12v12',
  'arrow-down': 'M12 4v16m-6-6 6 6 6-6',
  'arrow-up': 'M12 20V4m-6 6 6-6 6 6',
  close: 'm6 6 12 12M6 18 18 6',
  menu: 'M4 8h16M4 16h16',
  plus: 'M12 5v14M5 12h14',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  moon: 'M20.2 13.8A8.5 8.5 0 0 1 10.2 3.8a8.5 8.5 0 1 0 10 10Z',
  monitor: 'M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM12 16v4m-4 0h8',
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  )
}
