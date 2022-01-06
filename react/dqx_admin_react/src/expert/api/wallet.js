import request from '../request'

/**
 *  我的钱包
 * @param {*}  params
 */
export function wallet() {
  return request({
    url: '/my-wallet',
    method: 'get'
  })
}

/**
 * 得到收益列表
 */
export function getInCome() {
  return request({
    url: '/orders-in',
    method: 'get'
  })
}

/**
 * 得到提现列表
 */
export function getWithDraw() {
  return request({
    url: '/orders-fund',
    method: 'get'
  })
}

/**
 * 发起提现
 */
export function fundOrder(data) {
  return request({
    url: '/fund-orders',
    method: 'post',
    data
  })
}

/**
 * 审核提现
 */
export function confirmOrder(order) {
  return request({
    url: `/fund-orders/${order}/confirm`,
    method: 'post'
  })
}

/**
 * 支付宝用户认证
 */
export function alipay(code) {
  return request({
    url: `/user-verify/alipay/${code}`,
    method: 'get'
  })
}
