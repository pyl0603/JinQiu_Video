import request from '@/utils/request'

/**
 * 专家审核列表
 * @param {*} params 
 */
export function getExpertApplyList(params) {
    return request({
        url: '/expert/apply/list',
        method: 'get',
        params
    })
}

/**
 * 专家审核
 */
export function checkedExpert(data) {
    return request({
        url: '/expert/checked',
        method: 'put',
        data
    })
}


/**
 * 方案列表
 */
export function planList(params) {
    return request({
        url: '/plan/list',
        method: 'get',
        params
    })
}


/**
 * 方案审核
 */
export function checkedPlan(data) {
    return request({
        url: '/plan/review',
        method: 'put',
        data
    })
}

