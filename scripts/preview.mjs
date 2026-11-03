// Собирает из dist превью для публикации в Claude: CSS внутри страниц, пути относительные,
// ссылки на страницы Tilda ведут на текущий plombir.events. На сайт это не влияет.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const out = path.resolve('../preview');
fs.mkdirSync(out, { recursive: true });

const inlineCss = (html) => html.replace(/<link rel="stylesheet" href="\/_astro\/([^"]+)">/g, (_, f) => {
  const css = fs.readFileSync(path.join(dist, '_astro', f), 'utf8')
    .replace(/url\(\/_astro\//g, 'url(./assets/')
    .replace(/url\(\/(img|fonts)\//g, 'url(./$1/');
  return `<style>${css}</style>`;
});

const fix = (html, enHref) => inlineCss(html)
  .replace(/(["'(])\/(img|fonts)\//g, '$1./$2/')
  .replace(/href="\/en\/"/g, `href="${enHref}"`)
  .replace(/href="\/"/g, 'href="./"')
  .replace(/href="\/([a-z_]+)"/g, 'href="https://plombir.events/$1"')
  .replace(/<title>[^<]*<\/title>/, '<title>Новый сайт PLOMBIR</title>');

// Главная: без собственного каркаса, его добавляет публикация
const ru = fix(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'), './en.html');
const head = ru.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>/g, '');
const body = ru.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
fs.writeFileSync(path.join(out, 'index.html'), `${head}\n<style>:root{color-scheme:dark}</style>\n${body}\n<script>document.documentElement.lang='ru';document.body.dataset.circle='places';</script>`);

// Английская версия — отдельный полный документ рядом
fs.writeFileSync(path.join(out, 'en.html'), fix(fs.readFileSync(path.join(dist, 'en', 'index.html'), 'utf8'), './en.html'));
console.log('preview: index.html + en.html');
