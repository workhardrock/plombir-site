import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://plombir.events',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: { inlineStylesheets: 'auto' },
});
