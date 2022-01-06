import request from '../request'

/**
 * 获取奖励金列表
 * @param {*} params 
 */
export function getAwardsList(params) {
    return request({
      url: '/wallet/expert-awards',
      method: 'get',
      params
    })
}

/**
 * 奖励金总数统计
 * 
 */
export function getAwardsCount() {
    return request({
      url: '/wallet/expert-awards/stats/day',
      method: 'get'
    })
}

/**
 * 获取奖励金详情
 * @param {*} params 
 */
export function getAwardsDetails(award) {
    return request({
      url: `/wallet/expert-awards/${award}`,
      method: 'get'
    })
}