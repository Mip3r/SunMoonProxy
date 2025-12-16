#!/usr/bin/env node
// Minimal Scramjet scraping example
// Usage: node scripts/scrape.js https://example.com "a.article-link"  -- fetches the page and logs text of matched selectors

const { DataStream } = require('scramjet');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function scrape(url, selector) {
    console.log('Fetching:', url);
    const res = await fetch(url, { headers: { 'User-Agent': 'SunMoonProxyScraper/1.0' } });
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);
    const html = await res.text();
    const $ = cheerio.load(html);
    const nodes = $(selector).toArray().map(n => $(n).text().trim());
    return nodes;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node scripts/scrape.js <url> <css-selector>');
        process.exit(1);
    }
    const [url, selector] = args;

    try {
        // Basic robots/ethical note: do not use this to abuse third-party sites.
        const out = await scrape(url, selector);
        for (const o of out) console.log('- ', o);
    } catch (e) {
        console.error('Error:', e.message);
        process.exit(2);
    }
}

main();
