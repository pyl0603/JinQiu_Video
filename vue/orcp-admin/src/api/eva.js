import request from '@/utils/eva-request'



/**
 * 获取子账户
 * @param {*} params 
 *
 */
export function getChild(params) {
    return request({
        url: `/client-assistant/helpers/list/helper`,
        method: 'get',
        params
    })
}


/**
 * 增加子账户
 * @param {*} data 
 * type:article|video
 */
export function addChild(data) {
    return request({
        url: `/client-assistant/helpers/add`,
        method: 'post',
        data
    })
}



/**
 * 我收到的回复
 * @param {*} params 
 *
 */
export function getReply(params) {
    return request({
        url: `/client-assistant/helpers/lists/receive-comment`,
        method: 'get',
        params
    })
}


/**
 * 内容列表
 * @param {*} data 
 * type:article|video
 */
export function getCont(type, data) {
    return request({
        url: `/client-assistant/${type}/list`,
        method: 'post',
        data
    })
}


/**
 * 内容搜索列表
 * @param {*} data 
 * type:article|video
 */
export function getContKey(type, data) {
    return request({
        url: `/client-assistant/${type}/search`,
        method: 'post',
        data
    })
}


/**
 * 内容详情
 * @param {*} params 
 *
 */
export function getContDet(type, params) {
    return request({
        url: `/client-assistant/${type}/detail`,
        method: 'get',
        params
    })
}


/**
 * 获取评论列表
 * @param {*} params 
 */
export function getEva(params) {
    return request({
        url: `/client-assistant/helpers/lists/comment`,
        method: 'get',
        params
    })
}



/**
 * 获取评论列表
 * @param {*} params 
 */
export function getEvaDet(params) {
    return request({
        url: `/client-assistant/helpers/comments/detail`,
        method: 'get',
        params
    })
}


/**
 * 获取回复列表
 * @param {*} params 
 */
export function getEvaReply(params) {
    return request({
        url: `/client-assistant/helpers/lists/sub-comment`,
        method: 'get',
        params
    })
}



/**
 * 发表评论
 * @param {*} data 
 */
export function addEva(data) {
    return request({
        url: `/client-assistant/helpers/submit/comment`,
        method: 'post',
        data
    })
}


/**
 * 获取圈子列表
 * @param {*} params 
 */
export function getCircle(params) {
    return request({
        url: `/client-assistant/helpers/community/list`,
        method: 'get',
        params
    })
}



/**
 * 发帖
 * @param {*} data 
 */
export function addDis(data) {
    return request({
        url: `/client-assistant/helpers/discuss/add`,
        method: 'post',
        data
    })
}


/**
 * 获取帖子列表(通过标题搜索帖子列表)
 * @param {*} params 
 */
export function getDis(params) {
    return request({
        url: `/client-assistant/helpers/discuss/list`,
        method: 'get',
        params
    })
}


/**
 * 获取帖子详情
 * @param {*} params 
 */
export function getDisDet(params) {
    return request({
        url: `/client-assistant/helpers/discuss/detail`,
        method: 'get',
        params
    })
}



/**
 * 获取赛事频道列表
 * @param {*} params 
 */
export function getChannel(params) {
    return request({
        url: `/client-assistant/channels`,
        method: 'get',
        params
    })
}



/**
 * 获取赛事频道列表
 * @param {*} params 
 */
export function getMatch(params) {
    return request({
        url: `/client-assistant/matches`,
        method: 'get',
        params
    })
}



/**
 * 获取赛事频道列表
 * @param {*} params 
 */
export function getMsgList(params) {
    return request({
        url: `/client-assistant/socket/channels/chat-records`,
        method: 'get',
        params
    })
}