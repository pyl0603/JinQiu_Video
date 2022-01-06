import request from '@/utils/request'

/**
 * 查询系统关注的分类
 * @param {*} params 
 */
export function getKeys(params) {
    return request({
        url: `/sys-attentions/categories/${params}/types`,
        method: 'get',
        params
    })
}

/**
 * 查询系统关注指定key下的items
 * @param {*} params 
 */
export function getList(params) {
    return request({
        url: `/sys-attentions/${params}/items`,
        method: 'get',
        // params
    })
}


/**
 * 根据球员的名称匹配查询前20
 * @param {*} params 
 */
export function getPlayer(params) {
    return request({
        url: `/common/players`,
        method: 'get',
        params
    })
}
// export function getPlayer(params) {
//     return request({
//         url: `/players/search_name-zh/top20`,
//         method: 'get',
//         params
//     })
// }

/**
 * 新增系统关注item
 * @data {*} data 
 */
export function addConts(data) {
    return request({
        url: `/sys-attentions-items`,
        method: 'post',
        data
    })
}


/**
 * 根据球队的名称匹配查询前20
 * @param {*} params 
 */
export function getTeam(id, params) {
    return request({
        url: `/football-competitions/${id}/teams/search_name-zh-like`,
        method: 'get',
        params
    })
}

/**
 * 根据球队名称模糊匹配球队列表
 * @param {*} params 
 */
export function getTeamAll(params) {
    return request({
        url: `/common/teams`,
        method: 'get',
        params
    })
}
// export function getTeamAll(params) {
//     return request({
//         url: `/teams/search_name-zh/top20`,
//         method: 'get',
//         params
//     })
// }


/**
 * 新增系统关注item
 * @data {*} data 
 */
export function batchConts(id, data) {
    return request({
        url: `/sys-attentions/${id}/items/batch`,
        method: 'post',
        data
    })
}


/**
 * 设为/取消推荐
 * recommend-设为推荐
 * cancel-recommend-取消推荐
 * @data {*} data 
 */
export function putRec(id, data) {
    return request({
        url: `/sys-attentions/items/${id}/${data}`,
        method: 'put'
    })
}


/**
 * 获取推荐列表
 * @param {*} params 
 */
export function getRecList(params) {
    return request({
        url: `/sys-attentions/recommended-items`,
        method: 'get',
        params
    })
}

/**
 * 推荐排序
 * @param {*} params 
 */
export function putRecPos(id,data) {
    return request({
        url: `/sys-attentions/recommend-items/${id}/move-${data}`,
        method: 'put'
    })
}