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