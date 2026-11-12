# Copilot instructions for the Contoso company profile

## Project
- Static website for **Contoso** (a fictional company), built with Node.js 22 and EJS templates.
- Pages live in `src/pages/*.ejs`, shared layout in `src/partials/`, content in `src/data/*.json`, static files in `src/assets/`.
- `npm run build` renders everything into `dist/`; `npm test` runs the `node:test` suite in `test/`.
- GitHub Actions deploys `dist/` to GitHub Pages on every push to `main`.

## Rules
- Put content in `src/data/*.json`, not hard-coded in templates. Every JSON file becomes a template variable with the same name.
- Escape output with `<%= %>`; only use `<%- %>` for trusted partials.
- Never write user-controlled data (URL parameters, form fields) with `innerHTML`, `outerHTML`, `insertAdjacentHTML` or `document.write`. Use `textContent` or DOM APIs.
- Accessibility: one `<h1>` per page, `alt` on every image, labels on every form field, visible focus states.
- Add or update tests in `test/` for every new page or behaviour.
- Use fictional Contoso data only: no real customer names, personal data or secrets.
