import request from '@src/request'

/**
 * 查询操作日志列表
 * @param {*} params 
 */
export function getOptLogs(params) {
    return request({
        url: '/opt-logs',
        method: 'get',
        params
    })
}