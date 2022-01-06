import request from '@/utils/eva-request'

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
			url: '/client-assistant/aliyun/oss/token',
			method: 'get',
			params
	})
}
