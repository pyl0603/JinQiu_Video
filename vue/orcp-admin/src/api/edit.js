import request from '@/utils/request'

/**
 * 标签列表
 * @param {*} params 
 */
export function getTags(params) {
    return request({
        url: '/client-admin/tags/list',
        method: 'get',
        params
    })
}


/**
 * 标签查询
 * @param {*} params 
 */
export function getTagsList(params) {
    return request({
        url: '/client-admin/tags',
        method: 'get',
        params
    })
}


/**
 * 添加标签
 * @param {*} data 
 */
export function addTags(data) {
    return request({
        url: '/client-admin/tag',
        method: 'post',
        data
    })
}


/**
 * 修改标签
 * @param {*} data 
 */
export function updateTags(data) {
    return request({
        url: '/client-admin/tag',
        method: 'put',
        data
    })
}


/**
 * 图片日期分页查询
 * @param {*} params 
 */
export function getImgDate(params) {
    return request({
        url: '/client-admin/oss/picture/date',
        method: 'get',
        params
    })
}


/**
 * 视频日期分页查询
 * @param {*} params 
 */
export function getVideoDate(params) {
    return request({
        url: '/client-admin/oss/video/date',
        method: 'get',
        params
    })
}


/**
 * 图片日期，名称查找
 * @param {*} data 
 */
export function getImgList(data) {
    return request({
        url: '/client-admin/oss/picture-condition',
        method: 'post',
        data
    })
}


/**
 * 视频日期分详情
 * @param {*} data 
 */
export function getVideoList(data) {
    return request({
        url: '/client-admin/oss/video-condition',
        method: 'post',
        data
    })
}


/**
 * 添加文章
 * @param {*} data 
 */
export function addArticle(data) {
    return request({
        url: '/client-admin/article',
        method: 'post',
        data
    })
}


/**
 * 修改文章
 * @param {*} data 
 */
export function putArticle(data) {
    return request({
        url: '/client-admin/article',
        method: 'put',
        data
    })
}


/**
 * 文章详情
 * @param {*} params 
 */
export function getArticleDet(params) {
    return request({
        url: `/client-admin/article/${params}`,
        method: 'get'
    })
}


/**
 * 添加视频
 * @param {*} data 
 */
export function addVideo(data) {
    return request({
        url: '/client-admin/video',
        method: 'post',
        data
    })
}


/**
 * 修改视频
 * @param {*} data 
 */
export function putVideo(data) {
    return request({
        url: '/client-admin/video',
        method: 'put',
        data
    })
}


/**
 * 视频详情
 * @param {*} params 
 */
export function getVideoDet(params) {
    return request({
        url: `/client-admin/video/${params}`,
        method: 'get'
    })
}


/**
 * 内容分页查询
 * @param {*} data 
 */
export function getCont(data, type) {
    return request({
        url: `/client-admin/${type}/page`,
        method: 'post',
        data
    })
}


/**
 * 内容删除
 * @param {*} data 
 */
export function delCont(data, type) {
    return request({
        url: `/client-admin/${type}/${data}`,
        method: 'delete'
    })
}


/**
 * 内容置顶
 * @param {*} data 
 */
export function putContTop(id, data, type) {
    return request({
        url: `/client-admin/${type}/${id}/top/${data}`,
        method: 'put',
    })
}


/**
 * 定时发布内容
 * @param {*} params 
 */
export function setContTime(id, params, type) {
    return request({
        url: `/client-admin/${type}/${id}/time/${params}`,
        method: 'put',
    })
}


/**
 * 内容发布
 * @param {*} data 
 */
export function contPublish(data, type) {
    return request({
        url: `/client-admin/${type}/${data}/publish`,
        method: 'put',
    })
}


/**
 * 内容审核
 * @param {*} params 
 */
export function contCheck(id, params, type) {
    return request({
        url: `/client-admin/${type}/${id}/check/${params}`,
        method: 'put',
    })
}



/**
 * 内容审核
 * @param {*} params 
 */
export function contChecks(id, params, type) {
    return request({
        url: `/client-admin/${type}/check/${id}/${params}`,
        method: 'put',
    })
}



/**
 * 获取文章类型标签
 * @param {*} params 
 */
export function getLable(params) {
    return request({
        url: `/client-admin/article/label`,
        method: 'get'
    })
}




/**
 * 获取文章类型标签
 * @param {*} params 
 */
export function addLabel(params) {
    return request({
        url: `/client-admin/article/addLabel`,
        method: 'get',
        params
    })
}





/**
 * 用户发文统计
 * @param {*} params 
 */
export function getCount(params) {
    return request({
        url: `/client-admin/article/user/count`,
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
