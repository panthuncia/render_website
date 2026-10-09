# Contributing

Follow the setup and checks in [README.md](README.md). Keep changes focused and explain the resulting behavior and verification in your pull request.

## Content

Edit project documentation in the corresponding `docs-*` directory. Update its sidebar when navigation changes. Add blog posts as dated directories with an `index.md` and colocated assets. Include descriptive image alt text, a short description, registered authors and tags, and an excerpt marker.

Preserve technical claims when importing an article. Separate requested editorial revisions from publishing changes, and include only assets you have permission to use.

## Dependencies and validation

Use npm, commit lockfile updates, and keep Docusaurus package versions aligned. Before submitting:

```sh
npm ci
npm run typecheck
npm run build
```

Preview affected pages with `npm run serve`, checking navigation, image loading, and narrow screens when relevant. GitHub Actions runs installation, type checking, and the production build for pushes and pull requests.
