import request from '@/utils/request'

/**
 * 获取推送统计
 * @param {*} params
 */
export function getDailyStatistics(params) {
    return request({
        url: '/push/daily-statistics',
        method: 'get',
        params
    })
}

/**
 * 获取推送列表
 * @param {*} params
 */
export function getPushLogs(params) {
    return request({
        url: '/push-logs',
        method: 'get',
        params
    })
}
