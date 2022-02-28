import request from '@/utils/request'


export function getInformation(params) {
    return request({
        url: `/cloud-admin/news/search/${params.status}/${params.pageNum}/${params.pageSize}`,
        method: 'post',
        data:params.dto
    })
}


export function failInformation(newsId) {
  return request({
      url: `/cloud-admin/news/check/fail/${newsId}`,
      method: 'post',
  })
}

export function passInformation(newsId) {
  return request({
      url: `/cloud-admin/news/check/pass/${newsId}`,
      method: 'post',
  })
}

export function deleteInformation(newsId) {
  return request({
      url: `/cloud-admin/news/delete/${newsId}`,
      method: 'post',
  })
}



export function getStatistical(parmas) {
  return request({
      url: `/cloud-admin/news/statistical/${parmas.newsId}/${parmas.startDate}/${parmas.endDate}`,
      method: 'get',
  })
}