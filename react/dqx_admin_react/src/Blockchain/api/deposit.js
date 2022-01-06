import request from '../request'

/**
 * 充值管理 - 发布
 * @param {*} data 
 */
export function releaseGoods(data) {
  return request({
    url: '/recharge-goods',
    method: 'post',
    data
  })
}

/**
 * 充值管理 - 列表
 * @param {*} params 
 */
export function getGoods() {
  return request({
    url: '/recharge-goods',
    method: 'get'
  })
}

/**
 * 充值管理 - 查看详细
 * @param {*} params 
 */
export function getSingGood(id) {
  return request({
    url: `/recharge-goods/${id}`,
    method: 'get'
  })
}

/**
 * 充值管理 - 编辑详细
 * @param {*} params 
 */
export function editSingGood(id, data) {
  return request({
    url: `/recharge-goods/${id}`,
		method: 'put',
		data
  })
}

/**
 * 充值管理 - 删除详细
 * @param {*} params 
 */
export function delSingGood(id) {
  return request({
    url: `/recharge-goods/${id}`,
		method: 'delete'
  })
}

/**
 * 充值管理 - 下架
 * @param {*} params 
 */
export function downSingGood(id) {
  return request({
    url: `/recharge-goods/${id}/down`,
		method: 'patch'
  })
}

/**
 * 充值管理 - 移动
 * @param {*} params 
 */
export function moveSingGood(id, params) {
  return request({
    url: `/recharge-goods/${id}/moving`,
    method: 'patch',
    params
  })
}

/**
 * 充值管理 - 上架
 * @param {*} params 
 */
export function upSingGood(id) {
  return request({
    url: `/recharge-goods/${id}/up`,
		method: 'patch'
  })
}

/**
 * 充值管理 - 回收站列表
 * @param {*} params 
 */
export function getDelGoods() {
  return request({
    url: '/deleted-recharge-goods',
    method: 'get'
  })
}

/**
 * 充值管理 = 还原
 */
export function restoreSingGood(id) {
  return request({
    url: `/recharge-goods/${id}/restore`,
		method: 'patch'
  })
}

/**
 * 充值管理 = 操作日志
 */
export function getGoodLogs(params) {
  return request({
    url: '/recharge-goods/opt-logs',
    method: 'get',
    params
  })
}
