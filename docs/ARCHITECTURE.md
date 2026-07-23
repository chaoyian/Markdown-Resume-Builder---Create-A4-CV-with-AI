# Architecture and dependencies

## Build pipeline

```text
Markdown source
    |
    +-- themes/a4-resume.css
    |
    +-- @marp-team/marp-cli
            |
            +-- Chrome / Chromium
                    |
                    +-- output/pdf/*.pdf
```

Marp CLI reads the Markdown source, loads the custom theme from `package.json`, and uses a browser to print the rendered document to PDF.

## Runtime dependencies

| Dependency | Version | Responsibility |
| --- | --- | --- |
| Node.js | 18+ | Runs project scripts and Marp CLI |
| npm | Bundled with Node.js | Installs dependencies from the lockfile |
| `@marp-team/marp-cli` | Pinned in `package-lock.json` | Markdown, HTML, CSS, and PDF conversion |
| Chrome / Chromium | Current supported version | Headless PDF printing |
| System fonts | Platform dependent | Text rendering |

Marp is installed locally through `npm install`. A global Marp installation is not required.

## A4 theme

`themes/a4-resume.css` declares a named Marp theme and an A4 size preset:

```css
/**
 * @theme a4-resume
 * @size A4 210mm 297mm
 */
```

Each resume selects the theme through front matter:

```yaml
marp: true
theme: a4-resume
size: A4
```

## Pagination

Marp treats every slide as one PDF page. It does not automatically flow overflowing content onto the next page.

A standalone separator creates a new page:

```markdown
---
```

Page breaks should be placed between complete sections or entries. Always inspect the generated PDF after changing text length, fonts, or spacing.

## Project scripts

- `scripts/init-resume.mjs` creates a private working copy.
- `scripts/export-pdf.mjs` validates paths and invokes the local Marp binary.
- `scripts/export-interactive.mjs` creates timestamped exports.
- `scripts/verify-project.mjs` validates required files, theme metadata, example configuration, and the private-file boundary.
- `scripts/export-resume.command` provides a macOS double-click wrapper.

## VS Code

`.vscode/settings.json` registers the same theme for Marp for VS Code. It is optional and has no role in command-line PDF generation.
