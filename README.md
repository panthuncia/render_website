# Render Stack website

Documentation for BasicRHI, OpenRenderGraph, and SealLOD Engine, plus a rendering development blog. Built with Docusaurus, React, and TypeScript.

## Getting started

Use Node.js 24 LTS (see `.nvmrc` and `.node-version`) and npm. Docusaurus requires Node.js 20 or newer.

```sh
npm ci
npm start
```

The development server uses http://localhost:3000/render_website/ and reloads when source files change.

The homepage is the blog index. The previous project landing page is available at `/render_website/projects`.

## Checks and production preview

```sh
npm run typecheck
npm run build
npm run serve
```

The build generates `build/`; the preview serves that output locally. Broken internal links fail the build. Use `npm run clear` to clear Docusaurus caches when troubleshooting.

## Repository layout

| Path | Purpose |
| --- | --- |
| `blog/` | Posts, colocated images, author and tag registries |
| `docs-basicrhi/` | BasicRHI documentation |
| `docs-opengraph/` | OpenRenderGraph documentation |
| `docs-SealLOD/` | SealLOD Engine documentation |
| `src/pages/` | Project landing page and standalone pages; the blog plugin provides the homepage |
| `src/components/`, `src/css/` | Shared UI and styles |
| `static/` | Assets copied directly to the site |
| `docusaurus.config.ts`, `sidebars.*.ts` | Site configuration and project navigation |

The original `docs/` and `sidebars.ts` are inactive starter examples: the classic docs plugin is disabled, and the three project docs plugins provide the live documentation routes.

## Writing a blog post

Create `blog/YYYY-MM-DD-post-slug/index.md`. Include `title`, `date`, `slug`, `authors`, `tags`, and `description` in YAML front matter. Register authors in `blog/authors.yml` and tags in `blog/tags.yml`. Put `{/* truncate */}` after the introduction and keep images beside the post using relative links. MDX processes Markdown files, so JSX must be valid; local images in JSX should use `src={require('./image.png').default}`.

The first post is [Fixing Skyrim's render pipeline (drawcall limit fix)](blog/2026-10-09-fixing-skyrims-render-pipeline/index.md), imported with its original illustrations on October 9, 2026.

## Hosting configuration

The default canonical URL and base path target `https://panthuncia.github.io/render_website/`. This is a configuration default, not a claim that the site has been deployed. Any static host can serve `build/`.

For a custom domain, set `SITE_URL` to the origin and `SITE_BASE_URL` to `/` before building. For example, in PowerShell:

```powershell
$env:SITE_URL = 'https://your-domain.example'
$env:SITE_BASE_URL = '/'
npm run build
```

Base paths must begin and end with `/`. CI validates the build but does not publish it.

## Maintenance

Use npm and commit `package-lock.json` alongside dependency changes. Keep all `@docusaurus/*` packages at the same version. Run type checking and a production build after upgrades, and review `npm audit` before deciding how to address advisories.

TypeScript is kept on 5.9.3 because Docusaurus 3.10.2's shared configuration uses `baseUrl`, which TypeScript 7 has removed. The `@docusaurus/faster` dependency supports the existing `future.v4` setting.

The site explicitly uses Webpack instead of Rspack because Rspack has crashed during development with a missing MDX module-graph entry. After changing bundler settings, stop the development server, run `npm run clear`, and restart `npm start`.

See [CONTRIBUTING.md](CONTRIBUTING.md), [AGENTS.md](AGENTS.md), and [SECURITY.md](SECURITY.md). No repository-wide license has been selected; do not assume permission to redistribute its code or articles.
