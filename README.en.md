# Marp A4 Resume Toolkit

English | [简体中文](README.md)

A privacy-conscious, bilingual, and reproducible A4 resume toolkit. Write the content in Markdown, style it with Marp, and generate PDFs through a project-pinned Marp CLI. VS Code is optional and is not part of the final build pipeline.

> **AI disclosure:** The project structure, build scripts, documentation, and parts of the styling were refactored with AI assistance and reviewed by a human. Users remain responsible for verifying resume content and final output.

## Features

- Standards-based A4 output without relying on VS Code export
- Sanitized Chinese and English resume examples
- Project-pinned Marp CLI for reproducible rendering
- Double-click and command-line workflows
- Personal PDFs named automatically with purpose and timestamp
- Private resumes, archives, and generated files excluded from Git by default
- MIT licensed for learning, personal resume maintenance, and office productivity

## Privacy model

Public templates and private local data are intentionally separated:

| Path | Purpose | Tracked by Git |
| --- | --- | --- |
| `examples/resume.zh-CN.md` | Sanitized Chinese example | Yes |
| `examples/resume.en.md` | Sanitized English example | Yes |
| `resume.md` | Your real resume | **No** |
| `archive/` | Historical drafts and PDFs | **No** |
| `output/`, `*.pdf` | Generated artifacts | **No** |
| `.marp/cv.css` | A4 theme | Yes |

`.gitignore` prevents normal staging of private files, but it is not encryption. Never force-add private files with `git add -f resume.md`, and never paste personal data into the public examples or documentation.

The build enables `allowLocalFiles` so a resume may reference local photos or images. Only build Markdown that you trust; do not run untrusted resume files.

Before publishing, check:

```bash
git status --short --ignored
git check-ignore -v resume.md archive output
```

## Requirements

| Dependency | Requirement | Purpose |
| --- | --- | --- |
| Node.js | 18 or later | Runs the build toolchain |
| npm | Included with Node.js | Installs locked dependencies and runs scripts |
| `@marp-team/marp-cli` | Pinned by `package-lock.json` | Renders Markdown into PDF |
| Chrome / Chromium | A browser available to Marp CLI | Prints the PDF |
| CJK fonts | PingFang SC, Noto Sans SC, or Microsoft YaHei recommended | Stable Chinese rendering |
| VS Code + Marp extension | Optional | Editing preview only |

No global Marp installation is required. `npm install` installs the project-pinned version into `node_modules`.

## Quick start

### macOS double-click workflow

1. Install Node.js 18 or later.
2. Double-click `生成简历.command`.
3. On first run, dependencies are installed and a local `resume.md` is created from the sanitized Chinese example.
4. Edit `resume.md`, save it, and double-click the command again.
5. Enter a purpose such as `Investment Internship`.
6. The PDF is saved under `output/pdf/` with a timestamp and opened automatically.

The local `resume.md` is ignored by Git and can remain your private working copy.

### Command-line workflow

```bash
npm install
cp examples/resume.en.md resume.md
npm run build
```

Output:

```text
output/pdf/resume.pdf
```

Do not run the copy command if you already have a personal `resume.md`.

## Bilingual examples

Build the sanitized examples:

```bash
npm run build:zh
npm run build:en
```

Build both:

```bash
npm run build:examples
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the private local `resume.md` |
| `npm run build:zh` | Build the sanitized Chinese example |
| `npm run build:en` | Build the sanitized English example |
| `npm run build:examples` | Build both sanitized examples |
| `npm run preview` | Preview the private local resume |
| `npm run preview:zh` | Preview the Chinese example |
| `npm run preview:en` | Preview the English example |
| `npm run watch` | Rebuild the private resume when files change |

## Build pipeline

```text
Markdown content
  + .marp/cv.css (A4 theme)
  + package-lock.json (pinned Marp CLI)
  + Chrome / Chromium (PDF printing)
  -> output/pdf/*.pdf
```

`.vscode/settings.json` only registers the same theme for the Marp extension. Command-line builds continue to work if `.vscode/` is removed.

## A4 sizing and pagination

The theme defines an A4 size preset through Marp Core metadata:

```css
/**
 * @theme cv
 * @size A4 210mm 297mm
 */
```

The Markdown front matter selects it:

```yaml
marp: true
theme: cv
size: A4
```

Marp does not automatically flow overflowing content onto another page. A standalone `---` in the Markdown body creates a page break. Always inspect the generated PDF after changing content.

## Project layout

```text
.
├── .marp/cv.css
├── .vscode/settings.json
├── examples/
│   ├── resume.zh-CN.md
│   └── resume.en.md
├── README.md
├── README.en.md
├── LICENSE
├── package.json
├── package-lock.json
└── 生成简历.command
```

Local use also creates `resume.md`, `archive/`, and `output/`. These paths remain untracked.

## Customization

- Typography, spacing, and colors: edit `.marp/cv.css`
- Resume content: edit the local `resume.md`
- New page: add a standalone `---` to the Markdown body
- Page size: change the theme `@size` metadata and the front matter `size`

## License and intended use

Licensed under the [MIT License](LICENSE). You may use it for learning, personal projects, and office productivity. You are responsible for checking factual accuracy, personal information, font licensing, and final PDF layout.
