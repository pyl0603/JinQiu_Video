import request from '@/utils/request'

/**
 * 获取启动页信息
 * @param {params} params 
 */
export function getWelcome(params) {
    return request({
        url: '/settings/welcome-page',
        method: 'get',
        params
    })
}

/**
 * 更新启动页信息
 * @param {data} data 
 */
export function putWelcome(data) {
    return request({
        url: '/settings/welcome-page',
        method: 'put',
        data
    })
}

/**
 * 获取Banner信息
 * @param {params} params 
 */
export function getBanner(params) {
    return request({
        url: '/settings/banner',
        method: 'get',
        params
    })
}

/**
 * 更新启动页信息
 * @param {data} data 
 */
export function putBanner(data) {
    return request({
        url: '/settings/banner',
        method: 'put',
        data
    })
}

/**
 * 获取举报列表
 * @param {params} params 
 */
export function getReport(params) {
    return request({
        url: '/reports',
        method: 'get',
        params
    })
}

/**
 * 获取举报详情
 * @param {params} params 
 */
export function getReportDet(params) {
    return request({
        url: `/reports/${params}`,
        method: 'get',
        params
    })
}


/**
 * 处理举报
 * @data {data} data 
 */
export function doReport(id, data) {
    return request({
        url: `/reports/${id}`,
        method: 'patch',
        data
    })
}


/**
 * 获取敏感词
 * @param {params} params 
 */
export function getWord(params) {
    return request({
        url: '/sensitive-word-file',
        method: 'get',
        params
    })
}


/**
 * 上传敏感词文件
 * @param {data} data 
 */
export function uploadFile(data) {
    return request({
        url: '/sensitive-word-file',
        method: 'post',
        data
    })
}


/**
 * 判断敏感词是否已经存在
 * @param {params} params 
 */
export function isSensitive(params) {
    return request({
        url: '/sensitive-word/exist-status',
        method: 'get',
        params
    })
}

/**
 * 协议列表
 * @param {params} params 
 */
export function getLicences(params) {
    return request({
        url: '/settings/licences',
        method: 'get',
        params
    })
}

/**
 * 修改协议
 * @param {data} data 
 */
export function changeLis(data) {
    return request({
        url: '/settings/licences',
        method: 'put',
        data
    })
}


/**
 * 操作日志
 * @param {params} params 
 */
export function getLogs(params) {
    return request({
        url: `/operational-logs`,
        method: 'get',
        params
    })
}


/**
 * 获取App版本分页列表
 * @param {params} params 
 */
export function getVersions(params) {
    return request({
        url: `/settings/app-versions`,
        method: 'get',
        params
    })
}


/**
 * 添加App版本
 * @param {params} data 
 */
export function addVersions(data) {
    return request({
        url: `/settings/app-versions`,
        method: 'post',
        data
    })
}


/**
 * 删除App版本信息
 * @param {params} data 
 */
export function delVersions(data) {
    return request({
        url: `/settings/app-versions/${data}`,
        method: 'delete',
    })
}




/**
 * 赛事频道列表(菜单专用，剔除了系统项)
 * @param {params} params 
 */
export function getSimple(params) {
    return request({
        url: `/match-channels-simple`,
        method: 'get',
        params
    })
}



/**
 * 比赛直播源列表
 * @param {params} params 
 */
export function getSource(params) {
    return request({
        url: `/matches/${params}/live-sources`,
        method: 'get'
    })
}



/**
 * 批量添加直播源
 * @param {data} data 
 */
export function addSource(id, data) {
    return request({
        url: `/matches/${id}/live-sources`,
        method: 'post',
        data
    })
}


/**
 * 批量修改直播源
 * @param {data} data 
 */
export function putSource(id, data) {
    return request({
        url: `/matches/${id}/live-sources`,
        method: 'put',
        data
    })
}



/**
 * 删除直播源
 * @param {data} data 
 */
export function delSource(data) {
    return request({
        url: `/live-sources/${data}`,
        method: 'delete'
    })
}



/**
 * 直播间导航列表
 * @param {params} params 
 */
export function getRoom(params) {
    return request({
        url: `/live-room-channels`,
        method: 'get',
        params
    })
}



/**
 * 直播间导航上移
 * @param {params} data 
 */
export function upRoom(data) {
    return request({
        url: `/live-room-channel/up/${data}`,
        method: 'put'
    })
}



/**
 * 直播间导航下移
 * @param {params} data 
 */
export function downRoom(data) {
    return request({
        url: `/live-room-channel/down/${data}`,
        method: 'put'
    })
}



/**
 * 直播间导航置顶
 * @param {params} data 
 */
export function topRoom(data) {
    return request({
        url: `/live-room-channel/top/${data}`,
        method: 'put'
    })
}



/**
 * 直播间导航重命名
 * @param {params} params 
 */
export function nameRoom(id, params) {
    return request({
        url: `/live-room-channel/set-name/${id}`,
        method: 'put',
        params
    })
}



/**
 * 切换展示状态
 * @param {params} data 
 */
export function showRoom(data) {
    return request({
        url: `/live-room-channel/switch-isshow/${data}`,
        method: 'put'
    })
}




/**
 * 广播通知
 * @param {data} data 
 */
export function addPush(data) {
    return request({
        url: `/notifications`,
        method: 'post',
        data
    })
}



/**
 * 添加系统消息
 * @param {data} data 
 */
export function addSysMsg(data) {
    return request({
        url: `/system-messages`,
        method: 'post',
        data
    })
}



/**
 * 直播间导航列表
 * @param {params} params 
 */
export function getPushTeam(params) {
    return request({
        url: `/push-teams`,
        method: 'get',
        params
    })
}



/**
 * 刷新列表
 * @param {*} data 
 */
export function refreshMatch(data) {
    return request({
        url: `/matches/${data}`,
        method: 'post'
    })
}