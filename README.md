# Baiscope Search API (Cloudflare Worker)

This repo provides a simple Cloudflare Worker that scrapes `baiscopes.lk` search results and returns JSON.

## Usage

Deploy with Wrangler or paste `index.js` into a Cloudflare Worker.

Query example:
```
GET https://<your-worker>.workers.dev/?q=one+punch+man
```

## Files
- `index.js` — Cloudflare Worker code using `cheerio` to parse HTML.
- `wrangler.toml` — Cloudflare config.
- `package.json` — minimal package file.

## Notes
- Respect `baiscopes.lk` terms of use and robots.txt.
- If the site renders content with JavaScript, consider using a headless browser instead.
