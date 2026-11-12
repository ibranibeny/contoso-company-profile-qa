# Contoso company profile (workshop starter)

Starter code for the **GitHub Agent-Native Engineering System** workshop.
It is the public company profile website of **Contoso Technology Solutions**, a fictional IT solution provider (managed IT services, cloud and infrastructure, cybersecurity, data and AI). The site is built with Node.js and EJS templates, tested with `node:test`, and deployed to **GitHub Pages** by GitHub Actions.

> **Training material.** This starter deliberately ships with **one outdated dependency** and **one insecure legacy widget**, so the security chapters of the workshop (code scanning, Copilot Autofix, Dependabot) have something real to find and fix. Do not reuse this code in production.

## Quick start

1. **Use this template → Create a new repository** (public), for example `contoso-company-profile`.
2. In the new repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**, then run the **Deploy to GitHub Pages** workflow.
3. **Code → Codespaces → Create codespace on main**, then in the terminal:

   ```bash
   npm test                         # builds the site and runs the checks
   npm run build && npm run serve   # preview on port 8080
   ```

## Project layout

| Path | What it is |
| --- | --- |
| `src/pages/*.ejs` | One template per page: home, solutions, about us, newsroom, contact |
| `src/partials/` | Shared head, header, footer, page hero and icons |
| `src/data/*.json` | All site content; each file becomes a template variable |
| `src/assets/` | CSS, JavaScript, logo and photography |
| `build.mjs` | Renders the pages into `dist/` |
| `test/site.test.mjs` | Checks pages, headings, alt text and links |
| `.github/workflows/ci.yml` | Tests every pull request |
| `.github/workflows/deploy-pages.yml` | Deploys `dist/` to GitHub Pages on every push to `main` |
| `.github/copilot-instructions.md` | Project rules that Copilot follows (and code review checks) |
| `.devcontainer/` | Codespaces configuration (Node.js 22 + GitHub CLI) |

Photography in `src/assets/img/` is AI-generated for this fictional company; all names, figures and clients are fictional.

## Workshop guide

Step-by-step guide with real screenshots: https://ibranibeny.github.io/gh-agentic-engineering-workshop/
