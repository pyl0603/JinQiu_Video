import request from '@/utils/request'

/**
 * 获取首页频道列表
 * @param {string} params -频道列表ID
 */
export function getMainIndex(params) {
    return request({
        url: '/main-channels',
        method: 'get',
        params
    })
}


/**
 * 获取赛事频道
 */
export function getMatchIndex(params) {
    return request({
        url: '/match-channels',
        method: 'get',
        params
    })
}

/**
 * 获取数据频道
 */
export function getDataIndex(params) {
    return request({
        url: '/data-channels',
        method: 'get',
        params
    })
}

/**
 * 添加主页频道
 * @param {*} data 
 */
export function addMainChannel(data) {
    return request({
        url: '/main-channels',
        method: 'post',
        data
    })
}

/**
 * 添加赛事频道
 * @param {*} data 
 */
export function addMatchChannel(data) {
    return request({
        url: '/match-channels',
        method: 'post',
        data
    })
}

/**
 * 添加数据频道
 * @param {*} data 
 */
export function addDataChannel(data) {
    return request({
        url: '/data-channels',
        method: 'post',
        data
    })
}


/**
 * 删除频道
 * @param {*} params 
 */
export function delChannel(params) {
    return request({
        url: `/channels/${params}`,
        method: 'DELETE',

    })
}

/**
 * 移动主页频道到顶部
 * @param {*} data 
 */
export function setMainTop(data) {
    return request({
        url: `/channels/${data}/move-main-top`,
        method: 'post'
    })
}


/**
 * 移动赛事频道到顶部
 * @param {*} data 
 */
export function setMatchTop(data) {
    return request({
        url: `/channels/${data}/move-match-top`,
        method: 'post',
    })
}


/**
 * 上移主页频道
 * @param {*} data 
 */
export function setMainUp(data) {
    return request({
        url: `/channels/${data}/move-main-up`,
        method: 'post'

    })
}

/**
 * 下移主页频道
 * @param {*} data 
 */
export function setMainDown(data) {
    return request({
        url: `/channels/${data}/move-main-down`,
        method: 'post'

    })
}


/**
 * 上移赛事频道
 * @param {*} data 
 */
export function setMatchUp(data) {
    return request({
        url: `/channels/${data}/move-match-up`,
        method: 'post'

    })
}

/**
 * 下移赛事频道
 * @param {*} data 
 */
export function setMatchDown(data) {
    return request({
        url: `/channels/${data}/move-match-down`,
        method: 'post'

    })
}

/**
 * 上移数据频道
 * @param {*} data 
 */
export function setDataUp(data) {
    return request({
        url: `/channels/${data}/move-data-up`,
        method: 'post'

    })
}

/**
 * 下移数据频道
 * @param {*} data 
 */
export function setDataDown(data) {
    return request({
        url: `/channels/${data}/move-data-down`,
        method: 'post'

    })
}

/**
 * 切换赛事频道的共享状态
 * @param {*} data 
 */
export function changeShare(id, data) {
    return request({
        url: `/channels/${id}/main`,
        method: 'patch',
        data
    })
}

/**
 * 切换频道默认状态
 * @param {*} data 
 */
export function changeDefault(id, data) {
    return request({
        url: `/channels/${id}/default`,
        method: 'patch',
        data
    })
}


/**
 * 修改数据频道的类型
 * @param {*} data 
 */
export function changeType(id, data) {
    return request({
        url: `/channels/${id}/type`,
        method: 'patch',
        data
    })
}

/**
 * 切换频道显示状态
 * @param {*} data 
 */
export function changeShow(id, data) {
    return request({
        url: `/channels/${id}/show`,
        method: 'patch',
        data
    })
}

/**
 * 切换数据频道的树状图开关
 * @param {*} data 
 */
export function changeTree(id, data) {
    return request({
        url: `/channels/${id}/tree`,
        method: 'patch',
        data
    })
}

/**
 * 切换频道系统项状态
 * @param {*} data 
 */
export function changeSystem(id, data) {
    return request({
        url: `/channels/${id}/system`,
        method: 'patch',
        data
    })
}

/**
 * 修改频道名称
 * @param {*} data 
 */
export function changeName(id, data) {
    return request({
        url: `/channels/${id}/name`,
        method: 'patch',
        data
    })
}

/**
 * 修改频道信息
 * @param {*} data 
 */
export function changeInfo(id, data) {
    return request({
        url: `/channels/${id}`,
        method: 'put',
        data
    })
}


/**
 * 修改数据频道的类型
 * @param {*} data 
 */
export function changeDataSort(id, data) {
    return request({
        url: `/channels/${id}/type`,
        method: 'patch',
        data
    })
}


/**
 * 获取数据频道
 */
export function getDataType(params) {
    return request({
        url: '/channel-data-types',
        method: 'get',
        params
    })
}



/**
 * 获取频道分类列表(针对子项差异)
 */
export function getTypeDiff(params) {
    return request({
        url: '/channel-types',
        method: 'get',
        params
    })
}