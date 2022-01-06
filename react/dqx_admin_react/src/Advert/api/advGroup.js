import request from '@src/request'

/**
 * 获取广告组列表
 * @param {*} params 
 */
export function getAdvGroup(params) {
    return request({
        url: '/ad-groups',
        method: 'get',
        params
    })
}

/**
 * 获取单个广告组
 * @param {*} params 
 */
export function getAdvGroupSingle(params) {
    return request({
        url: `/ad-groups/${params}`,
        method: 'get'
    })
}

/**
 * 修改广告组
 * @param {*} params 
 */
export function putAdvGroup(id,data) {
    return request({
        url: `/ad-groups/${id}`,
        method: 'put',
        data
    })
}

/**
 * 新增广告组
 * @param {*} data 
 */
export function addAdvGroup(data) {
    return request({
        url: '/ad-groups',
        method: 'post',
        data
    })
}

/**
 * 删除广告
 * @param {*} data 
 */
export function delAdvGroup(data) {
    return request({
        url: `/ad-groups/${data}`,
        method: 'delete'
    })
}

/**
 * 启用/关闭广告组
 * @param {*} params 
 */
export function patchAdvGroup(id,params) {
    return request({
        url: `/ad-groups/${id}/change-enable-status`,
        method: 'patch',
        params
    })
}

/**
 * 获取所有的广告时间段
 * @param {*} params 
 */
export function getTimes(params) {
    return request({
        url: '/promotion-time-groups',
        method: 'get',
        params
    })
}

/**
 * 查询单个广告组列表
 * @param {*} params 
 */
export function getAdvGroupDet(params) {
    return request({
        url: `/ad-groups/${params}`,
        method: 'get'
    })
}

/**
 * 广告组、回收站-广告列表
 *  @param {*} params 
 */
export function getAdvDetails(params) {
    return request({
        url: '/ads',
        method: 'get',
        params
    })
}

/**
 * 启用/关闭
 * @param {*} id 
 * @param {*} params
 */
export function changeEable(id, params) {
    return request({
        url: `/ads/${id}/change-enable`,
        method: 'PATCH',
        params
    })
}

/**
 * 删除广告组
 *  @param {*} params 
 */
export function deleteSingAd(id) {
    return request({
        url: `/ads/${id}`,
        method: 'DELETE'
    })
}

/**
 * 查看广告详情
 * @param {*} id 
 */
export function getAdvSingleDetails(id) {
    return request({
        url: `/ads/${id}`,
        method: 'get'
    })
}

/**
 * 广告组-回收站（已删除分页列表）
 * @param {*} params 
 */
export function delAdvGroupList(params) {
    return request({
        url: `/deleted-ad-groups`,
        method: 'get',
        params
    })
}

/**
 * 修改广告
 * @param {*} id 
 * @param {*} data 
 */
export function updateAdvSingleDetails(id, data) {
    return request({
        url: `/ads/${id}`,
        method: 'PUT',
        data
    })
}

/**
 * 还原广告
 * @param {*} id 
 */
export function restoreAdvSingle(id) {
    return request({
        url: `/ads/${id}/restore`,
        method: 'PATCH'
    })
}

/**
 * 还原广告组
 * @param {*} id 
 */
export function restoreAdvGroup(id) {
    return request({
        url: `/ad-groups/${id}/restore`,
        method: 'PATCH'
    })
}


