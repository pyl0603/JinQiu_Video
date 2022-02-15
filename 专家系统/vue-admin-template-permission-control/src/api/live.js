import request from '@/utils/request'

/**
 * 获取频道类型
 * @param {string} params -频道类型id
 */
export function getType() {
  return request({
      url: `/live/channel/types`,
      method: 'get'
  })
}


/**
 * 获取频道列表
 * @param {string} params -频道类型id
 */
export function getList(params) {
  return request({
      url: `/live/types/${params}/channels`,
      method: 'get'
  })
}


/**
 * 添加频道
 * @param {*} data 添加数据
 */
export function addItmes(data) {
  return request({
      url: '/live/channels',
      method: 'post',
      data
  })
}


/**
 * 修改频道信息
 * @param {*} data 
 */
export function updateItems(id, data) {
  return request({
      url: `/live/channels/${id}`,
      method: 'post',
      data
  })
}


/**
 * 锁定/解锁频道
 * @param {*} data -lock(锁定),unlock(解锁)
 */
export function putItems(id,data) {
  return request({
      url: `/live/channels/${id}/${data}`,
      method: 'put'
  })
}


/**
 * 移动频道
 * @param { string } data - up、down、top
 */
export function moveItems(type,id,data) {
  return request({
      url: `/live/channels/types/${type}/${id}/move-${data}`,
      method: 'put'
  })
}


/**
 * 查询主播
 * @param {string} params -频道类型id
 */
export function getAnchorList(params) {
  return request({
      url: `/streamer-rooms`,
      method: 'get',
      params
  })
}



/**
 * 查询主播/带粉丝数
 * @param {string} params -频道类型id
 */
export function getAncListFans(params) {
  return request({
      url: `/streamer-rooms/more`,
      method: 'get',
      params
  })
}



/**
 * 主播-禁播/解禁
 * @param {string} id -主播id
 * @param {string} params -禁播：forbidden,解禁：free
 */
export function anchSwitch(id,params) {
  return request({
      url: `/streamers/${id}/${params}`,
      method: 'patch'
  })
}



/**
 * 主播-推荐
 * @param {string} id -主播id
 * @param {object} params -推荐设置
 */
export function anchRecm(id,params) {
  return request({
      url: `/streamers/${id}/recommend`,
      method: 'patch',
      params
  })
}



/**
 * 主播-移除
 * @param {string} id -主播id
 */
export function anchDel(id) {
  return request({
      url: `/streamers/${id}/remove`,
      method: 'delete'
  })
}

/**
 * 主播-强制下播
 * @param {string} id -主播id
 */
export function anchForce(id,params) {
  return request({
      url: `/streamers/${id}/force`,
      method: 'patch'
  })
}


/**
 * 主播申请列表查询
 * @param {string} params -频道类型id
 */
export function getAnchorApply(params) {
  return request({
      url: `/streamer/audit-records`,
      method: 'get',
      params
  })
}


/**
 * 主播-审核操作
 * @param {string} id -主播id
 */
export function checkedAnchor(id,params) {
  return request({
      url: `/streamer/audit-records/${id}/status`,
      method: 'patch',
      params
  })
}


/**
 * 主播-获取banner列表
 * @param {string} params 
 */
export function getBanner(params) {
  return request({
      url: `/settings/streamer-banner`,
      method: 'get',
      params
  })
}


/**
 * 主播-banner列表
 * @param {string} params 
 */
export function putBanner(data) {
  return request({
      url: `/settings/streamer-banner`,
      method: 'put',
      data
  })
}