# Agent instructions

This repository is a Docusaurus website for Render Stack projects and a development blog. Read `README.md` and the relevant source before editing.

## Structure and conventions

- Live docs are in `docs-basicrhi/`, `docs-opengraph/`, and `docs-SealLOD/`; `docs/` is inactive starter content.
- Use npm and Node.js 24 LTS. Keep `package-lock.json` in sync with `package.json` and all `@docusaurus/*` packages on the same release.
- Check compatibility when upgrading React or TypeScript. Follow existing TypeScript and CSS style: two-space indentation and single quotes in TypeScript.
- Preserve article prose and technical claims unless editorial changes are requested. Keep post assets colocated and register authors and tags in the blog YAML files.
- Use valid JSX in Markdown/MDX. Prefer relative Markdown image links; use imported/required asset URLs for JSX images.
- Use Docusaurus `Link` for internal React navigation so configured base paths work.
- Do not edit generated `build/`, `.docusaurus/`, or `node_modules/` files. Do not commit caches, credentials, or local environment files.
- Do not choose a license or publish the website unless requested. Hosting settings can be overridden with `SITE_URL` and `SITE_BASE_URL`.

## Verification

Run `npm run typecheck` and `npm run build` after source, content, configuration, or dependency changes. For layout changes, preview affected pages at desktop and mobile sizes. For imported posts, verify every referenced local asset resolves and sample posts do not remain in the blog index. Report checks and unresolved failures accurately.
