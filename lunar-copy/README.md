Lunar (mirrored snapshot)
=========================

This folder is a self-contained mirror of the public "Lunar" website snapshot
as requested. It includes the static files from the site build and a copy of the
upstream AGPL-3.0 license.

What this is
- A static snapshot of the upstream site's `public/` output saved under
  `lunar-copy/` so you can run it locally without depending on the remote host.
- Assets and packaged files are included under `assets/`.

License and provenance
- The upstream project is licensed under AGPL-3.0. The original license was
  copied into `LICENSE` in this directory and must be left in place if you
  redistribute or publish this mirror.
- You were given explicit permission to create this mirror; keep the license
  intact and follow AGPL obligations if you deploy it publicly.

How to run locally (Windows PowerShell)
1. Open PowerShell and navigate to this folder:
   cd "c:\Users\erm actually\.vscode\SunMoonProxy\lunar-copy"
2. Start a simple static server (Python must be installed):
   python -m http.server 8000
3. Open your browser to: http://localhost:8000

Notes
- Some build-time artefacts were cleaned to make the snapshot self-contained,
  but any dynamic features that depended on server-side behaviour or omitted
  build outputs may not work exactly the same as the live site.
- If you want a single-file inlined bundle (all images/fonts base64 inlined), I
  can create `bundle.html` on request.

Files of interest
- index.html — homepage snapshot (patched to use local `assets/` paths)
- assets/ — images, packaged JS/WASM and JSON lists
- LICENSE — original AGPL-3.0 text from upstream

If you'd like, next I can:
- produce a single-file inlined bundle (bundle.html), or
- continue cleaning leftover build tags, or
- create a small test page that demonstrates the embedded game launcher.
