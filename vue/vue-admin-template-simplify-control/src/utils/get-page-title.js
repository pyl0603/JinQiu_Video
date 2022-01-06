import defaultSettings from '@/settings'

const title = defaultSettings.title || '大后台-多趣想'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
