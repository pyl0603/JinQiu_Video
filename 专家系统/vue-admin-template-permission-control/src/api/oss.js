import request from '@/utils/request'

/**
 *  oss
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
			url: '/aliyun/oss/token',
			method: 'get',
			params
	})
}


/**
 * 读取图库 图片查找
 */
export function getOssImgs(day, params) {
	return request({
			url: `/aliyun/oss/${day}/pictures`,
			method: 'get',
			params
	})
}

/**
 * 获取图片列表
 */

export function getOssImgList(params) {
	return request({
		url: '/tool/oss/pictures',
		method: 'get',
		params
	})
}

/**
 * 获取视频列表
 */

export function getOssVideoList(params) {
	return request({
		url: '/tool/oss/videos',
		method: 'get',
		params
	})
}


 