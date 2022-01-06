import request from '@src/request'

/**
 * 获取统计信息
 * @param {*} params 
 */
export function getTotal(params) {
    console.log(params);
    return request({
        url: '/ad/analysis/summary',
        method: 'get',
        params
    })
}


/**
 * 获取当日信息
 * @param {*} params 
 */
export function getToday(params) {
    return request({
        url: '/ad/analysis/today',
        method: 'get',
        params
    })
}