import request from '../request'

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
export function sms(mobile) {
  return request({
    url: `/mobiles/${mobile}/sms`,
    method: 'post'
  })
}

/**
 * 重置密码
 * @param {*} data
 */
export function resetPassword(data) {
  return request({
    url: '/mobiles/reset-password',
    method: 'post',
    data
  })
}

/**
 * 
 * 获取用户信息
 */
export function userInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 修改密码
 * @param {*} data
 */
export function updatePassword(data) {
  return request({
    url: '/user/password',
    method: 'post',
    data
  })
}

