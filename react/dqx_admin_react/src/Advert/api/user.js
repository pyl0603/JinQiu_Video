import request from '@src/request'

/**
 *  账号密码登录
 * @param {*} data
 */
export function login(data) {
  return request({
    url: '/login/account',
    method: 'post',
    data
  })
}

/**
 * 登出
 */
export function loginout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 获取后台用户列表
 * @param {*} params
 */
export function usersList(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

/**
 * 新增后台用户
 * @param {*} data
 */
export function addUsers(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

/**
 * 删除后台用户
 * @param {*} data
 */
export function delUsers(id,data) {
  return request({
    url: `/users/${id}/manager`,
    method: 'patch',
    data
  })
}

/**
 * 修改后台用户信息
 * @param {*} data
 */
export function updateUsers(id,data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

/**
 * 发送验证码
 * @param {*} data
 */
export function sms(data) {
  return request({
    url: '/sms/send',
    method: 'post',
    data
  })
}

export function updatePassword(id, data) {
  return request({
    url: `/user/${id}/password`,
    method: 'patch',
    data
  })
}
