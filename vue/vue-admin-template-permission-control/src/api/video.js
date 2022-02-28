import request from '@/utils/request'


export function getVideo(parmas) {
  return request({
        url: `/cloud-admin/video/search/${parmas.pageNum}/${parmas.pageSize}?searchText=${parmas.searchText}&state=${parmas.state}`,
        method: 'get',
        // parmas: {searchText:parmas.searchText,checkState:parmas.checkState }
    })

  }
export function failVideo(videoId) {
  return request({
      url: `/cloud-admin/video/check/fail/${videoId}`,
      method: 'get',
  })
}

export function passVideo(videoId) {
  return request({
      url: `/cloud-admin/video/check/pass/${videoId}`,
      method: 'get',
  })
}

export function deleteVideo(videoId) {
  return request({
      url: `/cloud-admin/video/delete/${videoId}`,
      method: 'get',
  })
}


export function settingVideo(dto) {
  return request({
      url: `/cloud-admin/video/rec/setting`,
      method: 'post',
      data:dto
  })
}



export function getVideoStatistical(parmas) {
  return request({
      url: `/cloud-admin/video/statistical/${parmas.videoId}/${parmas.startDate}/${parmas.endDate}`,
      method: 'get',
  })
}






export function collectionCheckList(parmas) {
  return request({
      url: `/cloud-admin/video/collection/check/list/${parmas.pageNum}/${parmas.pageSize}/${parmas.state}`,
      method: 'get',
  })
}


export function collectionCheckPass(collectionId) {
  return request({
      url: `/cloud-admin/video/collection/check/pass/${collectionId}`,
      method: 'get',
  })
}

export function collectionCheckFail(collectionId) {
  return request({
      url: `/cloud-admin/video/collection/check/fail/${collectionId}`,
      method: 'get',
  })
}