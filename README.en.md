# Marp A4 Resume Toolkit

[![CI](https://github.com/chaoyian/Markdown-Resume-Builder---Create-A4-CV-with-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/chaoyian/Markdown-Resume-Builder---Create-A4-CV-with-AI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/chaoyian/Markdown-Resume-Builder---Create-A4-CV-with-AI)](https://github.com/chaoyian/Markdown-Resume-Builder---Create-A4-CV-with-AI/releases)

English | [简体中文](README.md)

A bilingual resume toolkit that keeps content in Markdown and generates standards-based A4 PDFs through Marp. Version 2.0 provides portable Windows, macOS, and Linux downloads with one launcher for selecting multiple resume versions.

![English resume template preview](docs/assets/resume.en.png)

## Download (recommended)

Download the asset for your system from [Releases](https://github.com/chaoyian/Markdown-Resume-Builder---Create-A4-CV-with-AI/releases/latest):

| System | Asset | Launch |
| --- | --- | --- |
| Windows x64 | `windows-x64.zip` | Double-click `Launch Resume Toolkit.cmd` |
| macOS Apple Silicon | `macos-arm64.zip` | Double-click `Launch Resume Toolkit.command` |
| macOS Intel | `macos-x64.zip` | Double-click `Launch Resume Toolkit.command` |
| Linux x64 | `linux-x64.tar.gz` | Run `launch-resume.sh` |

Portable packages include Node.js and the pinned Marp CLI. Node.js, npm, and VS Code do not need to be installed. PDF export uses one compatible browser already installed on the system:

- Windows: Microsoft Edge, Google Chrome, or Firefox
- macOS: Google Chrome, Microsoft Edge, or Firefox (Safari is not supported)
- Linux: Chrome, Chromium, Microsoft Edge, or Firefox

On first launch, choose a Chinese or English template. The toolkit creates a local file in `resumes/`. Edit and save it, launch again, select a version with `↑ / ↓`, and press `Enter` to export.

Exports use version-and-timestamp filenames and never overwrite an existing PDF. A successful export is opened with the system PDF viewer when possible.

> Back up `resumes/` and `output/` before replacing a portable installation. Version 2.0 uses unsigned archives rather than signed installers, so the operating system may show a security prompt.

## Use from source

```bash
git clone https://github.com/chaoyian/Markdown-Resume-Builder---Create-A4-CV-with-AI.git
cd marp-a4-resume-toolkit
npm install
npm run init:en
npm run export
```

Source mode requires Node.js 18+, npm, and a compatible browser. Useful commands:

```bash
npm run init:zh
npm run init:en
npm run export
npm run export -- "resumes/resume-en.md"
npm run preview -- "resumes/resume-en.md"
npm run doctor
npm run check
```

Set `BROWSER_PATH` to an absolute browser executable path when automatic discovery cannot find a non-standard installation.

## Themes and pagination

The default theme is `a4-resume`. Select the serif edition with:

```yaml
theme: a4-resume-serif
```

Marp treats every slide as one PDF page and does not automatically flow overflowing content. Put `---` on its own line for a manual page break and inspect the PDF after changing text length, fonts, or spacing.

## Project layout

```text
src/          Selection, initialization, export, and environment detection
launchers/    Windows, macOS, and Linux entry points
scripts/      Project verification and release packaging
themes/       A4 sans-serif and serif themes
examples/     Public Chinese and English templates
tests/        Unit tests
docs/         Architecture, privacy, and release notes
```

See [architecture and dependencies](docs/ARCHITECTURE.md) and [privacy design](docs/PRIVACY.md) for details.

## License

[MIT](LICENSE)
