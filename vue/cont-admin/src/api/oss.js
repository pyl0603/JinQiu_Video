import request from '@/utils/request'

/**
 * 
 * @param {*} url 
 * @param {*} data 
 */
export function upload(url,data) {
    return request({
        url: url,
        method: 'post',
        data
    })
}


/**
 * 获取token
 */
export function getOssToken(params) {
	return request({
			url: '/client-publish/tool/oss/token',
			method: 'get',
			params
	})
}


/**
 * 读取图库
 */
export function getOssImgs(day, params) {
	return request({
			url: `/client-publish/tool/oss/${day}/pictures`,
			method: 'get',
			params
	})
}
 

/**
 * 读取视频
 */
export function getOssVideos(day, params) {
	return request({
			url: `/client-publish/tool/oss/${day}/videos`,
			method: 'get',
			params
	})
}

/**
 * 获取图片列表
 */

 export function getOssImgList(params) {
	return request({
		url: '/client-publish/tool/oss/pictures',
		method: 'get',
		params
	})
}

/**
 * 获取视频列表
 */

export function getOssVideoList(params) {
	return request({
		url: '/client-publish/tool/oss/videos',
		method: 'get',
		params
	})
}

