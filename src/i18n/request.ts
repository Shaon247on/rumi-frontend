import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const [
    shared,
    home,
    comingSoon,
    ingredients,
    aboutUs,
    auth,
    skinAnalyzerAnalysis,
    checkout,
    productDetails,
    productsPage,
    yourRoutine,
    profile,
    aiChatAssistant,
    privacy,
    terms,
    cookies,
    ourStory,
    contact,
  ] = await Promise.all([
    import(`./locales/${locale}/shared.json`),
    import(`./locales/${locale}/home.json`),
    import(`./locales/${locale}/comingSoon.json`),
    import(`./locales/${locale}/ingredients.json`),
    import(`./locales/${locale}/about-us.json`),
    import(`./locales/${locale}/auth.json`),
    import(`./locales/${locale}/skin-analyzer-analysis.json`),
    import(`./locales/${locale}/checkout.json`),
    import(`./locales/${locale}/product-details.json`),
    import(`./locales/${locale}/products.json`),
    import(`./locales/${locale}/your-routine.json`),
    import(`./locales/${locale}/profile.json`),
    import(`./locales/${locale}/ai-chat-assistant.json`),
    import(`./locales/${locale}/privacy.json`),
    import(`./locales/${locale}/terms.json`),
    import(`./locales/${locale}/cookies.json`),
    import(`./locales/${locale}/our-story.json`),
    import(`./locales/${locale}/contact.json`),
  ])

  return {
    locale,
    messages: {
      shared: shared.default,
      home: home.default,
      comingSoon: comingSoon.default,
      ingredients: ingredients.default,
      aboutUs: aboutUs.default,
      auth: auth.default,
      skinAnalyzerAnalysis: skinAnalyzerAnalysis.default,
      checkout: checkout.default,
      productDetails: productDetails.default,
      productsPage: productsPage.default,
      yourRoutine: yourRoutine.default,
      profile: profile.default,
      aiChatAssistant: aiChatAssistant.default,
      privacy: privacy.default,
      terms: terms.default,
      cookies: cookies.default,
      ourStory: ourStory.default,
      contact: contact.default,
    },
    timeZone: 'Asia/Riyadh',
  }
})
