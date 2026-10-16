# Deployment

Public preview: `https://taccountant2026.github.io/Bytova/`.

The checked-in HTML is generated from `site.config.json` and `scripts/build.mjs`; GitHub Pages can serve it directly. The custom Pages workflow runs the checks and packages root HTML/CSS/JavaScript, robots.txt and the assets directory. The repository's native Pages build also serves the root tree.

The custom workflows currently cannot start because GitHub reports an account billing lock. The native Pages build was still able to publish the previous release. This is a hosting-account issue, not a passing CI result. Local checks are run before publication and the native deployment result is checked separately.

## Update process

1. Edit the configuration, page builder, stylesheet or browser script.
2. Run `npm run build`, `npm run check` and `npm test`.
3. Commit/publish the complete generated pages and their source. Keep the existing public audience.
4. Verify the native Pages deployment and HTTP delivery of the changed pages and local assets.

## Domain

No domain or DNS change is performed by this source update. Before a later domain cutover, preserve email-related DNS records and use the verified host configuration. Do not infer a canonical URL before the target domain is actually connected.

Indexing is intentionally disabled while live payment readiness remains unverified. When launch is approved, use `launch.indexable` to update every page and `robots.txt` consistently. Customer pages carry no development-preview banner.
