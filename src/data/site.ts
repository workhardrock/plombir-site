// Данные, которые не зависят от языка. Тексты — в src/i18n/ru.ts и en.ts.

export const contacts = {
  email: 'info@plombir.events', // сюда идут все заявки: демо, букинг, заказ мероприятий
  phone: '+7 999 164 14 29',
  partnersPhone: '+7 906 122 16 99',
  ticketsEmail: 'info@plombir.events',
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
  { start: '2026-11-28T22:00:00+03:00', date: '28.11', poster: '/img/ev-2811.webp', tickets: 'https://voroh.ru/event/1044113/', widget: 'https://voroh.ru/widget/event/1044113/01a1a509-c104-8164-9b4e-8cf8cc30e8c5/' },
  { start: '2026-12-24T20:00:00+07:00', date: '24.12', poster: '/img/ev-2412.webp', tickets: tilda.phuket },
];

// Анонсы следующего сезона: дата и площадка, без билетов
export const soon = [
  { date: '22.05' },
  { date: '19.06' },
  { date: '17.07' },
  { date: '14.08' },
];

// preview — отрывок трека в public/audio (mp3, 30–60 секунд). Без него кнопка не показывается.
export const releases: { cat: string; artist: string; track: string; cover: string; preview?: string }[] = [
  { cat: 'PLMBR066', artist: 'Volobotti, Gar1sson', track: 'Different', cover: '/img/pl066.webp', preview: '/audio/pl066.mp3' },
  { cat: 'PLMBR065', artist: 'Space Food', track: '1000 Desires', cover: '/img/pl065.webp', preview: '/audio/pl065.mp3' },
  { cat: 'PLMBR064', artist: 'Fairtone, Tiger Smth', track: 'Demension', cover: '/img/pl064.webp', preview: '/audio/pl064.mp3' },
];

export const artists = [
  { name: 'Disharino', photo: '/img/ar-disharino.webp' },
  { name: 'Maydellin', photo: '/img/ar-maydellin.webp' },
  { name: 'Anton Make', photo: '/img/ar-antonmake.webp' },
  { name: 'Fanky', photo: '/img/ar-fanky.webp' },
];

export const cases = [
  { guests: '1580', year: '2024' },
  { guests: '1340', year: '2024' },
  { guests: '1200', year: '2024' },
];

// Артисты, игравшие на событиях PLOMBIR (по архиву событий).
export const playedHere = [
  'Robbie Akbal', 'D-Nox', 'LI|LU', 'Zuma Dionys', 'Andre P', 'Gleb Filipchenkow',
  'Para Noir', 'Fairtone', 'Acrobat', 'Anton Make', 'Dinamica', 'Agraba', 'Holymolly',
];

// Видео в блоке «Ночная культура»: mp4 без звука в public/video.
// square — для компьютера, vertical — для телефона. null — вместо видео показывается фото.
export const introVideo: { square: string; vertical: string; poster: string } | null = {
  square: '/video/intro-sq.mp4',
  vertical: '/video/intro-v.mp4',
  poster: '/img/intro-poster.jpg',
};
