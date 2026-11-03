// Готовит изображения из src-assets в public/img (webp, нужные размеры).
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('../src-assets');
const OUT = path.resolve('public/img');
fs.mkdirSync(OUT, { recursive: true });

// [исходник, имя, ширина, (высота для кропа)]
const jobs = [
  ['photos/p07.jpg', 'hero-gate', 2400],
  ['photos/p07.jpg', 'hero-gate-m', 1000, 1000],
  ['photos/p51.jpg', 'moon-girl', 900],
  ['photos/p17.jpg', 'stage-laser', 1600],
  ['photos/p19.jpg', 'orange-crowd', 1600],
  ['photos/p25.jpg', 'blue-stage', 1200],
  ['photos/p44.jpg', 'white-night', 1200],
  ['photos/p46.jpg', 'flags-stage', 1200],
  ['photos/p29.jpg', 'performer', 900],
  ['photos/p09.jpg', 'fire-gate', 1200],
  ['photos/p10.jpg', 'dome-dusk', 1600],
  ['photos/p47.jpg', 'white-place', 1600],
  ['photos/p41.jpg', 'crowd-blue', 1200],
  ['photos/p02.jpg', 'dj-hands', 900],
  ['photos/p22.jpg', 'club-red', 1200],
  ['photos/p36.jpg', 'golden-room', 1200],
  ['covers/pl066.jpg', 'pl066', 900],
  ['covers/pl065.jpg', 'pl065', 900],
  ['covers/pl064.jpg', 'pl064', 900],
  ['covers/pl063.jpg', 'pl063', 900],
  ['covers/pl062.jpg', 'pl062', 900],
  ['events/e2811.jpg', 'ev-2811', 900],
  ['events/e2412.jpg', 'ev-2412', 900],
  ['events/e3010.jpg', 'ev-3010', 400],
  ['events/e0910.jpg', 'ev-0910', 400],
  ['events/e2908.png', 'ev-2908', 400],
  ['events/e0108.jpg', 'ev-0108', 400],
  ['events/e1707.png', 'ev-1707', 400],
  ['events/e0606.jpg', 'ev-0606', 400],
  ['artists/disharino.jpg', 'ar-disharino', 640, 800],
  ['artists/maydellin.png', 'ar-maydellin', 640, 800],
  ['artists/daria.jpg', 'ar-daria', 640, 800],
  ['artists/sanjee.jpg', 'ar-sanjee', 640, 800],
  ['artists/aaron.jpg', 'ar-aaron', 640, 800],
  ['artists/acrobat.png', 'ar-acrobat', 640, 800],
  ['artists/antonmake.jpg', 'ar-antonmake', 640, 800],
  ['artists/arches.jpg', 'ar-arches', 640, 800],
  ['artists/dinamica.jpg', 'ar-dinamica', 640, 800],
  ['brand/img8660.png', 'mark-grain', 900],
];

for (const [src, name, w, h] of jobs) {
  const out = path.join(OUT, `${name}.webp`);
  let img = sharp(path.join(SRC, src)).rotate();
  img = h ? img.resize(w, h, { fit: 'cover', position: 'attention' }) : img.resize({ width: w, withoutEnlargement: true });
  const info = await img.webp({ quality: 74 }).toFile(out);
  console.log(name, info.width + 'x' + info.height, Math.round(info.size / 1024) + 'kb');
}

// Иконки и картинка для соцсетей
const PUB = path.resolve('public');
const svg = fs.readFileSync(path.join(PUB, 'favicon.svg'));
await sharp(svg).resize(48, 48).png().toFile(path.join(PUB, 'favicon.png'));
await sharp(svg).resize(180, 180).png().toFile(path.join(PUB, 'apple-touch-icon.png'));
await sharp(path.join(SRC, 'photos/p07.jpg')).rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toFile(path.join(PUB, 'og.jpg'));
console.log('icons + og ready');
