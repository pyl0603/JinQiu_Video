import defaultSettings from '@/settings'

const title = defaultSettings.title || '发布系统-多趣想'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
