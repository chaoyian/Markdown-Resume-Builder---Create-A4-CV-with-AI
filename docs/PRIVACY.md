# Privacy design

Resume repositories can accidentally expose contact details, employment history, unpublished projects, and generated PDFs. This project separates public templates from the local working copy.

## Public files

- `examples/resume.zh-CN.md`
- `examples/resume.en.md`
- `themes/`
- `scripts/`
- `docs/`
- project configuration and license files

The examples contain fictional organizations and placeholder contact details.

## Local files

The following paths are ignored by Git:

```text
resume.md
*.private.md
private/
archive/
output/
*.pdf
```

`resume.md` is the default private working copy. Generated PDFs are written under `output/pdf/`.

## Check before publishing

```bash
git status --short
git check-ignore -v resume.md archive output
git ls-files
```

Confirm that `resume.md`, PDFs, archives, images containing personal details, and unrelated documents are absent from `git ls-files`.

`.gitignore` is a staging safeguard, not encryption. Avoid `git add -f` for ignored files, and review the staged diff before every push.

## Local file access

Marp is configured with `allowLocalFiles` so a resume may use local images. Build only Markdown files that you trust.
