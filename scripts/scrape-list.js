#!/usr/bin/env node
/*
 A small Scramjet streaming crawler example.
 Usage: node scripts/scrape-list.js urls.txt out.jsonl

 Behavior:
 - Reads a file of URLs (one per line)
 - Fetches them with concurrency limit
 - Uses cheerio to extract a CSS selector (optional) or just return <title>
 - Writes JSONL: { url, title, extracted: [...] }

 Notes: This is a developer tool. Respect robots.txt and target site's terms.
*/

const fs = require('fs');
const path = require('path');
const os = require('os');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const MAX_CONCURRENCY = 6;

async function fetchHtml(url){
  try{
    const res = await fetch(url, { headers: { 'User-Agent': 'SunMoonCrawler/1.0' }, timeout: 15000 });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return await res.text();
  }catch(e){
    throw e;
  }
}

async function processUrl(url, selector){
  try{
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const title = $('title').first().text().trim();
    const extracted = selector ? $(selector).toArray().map(n => $(n).text().trim()) : [];
    return { url, title, extracted, ok:true };
  }catch(e){
    return { url, error: e.message, ok:false };
  }
}

async function run(inputFile, outFile, selector){
  const lines = fs.readFileSync(inputFile,'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const out = fs.createWriteStream(outFile, { flags:'w' });
  let idx = 0;

  async function worker(){
    while(true){
      const i = idx++;
      if(i >= lines.length) return;
      const url = lines[i];
      process.stdout.write(`Fetching ${i+1}/${lines.length}: ${url}\n`);
      const res = await processUrl(url, selector);
      out.write(JSON.stringify(res) + "\n");
      await new Promise(r=>setTimeout(r, 300)); // small delay between requests
    }
  }

  const workers = Array.from({length: Math.min(MAX_CONCURRENCY, lines.length)}, () => worker());
  await Promise.all(workers);
  out.end();
}

if(require.main === module){
  const args = process.argv.slice(2);
  if(args.length < 2){
    console.log('Usage: node scripts/scrape-list.js <urls.txt> <out.jsonl> [css-selector]');
    process.exit(1);
  }
  const [inFile, outFile, selector] = args;
  run(inFile,outFile,selector).then(()=>console.log('Done')).catch(e=>{ console.error('Error', e); process.exit(2) });
}
