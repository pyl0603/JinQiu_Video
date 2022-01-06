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
 * 短信验证码登录
 * @param {*} data
 */
export function loginSMS(data) {
  return request({
    url: '/login/sms',
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
 * 发送验证码
 * @param {*} params
 */
export function sms(params) {
  return request({
    url: '/login/sendCode',
    method: 'post',
    params
  })
}

/**
 * 是否注册成为今球用户
 * @param {*} data 
 */
export function isRegister(data) {
  return request({
    url: '/login/register',
    method: 'POST',
    data
  })
}

/**
 * 通过手机号和手机检验码设置密码
 */
export function checkMobilePwd(mobile, data) {
  return request({
    url: `/users/${mobile}/password`,
    method: 'PATCH',
    data
  })
}

/**
 * 通过旧密码重置密码
 */
export function resetPwd(data) {
  return request({
    url: '/user/rest',
    method: 'PATCH',
    data
  })
}

/**
 * 
 * 获取用户信息
 */
export function userInfo() {
  return request({
    url: '/user',
    method: 'get'
  })
}

/**
 * 修改头像
 * @param {*} 
 */
export function editAvatar(params) {
  return request({
    url: '/user/avatar',
    method: 'PATCH',
    params
  })
}

/**
 * 修改基础信息
 * @param {*} 
 */
export function editBase(data) {
  return request({
    url: '/user/base-info',
    method: 'put',
    data
  })
}

/**
 * 查询审核结果
 * @param {*} userId
 */
export function latestApplication(userId) {
  return request({
    url: `/login/streamers/${userId}/latest-application`,
    method: 'get'
  })
}

/**
 * 提交主播申请
 */
export function apply(id, data) {
  return request({
    url: `/login/streamers/${id}/apply`,
    method: 'POST',
    data
  })
}

/**
 * 通过手机号搜索用户
 * @param {*} mobile 
 */
export function searchMobile(mobile) {
  return request({
    url: `/users/${mobile}`,
    method: 'get'
  })
}