import request from '@/utils/request'

/**
 * 获取首页频道列表
 * @param {*} params 
 */
export function getMainIndex(params) {
    return request({
        url: '/client-publish/data/main-channels',
        method: 'get',
        params
    })
}