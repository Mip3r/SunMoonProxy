# SunMoon Proxy

A lightweight web proxy UI that embeds HTML games and provides a small in-app browser/launcher.

Features implemented so far:
- Clean UI (header, hero, side actions)
- Games page with embedded iframe player
- Version check that compares local `version.txt` with a remote file and shows a popup when outdated

Games are sourced from GN-Math; credit will be shown in-app and in the project when deployed.

This project is a work in progress.

Proxy / search notes
--------------------

GitHub Pages is static, so to proxy external pages you'll need a serverless proxy (example included):

- `workers/proxy.js` — a Cloudflare Worker example that forwards requests and strips common frame-blocking headers (x-frame-options, content-security-policy). Deploy it using Wrangler or the Cloudflare dashboard.
- After you deploy the Worker, set `PROXY_BASE` in `index.html` to the worker URL with a `?url=` parameter prefix (for example: `https://your-worker.example.workers.dev/?url=`). Then the header URL bar will open remote pages through the worker so they can be embedded.

Security note: running an open proxy can be abused. If you deploy this, restrict origins or add an allowlist, and be mindful of third-party terms and copyright.

Scraping helper (Scramjet)
-------------------------

This repository includes a small Node helper for scraping pages using Scramjet + Cheerio. It's intended as a developer utility for extracting titles, links, or other small datasets during testing. Do NOT use it to overload or scrape sites that disallow scraping in their robots.txt or terms of service.

How to run locally:

1. Install Node (>=14) and npm.
2. From the project root run:

```powershell
npm install
npm run scrape -- https://example.com "a.article-link"
```

The script `scripts/scrape.js` is a minimal example. It fetches the page and prints the text of elements matching the provided CSS selector.

Important: obey robots.txt and the target site's terms. This tool is provided for convenience and testing only.

Streaming crawler (multiple URLs)
--------------------------------

If you want to crawl multiple pages, use `scripts/scrape-list.js`.

1. Create a plain text file `urls.txt` with one URL per line.
2. Run:

```powershell
npm install
node scripts/scrape-list.js urls.txt out.jsonl "a.article-link"
```

The script writes JSONL to `out.jsonl` with one JSON object per URL: { url, title, extracted, ok }

Rate-limiting and ethics
------------------------
These scripts include a small per-request delay and concurrency cap, but they are not production crawlers. Always check robots.txt, limit rate, and don't scrape protected or bandwidth-sensitive endpoints.

Adding more games
-----------------

To add a game, place the game's HTML file into the `games/` folder and ensure its assets are reachable relative to that file. Edit `games.html` manually to add a card for the new game (or ask me and I can update it for you).

Running locally
---------------

If you try to open `index.html` directly from the filesystem (file:///) or visit `http://localhost:8000` without a running server, the site won't load embedded pages (iframes) or relative fetches. To run a simple local server on Windows PowerShell you can use Python 3 if it's installed:

```powershell
# from the project root folder
python -m http.server 8000
```

Then open http://localhost:8000 in your browser. If you prefer VS Code, the "Live Server" extension will also serve the folder (right-click -> Open with Live Server). The port 8000 is a common convention but you can choose any free port; make sure the URL you open in the app matches the server address.

If you still see a blank iframe or the content refuses to load, the target site may block being embedded (X-Frame-Options or Content-Security-Policy). Deploying the included `workers/proxy.js` and setting `PROXY_BASE` in `index.html` can help for sites you own or are permitted to proxy.