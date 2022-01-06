import defaultSettings from '@/settings'

const title = defaultSettings.title || '评论系统-多趣想'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
