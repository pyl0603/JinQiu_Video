import request from '../request'

/**
 *  操作日志
 * @param {*}  params
 */
export function operateLogs(params) {
  return request({
    url: '/plans/operateLogs',
    method: 'get',
    params
  })
}

/**
 * 保持个人设置
 */
export function updatePerson(data) {
  return request({
    url: '/my-wallet',
    method: 'put',
    data
  })
}


export function updateAvatar(data) {
  return request({
    url: '/user/patch/avatar',
    method: 'patch',
    data
  })
}

