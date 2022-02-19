import request from '@/utils/request'

export function login(data) {
  return request({
      url: `/cloud-login/login/phone-number-verify-code/${data.phoneNumber}/${data.code}`,
      method: 'get',
  })
  
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

// 获取验证码
export function GetVerification(phoneNumber) {
  return request({
      url:`/cloud-sms/verify-code/send/app-login/${phoneNumber}`,

  })
}

// 获取验证码
export function accountLogin(parmas) {
  return request({
      url:`/cloud-login/login/password/${parmas.phoneNumber}/${parmas.passwordMD5}`,
      method:'get'

  })
}
