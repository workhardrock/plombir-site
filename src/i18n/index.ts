import ru from './ru';
import en from './en';

export const dicts = { ru, en };
export type Lang = keyof typeof dicts;

export function useT(locale: string | undefined) {
  return dicts[(locale as Lang) in dicts ? (locale as Lang) : 'ru'];
}

// Адрес главной на нужном языке
export const homeHref = (lang: Lang) => (lang === 'en' ? '/en/' : '/');
