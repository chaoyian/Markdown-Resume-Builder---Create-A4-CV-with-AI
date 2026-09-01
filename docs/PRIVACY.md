# Privacy design

## Public and private content

The repository contains only public templates, themes, scripts, tests, documentation, and preview images. Personal content belongs in ignored local paths:

```text
resumes/
resume.md
*.private.md
private/
archive/
output/
*.pdf
```

The root-level `resume.md` rule remains for backward compatibility. Version 2.0 uses `resumes/` as its private working library.

## Portable downloads

A Release archive contains a generated `resumes/START-HERE.txt`, not a real resume. The user's first template copy is created locally after extraction. Nothing in the launcher has network upload behavior; network access is only used by GitHub Actions while building public release artifacts.

Portable installations keep personal Markdown and PDFs beside the application for transparency. Back up `resumes/` and `output/` before deleting or replacing the extracted folder.

## Publishing checklist

```bash
git status --short
git check-ignore -v resumes/private.md private archive output
git ls-files
```

Confirm that `resumes/`, PDFs, backups, archive contents, screenshots with personal details, and unrelated documents are absent from `git ls-files`. `.gitignore` is a staging safeguard, not encryption; always inspect the staged diff and avoid `git add -f`.
