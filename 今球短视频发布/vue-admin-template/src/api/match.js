import request from '@/utils/request'

/**
 * 获取热门比赛
 * @param {*} params 
 */
export function getHotMatch(params) {
    return request({
        url: '/client-publish/hot/matches',
        method: 'get',
        params
    })
}

/**
 * 增加热门比赛
 * @param {*} params 
 */
export function addHotMatch(data) {
  return request({
      url: '/client-publish/common-matches/from-exists',
      method: 'post',
      data
  })
}

/**
 * 移除热门比赛
 * @param {*} params 
 */
export function delHotMatch(data) {
  return request({
      url: `/client-publish/hot/matches/${data}`,
      method: 'delete'
  })
}

/**
 * 获取赛事列表
 * @param {*} params 
 */
export function getCompetitions(params) {
  return request({
      url: '/client-publish/data/competitions',
      method: 'get',
      params
  })
}

/**
 * 获取比赛分页列表
 * @param {*} params 
 */
export function getMatch(params) {
  return request({
      url: '/client-publish/matches',
      method: 'get',
      params
  })
}

/**
 * 获取通用比赛分页列表
 * @param {*} params 
 */
export function getCommonMatch(params) {
  return request({
      url: '/client-publish/common-matches',
      method: 'get',
      params
  })
}


/**
 * 表单添加自定义比赛
 * @param {*} params 
 */
export function addMatch(data) {
  return request({
      url: '/client-publish/common-matches',
      method: 'post',
      data
  })
}



/**
 * 表单添加已有比赛
 * @param {*} params 
 */
export function addExistMatch(data) {
  return request({
      url: '/client-publish/common-matches/from-exists',
      method: 'post',
      data
  })
}

/**
 * 移除通用比赛
 * @param {*} params 
 */
export function delCommonMatch(data) {
  return request({
      url: `/client-publish/common-matches/${data}`,
      method: 'delete'
  })
}

/**
 * 更改比赛状态
 * @param {*} params 
 */
export function setMatchStatus(id,data) {
  return request({
      url: `/client-publish/common-matches/${id}/status/${data}`,
      method: 'patch'
  })
}


/**
 * 更改比赛比分
 * @param {*} params 
 */
export function setMatchScore(id,data) {
  return request({
      url: `/client-publish/common-matches/${id}/score`,
      method: 'patch',
      data
  })
}


/**
 * 获取圈子列表
 * @param {*} params 
 */
export function getCommunities(params) {
  return request({
      url: '/client-publish/communities',
      method: 'get',
      params
  })
}
