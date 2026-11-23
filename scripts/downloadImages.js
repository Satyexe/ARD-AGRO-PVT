// Downloads every image used by the site into frontend/public/images (and backend/uploads).
// Run from project root:  npm run images
const fs = require('fs');
const path = require('path');
const BASE = 'https://www.seminaagro.com/wp-content/uploads/';
const rel = f => (f.includes('/') ? f : `2024/09/${f}`);
const seed = f => JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'database', 'seed', f), 'utf8'));
const out = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
const up = path.join(__dirname, '..', 'uploads');

const s = seed('settings.json');
const files = new Set([s.heroImage, s.newsletterImage, ...s.counters.map(c => c.iconFile), s.logo, s.logoFooter, s.favicon, s.mapImage, s.md.image, s.story.image, s.about.introImage, s.about.banner, s.about.joinImage, ...s.whoWeAre.images]);
[...seed('pages.json'), ...seed('testimonials.json'), ...seed('team.json'), ...seed('partners.json')].forEach(o => {
  if (o.image) files.add(o.image);
  if (o.cardImage) files.add(o.cardImage);
  (o.sections || []).forEach(x => { x.image && files.add(x.image); (x.images || []).forEach(i => files.add(i)); });
});

(async () => {
  fs.mkdirSync(out, { recursive: true });
  let ok = 0, fail = 0;
  for (const f of [...files].filter(Boolean)) {
    const dest = path.join(out, rel(f));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest)) { ok++; continue; }
    try {
      const url = BASE + rel(f);
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
      fs.mkdirSync(path.dirname(path.join(up, rel(f))), { recursive: true });
      fs.copyFileSync(dest, path.join(up, rel(f)));
      ok++; console.log('✔', f);
    } catch (e) { fail++; console.log('✘', f, e.message); }
  }
  console.log(`\nDone. ${ok} saved, ${fail} failed.`);
})();
