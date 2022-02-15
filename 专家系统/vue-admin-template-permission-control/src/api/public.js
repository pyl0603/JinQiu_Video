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



/**
 * 关注推荐列表
 * @param {*} params 
 */
export function getRec(params) {
    return request({
        url: '/sys-attentions/recommended-items',
        method: 'get',
        params
    })
}
 
/**
 * 赛事分页列表
 * @param {*} params 
 */
// export function getSelfMatch(params) {
//     return request({
//         url: '/common-matches',
//         method: 'get',
//         params
//     })
// }

export function getSelfMatch(params) {
    return request({
        url: '/common/matches',
        method: 'get',
        params
    })
}
export function getComments(params) {
    return request({
        url: '/comments',
        method: 'get',
        params
    })
}
export function commentsPass(data) {
    return request({
        url: `/comments/${data}/pass`,
        method: 'post'
    })
}
export function commentsDeny(data,reason) {
    return request({
        url: `/comments/${data}/deny/${reason}`,
        method: 'post'
    })
}
export function commentsDenyList() {
    return request({
        url: `/comments/deny-reasons`,
        method: 'get'
    })
}
