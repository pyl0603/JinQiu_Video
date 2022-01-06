import request from '../request';

/**
 *  v2 --发送短信验证码
 * @param {*} params
 */
export function newSMSCode(params) {
    return request({
      url: '/login/code/send',
      method: 'get',
      params
    })
}

/**
 *  New -短信验证码登陆
 * @param {*} params
 */
export function newSMSLogin(data) {
    return request({
      url: '/login/sms',
      method: 'post',
      data
    })
}

/**
 * 获取用户最新审核状态
 */
export function newUserStatus(userId) {
    return request({
        url: `/login/${userId}/latest/check-status`,
        method: 'get',
    })
}

/**
 * 获取非专家用户基础信息
 */
export function newNoExpert() {
    return request({
        url: '/register/user-info',
        method: 'get',
    })
}
