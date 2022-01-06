import request from '@src/request'

/**
 * 查看广告位列表
 * @param {*} params 
 */
export function getAdSpacesList(params) {
  return request({
    url: '/ad-spaces',
    method: 'get',
    params
  })
}

/**
 * 查看广告位
 * @param {*} params 
 */
export function getAdSpace(params) {
	return request({
		url: `/ad-spaces/${params}`,
		method: 'get'
	})
}

/**
 * 修改保存广告位
 * @param {*} id 
 * @param {*} data 
 */
export function updateAdSpace(id, data) {
	return request({
		url: `/ad-spaces/${id}`,
		method: 'put',
		data
	})
}

/**
 * 修改广告位启用/关闭状态
 * @param {*} id 
 */
export function changeEnableStatus(id, params) {
	return request({
		url: `/ad-spaces/${id}/change-enable-status`,
		method: 'patch',
		params
	})
}
