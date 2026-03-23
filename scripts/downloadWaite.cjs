const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '../public/images/cards');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const getUrl = (prefix, num) => `https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${prefix}${num.toString().padStart(2, '0')}.jpg`;

const mappings = [];
// Majors: 0 to 21 -> m00 to m21
for (let i = 0; i <= 21; i++) mappings.push({ id: i, url: getUrl('ar0', i) }); // Wait, let's test if it's m00 or ar00? The API showed c01.jpg. So m00 might be correct.
// wait, the API output I saw was c01, c02.
// Let's assume m00, w01, c01, s01, p01.
for (let i = 0; i <= 21; i++) mappings[i] = { id: i, url: getUrl('m', i) };
// Wands: 22 to 35
for (let i = 1; i <= 14; i++) mappings.push({ id: 21 + i, url: getUrl('w', i) });
// Cups: 36 to 49
for (let i = 1; i <= 14; i++) mappings.push({ id: 35 + i, url: getUrl('c', i) });
// Swords: 50 to 63
for (let i = 1; i <= 14; i++) mappings.push({ id: 49 + i, url: getUrl('s', i) });
// Pentacles: 64 to 77
for (let i = 1; i <= 14; i++) mappings.push({ id: 63 + i, url: getUrl('p', i) });

const download = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      // maybe major arcana is arXX ?
      if (url.includes('/m')) {
        const arUrl = url.replace('/m', '/ar0').replace('ar000', 'ar00').replace('ar001', 'ar01'); // handle 00-09
        // let's just make it simple
        return reject(new Error('Failed mapping'));
      }
      return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
    }
    const chunks = [];
    res.on('data', d => chunks.push(d));
    res.on('end', () => resolve(Buffer.concat(chunks)));
  }).on('error', reject);
});

async function run() {
  console.log('Downloading 78 WebP Tarot Cards...');
  for (const map of mappings) {
    try {
      let url = map.url;
      let buf;
      try {
        buf = await download(url);
      } catch (e) {
        if (url.includes('/m')) {
          url = url.replace('/m', '/ar0');
          if(map.id < 10) url = url.replace('ar00', 'ar0'); // ar00.jpg, ar01.jpg
          try { buf = await download(url); } catch(e2) {}
        }
        if (!buf) {
          // fallback to generic name if possible
          console.log('missing', url);
          continue;
        }
      }
      
      const outPath = path.join(targetDir, `${map.id}.webp`);
      await sharp(buf)
        .resize(350)
        .webp({ quality: 80 })
        .toFile(outPath);
      console.log(`Saved ${map.id}.webp`);
    } catch (e) {
      console.error(`Error on id ${map.id}`, e);
    }
  }
}

run();
