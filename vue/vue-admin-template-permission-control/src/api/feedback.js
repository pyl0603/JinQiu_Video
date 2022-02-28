import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params 
 */
export function getplayList(params) {
    return request({
        url: `/cloud-admin/feedback/play-video/${params.state}/${params.pageNum}/${params.pageSize}`,
        method: 'get',
    })
}

export function playFail(feedbackId) {
    return request({
        url: `/cloud-admin/feedback/play-video/process/fail/${feedbackId}`,
        method: 'get',
    })
}

export function playPass(feedbackId) {
    return request({
        url: `/cloud-admin/feedback/play-video/process/ok/${feedbackId}`,
        method: 'get',
    })
}

export function getReportList(params) {
    return request({
        url: `/cloud-admin/feedback/report/${params.state}/${params.pageNum}/${params.pageSize}`,
        method: 'get',
    })
}


export function ReportFail(feedbackId) {
    return request({
        url: `/cloud-admin/feedback/report/process/ignore/${feedbackId}`,
        method: 'get',
    })
}
export function ReportPass(feedbackId) {
    return request({
        url: `/cloud-admin/feedback/report/process/ok/${feedbackId}`,
        method: 'get',
    })
}


