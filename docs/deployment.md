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

## Search indexing

The canonical page is `https://mikelpastor.com/`. The HTML declares this address with `rel="canonical"` and `og:url` before JavaScript runs. Keep those URLs aligned with [`public/robots.txt`](../public/robots.txt) and [`public/sitemap.xml`](../public/sitemap.xml) if the domain changes.

`robots.txt` allows crawling of the entire public website, including the JavaScript, CSS, and media needed to render it, and points crawlers to the sitemap. Vite copies both files into the root of `dist/`. The sitemap lists only the canonical homepage: section fragments such as `#projects` and `#about` are part of that page, and the language buttons currently share its URL. Do not list fragments, redirecting domain variants, or language paths that the application does not serve.

After publishing an indexing change:

1. Confirm that `https://mikelpastor.com/`, `/robots.txt`, and `/sitemap.xml` return HTTP 200, and that the HTML declares the canonical URL without a `noindex` directive.
2. In Google Search Console, select the domain property and submit `https://mikelpastor.com/sitemap.xml` in **Sitemaps**.
3. Use **URL inspection** for `https://mikelpastor.com/`, run **Test live URL**, check that crawling is allowed and the rendered page contains the portfolio, and request indexing.
4. For **Blocked by robots.txt**, open the issue and inspect the exact example URL, its hostname, and its last crawl date. Test that URL live before selecting **Validate fix**. A report exported without example URLs is not enough to identify the blocked page.

**Page with redirect** is expected for HTTP or `www` variants that permanently redirect to the canonical HTTPS address. Keep these redirects; Google should index the destination. A missing `robots.txt` returning HTTP 404 does not itself block crawling. If the live canonical page is crawlable but an older report still lists a block, compare the affected URL and crawl date rather than assuming the homepage is currently blocked. See Google's [Page indexing report guide](https://support.google.com/webmasters/answer/7440203?hl=en) and [robots.txt HTTP status handling](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec#handling-http-status-codes).

Google needs to crawl the deployed changes before Search Console can reflect them. A sitemap and a request to index help discovery but do not guarantee indexing or a particular search ranking.

### October 2026 report

The Search Console export dated October 15, 2026 lists one URL blocked by robots.txt: `http://www.mikelpastor.com/`, last crawled on October 3. The overview also lists one indexed URL and two URLs with redirects, without identifying those URLs.

Live HTTP checks on October 15 found that the affected URL redirects directly with HTTP 301 to `https://mikelpastor.com/`, which returns HTTP 200. Its `robots.txt` also redirects to the canonical host, where the file currently returns HTTP 404. These responses do not reproduce a current robots block and suggest that the exported warning reflects an earlier crawl. Confirm this with Search Console's live inspection of the exact affected URL; checking from a local connection does not verify access from Google's servers. The new crawl files and canonical metadata take effect after deployment.
