import request from '@/utils/request'

/**
 * 获取圈子列表
 * @param {params} params 
 */
export function getCircle(params) {
    return request({
        url: '/communities',
        method: 'get',
        params
    })
}


/**
 * 新增圈子
 * @param {data} data 
 */
export function addCircle(data) {
    return request({
        url: '/users/communities',
        method: 'post',
        data
    })
}



/**
 * 修改分类
 * @param {data} data 
 */
export function putSort(data) {
    return request({
        url: '/groups/group',
        method: 'put',
        data
    })
}


/**
 * 修改圈子
 * @param {data} data 
 */
export function putCircle(data) {
    return request({
        url: '/users/communities/community',
        method: 'put',
        data
    })
}


/**
 * 删除圈子
 * @param {data} data  
 */
export function delCircle(data) {
    return request({
        url: `/communities/${data}`,
        method: 'delete',
        data
    })
}


/**
 * 获取圈子分类列表
 * @param {params} params 
 */
export function getGroups(params) {
    return request({
        url: '/groups',
        method: 'get',
        params
    })
}


/**
 * 获取圈子分类列表
 * @param {data} data 
 */
export function addGroups(data) {
    return request({
        url: '/groups',
        method: 'post',
        data
    })
}



/**
 * 分类上移
 * @param {data} data 
 */
export function upGroups(data) {
    return request({
        url: `/groups/${data}/up`,
        method: 'post',
    })
}



/**
 * 分类下移
 * @param {data} data 
 */
export function downGroups(data) {
    return request({
        url: `/groups/${data}/down`,
        method: 'post'
    })
}



/**
 * 分类置顶
 * @param {data} data 
 */
export function topGroups(data) {
    return request({
        url: `/groups/${data}/top`,
        method: 'post'
    })
}


/**
 * 分类置底
 * @param {data} data 
 */
export function groundGroups(data) {
    return request({
        url: `/groups/${data}/ground`,
        method: 'post'
    })
}



/**
 * 分类删除
 * @param {data} data 
 */
export function delGroups(data) {
    return request({
        url: `/groups/${data}`,
        method: 'delete'
    })
}


/**
 * 获取圈子分类列表
 * @param {params} params 
 */
export function getGroupsUser(params) {
    return request({
        url: '/communties/user',
        method: 'get',
        params
    })
}


/**
 * 获取帖子分类列表
 * @param {params} params 
 */
export function getDisc(params) {
    return request({
        url: '/discusses',
        method: 'get',
        params
    })
}


/**
 * 获取帖子详情
 * @param {params} params 
 */
export function getDiscDet(params) {
    return request({
        url: `/discusses/${params}`,
        method: 'get'
    })
}


/**
 * 获取帖子详情
 * @param {params} params 
 */
export function delDis(data) {
    return request({
        url: `/discuss/user/${data}`,
        method: 'delete'
    })
}


/**
 * 帖子置顶
 * @param {data} data 
 */
export function disTop(data) {
    return request({
        url: `/discuss/move-top/${data}`,
        method: 'post'
    })
}



/**
 * 帖子取消置顶
 * @param {data} data 
 */
export function disUntop(data) {
    return request({
        url: `/discuss/un-move-top/${data}`,
        method: 'post'
    })
}


/**
 * 帖子推荐
 * @param {data} data 
 */
export function disRec(data) {
    return request({
        url: `/discuss/recommond/${data}`,
        method: 'post'
    })
}


/**
 * 帖子驳回(审核未通过)
 * @param {data} data 
 */
export function disDeny(id, data) {
    return request({
        url: `/discusses/${id}/deny`,
        method: 'post',
        data
    })
}


/**
 * 帖子通过(审核通过)
 * @param {data} data 
 */
export function disUndeny(data) {
    return request({
        url: `/discusses/${data}/accept`,
        method: 'post'
    })
}