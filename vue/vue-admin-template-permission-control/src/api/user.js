import request from '@/utils/request'

export function login(data) {
    return request({
        url: `/cloud-login/login/phone-number-verify-code/${data.phoneNumber}/${data.verifyCode}`,
        method: 'get',
    })
}

export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        // params: { token }
    })
}

export function logout() {
    return request({
        url: '/auth/logout',
        method: 'post'
    })
}

export function users(params) {
	return request({
		url: '/users',
		method: 'get',
		params
	})
}

export function userDetail(user, params) {
	return request({
		url: `/users/${user}/admin-invitation-users`,
		method: 'get',
		params
	})
}


export function GetVerification(phoneNumber) {
    return request({
        url:`/cloud-sms/verify-code/send/app-login/${phoneNumber}`,
  
    })
  }