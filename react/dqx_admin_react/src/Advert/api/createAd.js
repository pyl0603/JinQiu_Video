import request from '@src/request'

/**
 * 获取广告组
 * @param {*} params 
 */
export function getAdGroup(params) {
	return request({
		url: '/ad-groups',
		method: 'get',
		params
	})
}

/**
 * 查看所有广告位的模块
 */
export function getAdModule(clientType) {
	return request({
		url: `/ad-spaces/client-types/${clientType}/modules`,
		method: 'get'
	})
}

/**
 * 根据广告位模块id查看样式
 * @param {Number} id 
 */
export function getAdStyles(id) {
	return request({
		url: `/ad-spaces/modules/${id}/styles`,
		method: 'get'
	})
}

/**
 * 新增广告
 * @param {*} data 
 */
export function addAds(data) {
	return request({
		url: `/ads`,
		method: 'post',
		data
	})
}

/**
 * 根据投放页面获取广告列表
 * @param {*} params 
 */
export function getAds(params) {
	return request({
		url: `/ad-modules/${params}/effective-ads`,
		method: 'get'
	})
}


/**
 * 广告列表排序
 * @param {*} params 
 */
export function optAdv(id,adId,params) {
	return request({
		url: `/ad-modules/${id}/effective-ads/${adId}/sort`,
		method: 'patch',
		params
	})
}

	/**
	 * 根据图片类型生成token相关信息；广告的图片type值：picture
	 */
export function getImages() {
	return request({
		url: 'aliyun/oss/token?type=video',
		method: 'get',
	}) 

}

export function postOss(url,data){
	return request({
		url:url,
		method:'post',
		data
	})
}