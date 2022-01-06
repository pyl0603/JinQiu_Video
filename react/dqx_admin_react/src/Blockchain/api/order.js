import request from '../request'

/**
 * 获取列表
 * @param {*} params 
 */
export function getOrder(url,params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}


/**
 * 提现订单
 * @param {*} params 
 */
export function getFundOrder(params) {
    return request({
      url: '/fund-orders',
      method: 'get',
      params
    })
  }
  

/**
 * 充值管理 - 列表
 * @param {*} params 
 */
export function getOrderDet(params) {
  return request({
    url: `/orders/${params}`,
    method: 'get'
  })
}


/**
 * 审核通过提现订单
 * @param {*} data 
 */
export function orderCheckPass(data) {
  return request({
    url: `/orders/${data}/check-pass`,
    method: 'post'
  })
}

/**
 * 审核通过提现订单
 * @param {*} data 
 */
export function orderCheckDeny(id,data) {
  return request({
    url: `/orders/${id}/check-deny`,
    method: 'post',
    data
  })
}
  

/**
 * 订单情况统计
 * @param {*} params 
 */
export function getOrderStats(params) {
  return request({
    url: `/orders-stats`,
    method: 'get',
    params
  })
}

/**
 * 用户订单情况统计
 * @param {id} user 
 */
export function ordersStats(user) {
  return request({
    url: `/users/${user}/orders-stats`,
    method: 'get'
  })
}