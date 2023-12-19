import polyglotI18nProvider from 'ra-i18n-polyglot'
import en from './en.js'
// import fr from 'ra-language-french';
// import ja from 'ra-language-japanese';
// import cn from 'ra-language-chinese-new';

const asyncMessages = {
  fr: () => import('ra-language-french').then((messages) => messages.default),
  ja: () => import('ra-language-japanese').then((messages) => messages.default),
  cn: () => import('./cn.js').then((messages) => messages.default),
}

const messagesResolver = (locale) => {
  if (locale === 'en') {
    // initial call, must return synchronously
    return en
  }
  // change of locale after initial call returns a promise
  return asyncMessages[locale]()
}

const i18nProvider = polyglotI18nProvider(messagesResolver, 'en', { allowMissing: true })

i18nProvider.getLocales = () => [
  { locale: 'en', name: '🇺🇸 English' },
  { locale: 'cn', name: '🇨🇳 Chinese | 简体中文' },
  { locale: 'fr', name: '🇫🇷 French | Français' },
  { locale: 'ja', name: '🇯🇵 Japanese | 日本語' },
]

export { i18nProvider }
