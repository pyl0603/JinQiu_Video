import request from '@/utils/request'



/**
 * 拉新活动列表
 * @param {*} params 
 *
 */
export function getInvi(params) {
    return request({
        url: `/gift/activities/list`,
        method: 'get',
        params
    })
}


/**
 * 新增拉新活动
 * @data {*} data 
 */
export function addInvi(data) {
  return request({
      url: `/gift/active`,
      method: 'post',
      data
  })
}


/**
 * 修改拉新活动
 * @data {*} data 
 */
export function putInvi(id,data) {
  return request({
      url: `/gift/active/${id}`,
      method: 'post',
      data
  })
}



/**
 * 删除拉新活动
 * @data {*} data 
 */
export function delInvi(id,data) {
  return request({
      url: `/gift/active/${id}`,
      method: 'delete',
      data
  })
}

/**
 * 兑换码列表
 * @param {*} params 
 *
 */
export function getCodelist(params) {
    return request({
        url: `/redeem-codes`,
        method: 'get',
        params
    })
}

/**
 * 使用兑换码
 * @data {*} data 
 */
export function useCode(data) {
  return request({
      url: `/redeem-codes/${data}/done`,
      method: 'post',
      data
  })
}


/**
 * 获取全部活动兑换统计
 * @param {*} params 
 *
 */
export function getGiftOut(params) {
  return request({
      url: `/statistics/gift-out`,
      method: 'get',
      params
  })
}



/**
 * 获取单个活动兑换统计
 * @param {*} params 
 *
 */
export function getGiftSingle(params) {
  return request({
      url: `/statistics/activities/${params}/redeem-code`,
      method: 'get',
      params
  })
}


/**
 * 获取活动在时间段内兑换统计
 * @param {*} params 
 *
 */
export function getGroupsGift(group,params) {
  return request({
      url: `/statistics/groups/${group}/gift-stats/date-range`,
      method: 'get',
      params
  })
}



/**
 * 推广情况区间统计
 * @param {*} params 
 *
 */
export function getRangeCount(params) {
  return request({
      url: `/statistics/invitation-stats/range`,
      method: 'get',
      params
  })
}



/**
 * 头部统计
 * @param {*} params 
 *
 */
export function getTitleCount(params) {
  return request({
      url: `/statistics/main-stats`,
      method: 'get',
      params
  })
}



/**
 * 获取礼品
 * @param {*} params 
 *
 */
export function getGift(params) {
  return request({
      url: `/gift/list`,
      method: 'get',
      params
  })
}


/**
 * 添加礼品
 * @data {*} data 
 */
export function addGift(data) {
  return request({
      url: `/gift`,
      method: 'post',
      data
  })
}


/**
 * 修改礼品
 * @data {*} data 
 */
export function putGift(id,data) {
  return request({
      url: `/gift/${id}`,
      method: 'put',
      data
  })
}

/**
 * 修改礼品状态
 * @param {*} data 
 */
export function setStatus(id, data) {
  return request({
      url: `/gift/${id}/status`,
      method: 'patch',
      data
  })
}


/**
 * 删除礼品
 * @data {*} data 
 */
export function delGift(id,data) {
  return request({
      url: `/gift/${id}`,
      method: 'delete'
  })
}


/**
 * 物流的商品列表
 * @param {*} params 
 *
 */
export function getDelivery(params) {
  return request({
      url: `/delivery/list`,
      method: 'get',
      params
  })
}



/**
 * 修改收件人信息
 * @data {*} data 
 */
export function editDelivUser(orderId,data) {
  return request({
      url: `/delivery/info/${orderId}`,
      method: 'post',
      data
  })
}


/**
 * 发货
 * @data {*} data 
 */
export function sendDeliv(orderId,data) {
  return request({
      url: `/delivery/send/${orderId}`,
      method: 'post',
      data
  })
}


/**
 * 发货
 * @data {*} data 
 */
export function putTrackNo(orderId,data) {
  return request({
      url: `/delivery/trackNo/${orderId}`,
      method: 'post',
      data
  })
}