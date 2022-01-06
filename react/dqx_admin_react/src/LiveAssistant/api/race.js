import request from '../request'

/**
 *  赛事列表查询
 * @param {*}  params
 */
export function competitions(params) {
    return request({
      url: '/competitions',
      method: 'get',
      params
    })
  }
  

/**
 *  比赛列表
 * @param {*}  params
 */
export function matches(params) {
    return request({
      url: '/matches',
      method: 'get',
      params
    })
  }

  /**
 *  预约比赛
 * @param {*}  params
 */
export function predicts(params) {
    return request({
      url: '/predicts',
      method: 'get',
      params
    })
}

  /**
 *  预约
 * @param {*}  params
 */
export function predictsRace(data) {
    return request({
      url: '/predicts',
      method: 'post',
      data
    })
}

  /**
 *  取消预约
 * @param {*}  params
 */
export function delpredictsRace(category, id) {
    return request({
      url: `/predict/categories/${category}/${id}`,
      method: 'DELETE'
    })
}

  /**
 *  直播源
 * @param {*}  params
 */
export function getRacePlay(category, match) {
  return request({
    url: `/categories/${category}/matches/${match}/app-live-sources`,
    method: 'get'
  })
}


