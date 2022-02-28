import request from '@/utils/request'

/**
 * 获取推送统计
 * @param {*} params
 */
export function getDailyStatistics(params) {
    return request({
        url: '/push/daily-statistics',
        method: 'get',
        params
    })
}

/**
 * 获取推送列表
 * @param {*} params
 */
export function getPushLogs(params) {
    return request({
        url: '/push-logs',
        method: 'get',
        params
    })
}



export function getNoticeStatistical() {
    return request({
        url: '/cloud-admin/notice/statistical',
        method: 'get',
    })
}


export function getStatistical(params) {
    return request({
        url: `/cloud-admin/news/statistical/${params.newsId}/${params.startDate}/${params.endDate}`,
        method: 'get',
    })
}


export function getNoticeRecord(params) {
    return request({
        url: `/cloud-admin/notice/record/${params.pageNum}/${params.pageSize}/${params.category}/${params.dateStart}/${params.dateEnd}?searchText=${params.searchText}`,
        method: 'get',
    })
}


export function getNoticeSync(taskId) {
    return request({
        url: `/cloud-admin/notice/sync/${taskId}`,
        method: 'get',
    })
}
