import request from '@/utils/request'

/**
 * 赛事分页列表
 * @param {*} params 
 */
export function getMatch(params) {
    return request({
        url: '/data/competitions',
        method: 'get',
        params
    })
}

/**
 * 获取精选比赛
 * @param {*} params 
 */
export function getMatches(params) {
    return request({
        url: '/data/matches',
        method: 'get',
        params
    })
}

/**
 * 文章列表
 * @param {*} params 
 */
export function getArticles(params) {
    return request({
        url: '/article/page',
        method: 'get',
        params
    })
}


/**
 * 视频列表
 * @param {*} params 
 */
export function getVideos(params) {
    return request({
        url: '/video/page',
        method: 'get',
        params
    })
}