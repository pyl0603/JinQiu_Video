import request from '../request'


/**
 * 获取推流地址
 * @param {*} params
 */
export function getAddress(params) {
  return request({
    url: `/streamer-rooms/${params}/push-streaming-address`,
    method: 'get'
  })
}



/**
 * 获取推流地址
 * @param {*} params
 */
export function getPullAddress(params) {
  return request({
    url: `/streamer-rooms/${params}/pull-streaming-address`,
    method: 'get'
  })
}



/**
 * 获取推流状态
 * @param {*} params
 */
export function getPullStatus(params) {
  return request({
    url: `/streamer-rooms/${params}/streamer-status`,
    method: 'get'
  })
}


/**
 * 下播
 * @param {*} params
 */
export function liveStop(params) {
  return request({
    url: `/stream/stop`,
    method: 'patch'
  })
}


/**
 * 开播
 * @param {*} params
 */
export function liveBegin(params) {
  return request({
    url: `/stream/begin`,
    method: 'patch'
  })
}



/**
 * 暂停
 * @param {*} params
 */
export function livePause(params) {
  return request({
    url: `/streamer/pause`,
    method: 'patch'
  })
}


/**
 * 复播
 * @param {*} params
 */
export function liveRecover(params) {
  return request({
    url: `/streamer/recover`,
    method: 'patch'
  })
}



/**
 * 将用户关入小黑屋
 * @param {*} id -房间ID
 */
export function addBlackList(id,userId,data) {
  return request({
    url: `/streamer-rooms/${id}/blacklist/${userId}/opt-types/${data}`,
    method: 'post'
  })
}



/**
 * 将用户从小黑屋释放出来
 * @param {*} id -房间ID
 */
export function delBlackList(id,userId) {
  return request({
    url: `/streamer-rooms/${id}/blacklist/${userId}`,
    method: 'delete'
  })
}


/**
 * 直播间详情
 * @param {*} params
 */
export function getRoom(params) {
  return request({
    url: `/streamer-room`,
    method: 'get'
  })
}


/**
 * 修改用户直播间
 * @param {*} data
 */
export function putRoom(data) {
  return request({
    url: `/streamer-rooms`,
    method: 'put',
    data
  })
}



/**
 * 获取频道列表
 * @param {*} params
 */
export function getChannel(params) {
  return request({
    url: `/streamer-rooms/channels`,
    method: 'get'
  })
}



/**
 * 被关在小黑屋的人们
 * @param {*} params
 */
export function getBlackList(params) {
  return request({
    url: `/streamer-rooms/${params}/blacklist`,
    method: 'get'
  })
}
