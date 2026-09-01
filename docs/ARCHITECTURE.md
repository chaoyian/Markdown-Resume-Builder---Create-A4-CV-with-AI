# Architecture and dependencies

## Runtime paths

Both source and portable modes execute the same `src/` modules:

```text
resumes/*.md
    -> interactive picker or explicit path
    -> themes/a4-resume*.css
    -> pinned Marp CLI
    -> detected Chrome / Edge / Chromium / Firefox
    -> output/pdf/<version>_<timestamp>.pdf
```

Source mode uses the user's Node.js installation. A portable archive uses `runtime/node` or `runtime/node.exe` supplied in that archive. Both resolve Marp directly through `node_modules/@marp-team/marp-cli/marp-cli.js`, avoiding shell and `.cmd` differences between operating systems.

## User data boundary

`resumes/` is the private, top-level Markdown library. The picker ignores hidden files, nested directories, and non-Markdown files. Output filenames are normalized for Windows, macOS, and Linux, and same-second collisions receive a numeric suffix.

The toolkit never automatically copies, renames, deletes, uploads, or commits a personal resume. `output/pdf/` contains generated files and is also ignored by Git.

## Browser resolution

The exporter first honors `BROWSER_PATH`, then searches standard locations in a stable order: Chrome/Chromium, Edge, and Firefox. Marp receives both the browser kind and absolute executable path. Firefox remains a fallback because PDF rendering may differ from Chromium-based browsers.

The lightweight v2.0 archives intentionally do not bundle a browser. Windows normally provides Edge; macOS and Linux users need a compatible browser installed separately.

## Portable package composition

Release jobs run natively on each target architecture and stage only an explicit allowlist:

- application modules, themes, examples, and documentation;
- the matching Node.js runtime and license;
- dependencies installed from `package-lock.json`;
- exactly one platform launcher;
- an empty starter resume directory and package manifest.

`.git`, private resumes, generated PDFs, caches, archives, and development output are excluded. GitHub Actions produces two macOS archives plus Windows x64 and Linux x64 archives, then publishes SHA-256 checksums.

## Project roles

- `src/` contains shipped application code.
- `launchers/` contains thin platform entry points.
- `scripts/` contains development and release automation.
- `tests/` covers deterministic library and runtime behavior.
- `.github/workflows/` validates all four targets and publishes tagged releases.
