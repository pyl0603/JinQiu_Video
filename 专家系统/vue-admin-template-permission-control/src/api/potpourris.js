import request from '@/utils/request'

/**
 * 比赛集锦列表（已排序）
 * @param {*} params 
 */
export function getPotp(params) {
    return request({
        url: `/football/matches/${params}/potpourris`,
        method: 'get'
    })
}



/**
 * 添加足球比赛集锦
 * @param {*} params 
 */
export function addPotp(id, data) {
    return request({
        url: `/football/matches/${id}/potpourris`,
        method: 'post',
        data
    })
}



/**
 * 修改集锦信息
 * @param {*} params 
 */
export function putPotp(id, data) {
    return request({
        url: `/football/potpourris/${id}`,
        method: 'put',
        data
    })
}



/**
 * 删除集锦信息
 * @param {*} params 
 */
export function delPotp(data) {
    return request({
        url: `/football/potpourris/${data}`,
        method: 'delete'
    })
}



/**
 * 足球集锦排序
 * @param {*} params 
 */
export function sortPotp(id, data) {
    return request({
        url: `/football/matches/${id}/potpourris-sort`,
        method: 'post',
        data
    })
}