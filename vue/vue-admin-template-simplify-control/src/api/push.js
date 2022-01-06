import request from '@/utils/request'

/**
 * 获取推送日志列表h和推送的日统计
 * @param {*} params 
 */
export function getPushLogs(params) {
    return request({
        url: '/push-logs',
        method: 'get',
        params
    })
}

/**
 * 获取推送日志详情
 * @param {*} params 
 */

