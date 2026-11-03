// Карта сайта: новые страницы и лендинги, которые остаются на Tilda.
import type { APIRoute } from 'astro';
import { tilda } from '../data/site';

const paths = ['/', '/en/', tilda.phuket, tilda.events];

export const GET: APIRoute = ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const urls = paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
