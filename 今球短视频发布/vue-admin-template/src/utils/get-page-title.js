import defaultSettings from '@/settings'

const title = defaultSettings.title || '今球短视频-发布平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
