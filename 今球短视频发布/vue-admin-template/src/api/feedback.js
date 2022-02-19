import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params 
 */
export function getIndex(params) {
    return request({
        url: '/client-admin/feedback',
        method: 'get',
        params
    })
}

/**
 * 反馈回复
 */
export function feedback(id, data) {
    return request({
        url: `client-admin/feedback/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除反馈
 */
export function delFeedback(data) {
    return request({
        url: `/client-admin/feedback/${data}`,
        method: 'delete'
    })
}

/**
 * 反馈详情
 */
export function feedbackDet(params) {
    return request({
        url: `/client-admin/feedback/${feedback}`,
        method: 'get'
    })
}