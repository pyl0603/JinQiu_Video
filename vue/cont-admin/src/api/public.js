import request from '@/utils/request'

/**
 * 获取精选比赛
 * @param {*} params 
 */
export function getMatches(params) {
    return request({
        url: '/client-publish/data/channel-matches',
        method: 'get',
        params
    })
}

/**
 * 获取精选比赛
 * @param {*} params 
 */
export function getMatchesReport(params) {
    return request({
        url: `/client-publish/media/${params}/report`,
        method: 'get'
    })
}
