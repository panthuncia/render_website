# Security

This repository builds a static website. Dependency and build tooling vulnerabilities can still affect contributors and CI.

For routine dependency updates, open a pull request with the relevant advisory and validation results. For a sensitive vulnerability, use the repository's GitHub **Security > Report a vulnerability** option if available, or contact the maintainer privately through their GitHub profile. Do not include credentials or exploitable private details in a public issue.

Only the current main branch is maintained. Never commit secrets or local environment files.

## Dependency audit: October 9, 2026

After updating direct dependencies and applying compatible `npm audit fix` updates, npm reports 46 affected packages (16 moderate, 15 high, 15 critical). Several counts are inherited through the same Docusaurus dependency chain. Remaining advisories originate in `braces`, `postcss-selector-parser`, `qs`, `serialize-javascript`, `tinypool`, and `uuid`.

The installed stable Docusaurus release is 3.10.2. npm proposes a breaking downgrade to Docusaurus 3.7.0 for most remaining findings; that change has not been applied. Re-run `npm audit` as upstream patches become available, and assess compatibility before overriding transitive dependencies. This audit describes the installed dependency tree, not an assertion that every advisory is exploitable in the generated static site.
