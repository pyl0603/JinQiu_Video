import request from '@/utils/request'


/**
 * 内容列表
 * @param {*} params 
 */
export function getMedia(params) {
    return request({
        url: '/client-admin/media',
        method: 'get',
        params
    })
}

/**
 * 内容详情
 * @param {*} params 
 */
export function getMediaDet(params) {
    return request({
        url: `/client-admin/media/${params}`,
        method: 'get',
    })
}


/**
 * 删除内容
 * @param {*} params 
 */
export function delMedia(data) {
    return request({
        url: `/client-admin/media/${data}`,
        method: 'delete',
    })
}


/**
 * 置顶内容
 * @param {*} params 
 */
export function setMediaTop(data) {
    return request({
        url: `/client-admin/media/${data}/top`,
        method: 'post',
    })
}



/**
 * 取消置顶内容
 * @param {*} params 
 */
export function delMediaTop(data) {
    return request({
        url: `/client-admin/media/${data}/top`,
        method: 'delete',
    })
}


/**
 * 内容详情
 * @param {*} params 
 */
export function getLabels(params) {
    return request({
        url: `/client-admin/media-labels`,
        method: 'get',
    })
}


/**
 * 内容详情
 * @param {*} params 
 */
export function setLabels(id,data) {
    return request({
        url: `/client-admin/media/${id}/label/${data}`,
        method: 'post',
    })
}



/**
 * 审核通过
 * @param {*} params 
 */
export function mediaPass(data) {
    return request({
        url: `/client-admin/media/${data}/check-pass`,
        method: 'post',
    })
}




/**
 * 审核驳回
 * @param {*} params 
 */
export function mediaDeny(data) {
    return request({
        url: `/client-admin/media/${data}/check-deny`,
        method: 'post',
    })
}



/**
 * 获取操作记录
 * @param {*} params 
 */
export function getRecond(params) {
    return request({
        url: '/client-admin/media-action-records',
        method: 'get',
        params
    })
}






/**
 * 管理员强制撤回
 * @param {*} params 
 */
export function getRecovery(data) {
    return request({
        url: `/client-admin/media/${data}/recovery`,
        method: 'post'
    })
}