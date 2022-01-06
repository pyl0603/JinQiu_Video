import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getDailyStatistics(params) {
    return request({
        url: '/push/daily-statistics',
        method: 'get',
        params
    })
}
