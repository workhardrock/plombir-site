// Данные, которые не зависят от языка. Тексты — в src/i18n/ru.ts и en.ts.

export const contacts = {
  email: 'info@plombir.events', // сюда идут все заявки: демо, букинг, заказ мероприятий
  phone: '+7 999 164 14 29',
  partnersPhone: '+7 906 122 16 99',
  ticketsEmail: 'info@qtickets.ru',
  telegram: 'https://t.me/PLMBR',
  instagram: 'https://instagram.com/plmbr',
  inn: '165714390934',
  company: 'PLOMBIR PROMO GROUP',
};

export const music = {
  beatport: 'https://www.beatport.com/label/plombir-music/109879',
  spotify: 'https://open.spotify.com/album/1IBW3itjDsGsphtB9zVJnS',
  soundcloud: 'https://on.soundcloud.com/zSMDQAUNBZCrsawT7',
  youtube: 'https://www.youtube.com/channel/UCMsH7U8Q8rLettJr1PEfyDA/about',
};

// Страницы, которые остаются на Tilda (отдаются через прокси, см. DEPLOY.md)
export const tilda = {
  events: '/events',
  shop: '/shop',
  press: '/smionas',
  phuket: '/phuket',
};

export const legalHrefs = ['/offerta', '/policy', '/soglashenye', '/oplata_bank_kartoy', '/vozvrat', '/vozvratbileta'];

// Ближайшие события. start — для обратного отсчёта, с часовым поясом площадки.
export const upcoming = [
  { start: '2026-11-28T22:00:00+03:00', date: '28.11', poster: '/img/ev-2811.webp', tickets: 'https://voroh.ru/event/1044113/' },
  { start: '2026-12-24T20:00:00+07:00', date: '24.12', poster: '/img/ev-2412.webp', tickets: tilda.phuket },
];

export const past = [
  { date: '30.10.26', poster: '/img/ev-3010.webp' },
  { date: '09.10.26', poster: '/img/ev-0910.webp' },
  { date: '29.08.26', poster: '/img/ev-2908.webp' },
  { date: '01.08.26', poster: '/img/ev-0108.webp' },
  { date: '17.07.26', poster: '/img/ev-1707.webp' },
  { date: '06.06.26', poster: '/img/ev-0606.webp' },
];

export const releases = [
  { cat: 'PLMBR066', artist: 'Volobotti, Gar1sson', track: 'Different', cover: '/img/pl066.webp' },
  { cat: 'PLMBR065', artist: 'Space Food', track: '1000 Desires', cover: '/img/pl065.webp' },
  { cat: 'PLMBR064', artist: 'Fairtone, Tiger Smth', track: 'Demension', cover: '/img/pl064.webp' },
];

export const artists = [
  { name: 'Disharino', photo: '/img/ar-disharino.webp' },
  { name: 'Maydellin', photo: '/img/ar-maydellin.webp' },
  { name: 'Anton Make', photo: '/img/ar-antonmake.webp' },
  { name: 'Fanky', photo: '/img/ar-fanky.webp' },
];

export const cases = [
  { guests: '1000', year: '2022' },
  { guests: '500', year: '2023' },
  { guests: '450', year: '2024' },
];

// Артисты, игравшие на событиях PLOMBIR (по архиву событий).
export const playedHere = [
  'Robbie Akbal', 'D-Nox', 'LI|LU', 'Zuma Dionys', 'Andre P', 'Gleb Filipchenkow',
  'Para Noir', 'Fairtone', 'Acrobat', 'Anton Make', 'Dinamica', 'Agraba', 'Holymolly',
];
