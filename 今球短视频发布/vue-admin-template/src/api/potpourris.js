import request from '@/utils/request'

/**
 * 比赛集锦列表（已排序）
 * @param {*} params 
 */
export function getPotp(params) {
    return request({
        url: `/client-publish/matches/${params}/potpourris`,
        method: 'get'
    })
}



/**
 * 添加足球比赛集锦
 * @param {*} params 
 */
export function addPotp(id, data) {
    return request({
        url: `/client-publish/matches/${id}/potpourris`,
        method: 'post',
        data
    })
}



/**
 * 修改集锦信息
 * @param {*} params 
 */
export function putPotp(id, data) {
    return request({
        url: `/client-publish/potpourris/${id}`,
        method: 'put',
        data
    })
}



/**
 * 删除集锦信息
 * @param {*} params 
 */
export function delPotp(data) {
    return request({
        url: `/client-publish/potpourris/${data}`,
        method: 'delete'
    })
}



// /**
//  * 足球集锦排序
//  * @param {*} params 
//  */
// export function sortPotp(id, data) {
//     return request({
//         url: `/client-admin/football/matches/${id}/potpourris-sort`,
//         method: 'post',
//         data
//     })
// }

/**
 * 修复集锦排序
 * post
 */
export function fixPop() {
    return request({
        url: '/client-publish/fix/potpourris-ordinal',
        method: 'post'
    })
}


/**
 * 集锦下移/置顶/上移
 * type  down top up
 */
export function movePop(potpourri, type) {
    return request({
        url: `/client-publish/potpourris/${potpourri}/${type}`,
        method: 'PATCH'
    })
}


/**
 * 获取三方直播源
 * @param {*} params 
 */
export function getThirdUrl(params) {
    return request({
        url: `/client-publish/third/live-sources/${params}`,
        method: 'get'
    })
}



/**
 * 获取足球版权方集锦列表
 * @param {*} params 
 */
export function getThirdPop(params) {
    return request({
        url: `/client-publish/third/potpourris/${params}`,
        method: 'get'
    })
}