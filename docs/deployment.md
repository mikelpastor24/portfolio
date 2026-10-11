# Deployment

[Back to the project overview](../README.md)

The portfolio is prepared for GitHub Pages at **https://mikelpastor.com**, with the domain without `www` as the primary address. GitHub Actions builds and publishes the static website.

## Automatic publishing

[`deploy.yml`](../.github/workflows/deploy.yml) runs on pushes to `main` and can also be started manually from the Actions tab. It:

1. Checks out the repository and sets up Node.js 22 with npm caching.
2. Reads the GitHub Pages configuration.
3. Installs the locked dependencies with `npm ci`.
4. Runs Oxlint and the desktop and mobile Playwright tests in Google Chrome.
5. Builds the production website with `npm run build`.
6. Uploads `dist/` and deploys it after all checks succeed.

The deployment job only publishes `main`. For manual runs, select `main` as the branch. Concurrent runs are queued so an active deployment can finish.

The workflow uses official GitHub actions pinned to commit SHAs and the automatic `GITHUB_TOKEN`. No personal access token or deployment secret is required. Build and deployment jobs have separate permissions; only deployment receives Pages write and OpenID Connect permissions.

Optimized recordings and posters in `public/media/` are copied into `dist/` and published with the website. Keep those files committed. Original recordings in the ignored `assets/` directory and local artifacts are excluded; FFmpeg is not needed in CI.

## One-time GitHub configuration

Before the first deployment:

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Under **Custom domain**, enter `mikelpastor.com` and save.
4. If GitHub asks for domain verification, follow its instructions to add the verification TXT record at your DNS provider.
5. Configure the DNS records below and enable **Enforce HTTPS** once the certificate is available.

Domain ownership verification can also be completed in your account's **Settings → Pages** before adding the custom domain to the repository. See [GitHub's domain verification guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

GitHub stores the custom domain in the Pages settings. A `CNAME` file is ignored when publishing through a custom Actions workflow, so this project does not use one. Setting the domain is a one-time operation; subsequent pushes publish to the configured domain automatically.

## DNS records

Keep the domain registered with your current provider. For `mikelpastor.com`, configure these GitHub Pages records in its DNS zone:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `mikelpastor24.github.io` |

Replace conflicting website records for `@` or `www`; preserve unrelated records such as email MX and TXT records. The `www` CNAME points to the GitHub account domain, without the repository name. With `mikelpastor.com` selected as the custom domain and both addresses configured, GitHub redirects `www.mikelpastor.com` to `mikelpastor.com`.

These values follow [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Confirm the current GitHub Pages values there before making DNS changes. DNS propagation and certificate provisioning can take up to 24 hours.

## Vite asset paths

[`vite.config.ts`](../vite.config.ts) explicitly uses `base: '/'` because the website is served from the custom domain's root. Content and icons also use root-relative `/media/` and `/icons/` URLs.

Configure the custom domain before using the deployed website. Serving this build directly from a repository path such as `mikelpastor24.github.io/portfolio/` would require adapting Vite's base and the root-relative asset URLs. See [Vite's GitHub Pages guide](https://vite.dev/guide/static-deploy.html#github-pages).

## First deployment and verification

Push the workflow and project files to `main` after completing the Pages settings. In **Actions → Deploy portfolio to GitHub Pages**, review the **Check and build** and **Publish website** jobs. For another run without a new commit, use **Run workflow** on `main`.

After deployment, open `https://mikelpastor.com` and check language and theme selection, navigation, project dialogs, and both gamer-jev recordings. Also confirm that `https://www.mikelpastor.com` redirects to the primary address.

To check the production build locally:

```sh
npm run build
npm run preview
```

If deployment fails during Pages configuration, check that the publishing source is GitHub Actions. If the website deploys but the custom domain does not resolve, review the DNS records and certificate status in Settings → Pages.
