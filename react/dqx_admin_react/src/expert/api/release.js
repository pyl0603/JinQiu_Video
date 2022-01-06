import request from '../request'

/**
 *  获取玩法类型
 * @param {*} params
 */
export function getPlaytype(params) {
  return request({
    url: '/plan/playtype',
    method: 'get',
    params
  })
}

/**
 *  方案价格类型
 * @param {*} params
 */
export function getPlanprice(params) {
  return request({
    url: '/plan/planprice',
    method: 'get',
    params
  })
}

/**
 *  获取含有盘口数据的比赛
 * @param {*} params
 */
export function getMatch(params) {
  return request({
    url: '/plans/match/list',
    method: 'get',
    params
  })
}

/**
 *  获取指定玩法，比赛的盘口数据
 * @param {*} params
 */
export function getPlansOdds(params) {
  return request({
    url: '/plans/odds',
    method: 'get',
    params
  })
}

/**
 *  获取指定玩法，比赛的盘口数据
 * @param {*} params
 */
export function addPlans(data) {
  return request({
    url: '/plans/publish',
    method: 'post',
    data
  })
}

/**
 * 发布管理列表
 */
export function getPlansList(params) {
  return request({
    url: '/plans/list',
    method: 'get',
    params
  })
}

/**
 *  方案内容违规词过滤
 * @param {*} params
 */
export function wordsCheck(data) {
  return request({
    url: '/plans/words/check',
    method: 'post',
    data
  })
}
