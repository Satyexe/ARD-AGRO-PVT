// Pulls the real text/images of every inner page from the live site into database/seed/pages.json
// Run from project root:  npm run scrape   (then: npm run seed && npm run images)
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const file = path.join(__dirname, '..', '..', 'database', 'seed', 'pages.json');
const pages = JSON.parse(fs.readFileSync(file, 'utf8'));

(async () => {
  for (const p of pages) {
    try {
      const res = await fetch(`https://www.seminaagro.com/${p.slug}/`);
      if (!res.ok) throw new Error(res.status);
      const $ = cheerio.load(await res.text());
      const root = $('[data-elementor-type="wp-page"]').first();
      const sections = [];
      let cur = null;
      root.find('h1,h2,h3,h4,h5,p,li,img').each((_, el) => {
        const tag = el.tagName;
        const t = $(el).text().trim().replace(/\s+/g, ' ');
        if (/^h[1-5]$/.test(tag)) { if (t) { cur = { heading: t, body: '', image: '' }; sections.push(cur); } }
        else if (tag === 'img') { const src = $(el).attr('src') || ''; const m = src.match(/uploads\/\d{4}\/\d{2}\/([^?]+)$/); if (m && cur && !cur.image) cur.image = m[1]; }
        else if (t) { if (!cur) { cur = { heading: '', body: '', image: '' }; sections.push(cur); } cur.body += (cur.body ? '\n\n' : '') + t; }
      });
      const clean = sections.filter(s => s.body || s.image);
      if (clean.length) { p.sections = clean; if (!p.summary || p.summary.startsWith('Learn more')) p.summary = clean.find(s => s.body)?.body.slice(0, 220) || p.summary; }
      console.log('✔', p.slug, clean.length, 'sections');
    } catch (e) { console.log('✘', p.slug, e.message); }
  }
  fs.writeFileSync(file, JSON.stringify(pages, null, 2));
})();
