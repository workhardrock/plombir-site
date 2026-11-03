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
  ['artists/fanky.jpg', 'ar-fanky', 640, 800],
  ['artists/arches.jpg', 'ar-arches', 640, 800],
  ['artists/dinamica.jpg', 'ar-dinamica', 640, 800],
  ['brand/img8660.png', 'mark-grain', 900],
  ['photos/stage-v.jpg', 'stage-v', 1000, 1250],
  ['photos/stage-h.jpg', 'stage-h', 1200, 900],
  ['photos/visual.jpg', 'hero-visual', 2400],
  // Лента «Наши ночи»
  ['photos/p29.jpg', 'gal-01', 900, 1200],
  ['photos/p02.jpg', 'gal-02', 900, 1200],
  ['photos/p19.jpg', 'gal-03', 900, 1200],
  ['photos/p03.jpg', 'gal-04', 900, 1200],
  ['photos/p32.jpg', 'gal-05', 900, 1200],
  ['photos/p28.jpg', 'gal-06', 900, 1200],
  ['photos/p45.jpg', 'gal-07', 900, 1200],
  ['photos/p35.jpg', 'gal-08', 900, 1200],
  ['photos/p05.jpg', 'gal-09', 900, 1200],
  ['photos/p39.jpg', 'gal-10', 900, 1200],
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

// Тени пальм с логотипа: тёмные пиксели становятся силуэтом с прозрачностью, остальное убирается.
{
  const { data, info } = await sharp(path.join(SRC, 'brand/palm-mark.jpg')).resize(1280).raw().toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
    const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    // логотип в центре вырезаем с мягким краем: остаются пальмы сверху и справа
    const x = (j / 4) % info.width / info.width * 640, y = Math.floor(j / 4 / info.width) / info.height * 640;
    const c = (v) => Math.min(1, Math.max(0, v));
    const keep = Math.max(c((175 - y) / 50), c((x - 495) / 70), c((y - 470) / 50) * c((x - 400) / 80));
    const a = c((0.34 - lum) / 0.2) * keep;
    px[j] = 0x2a; px[j + 1] = 0x0c; px[j + 2] = 0x02; px[j + 3] = Math.round(a * 255);
  }
  const out = await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 80, alphaQuality: 70 }).toFile(path.join(OUT, 'palm.webp'));
  console.log('palm', out.width + 'x' + out.height, Math.round(out.size / 1024) + 'kb');
}

// Мобильный кадр визуала первого экрана: левая часть, чтобы яркое ядро не попадало под текст
await sharp(path.join(SRC, 'photos/visual.jpg')).extract({ left: 60, top: 0, width: 865, height: 1125 }).resize(1000, 1300).webp({ quality: 66 }).toFile(path.join(OUT, 'hero-visual-m.webp'));
