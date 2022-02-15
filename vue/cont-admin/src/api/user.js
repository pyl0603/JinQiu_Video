import request from '@/utils/request'
// 验证码登陆
export function login(data) {
    return request({
        url: `/cloud-login/login/phone-number-verify-code/${data.phoneNumber}/${data.code}`,
        method: 'get',
    })
    
}

export function getInfo(token) {
    return request({
        url: '/client-publish/user/info',
        method: 'get',
        // params: { token }
    })
}

export function logout() {
    return request({
        url: '/client-publish/auth/logout',
        method: 'post'
    })
}

// 获取验证码
export function GetVerification(phoneNumber) {
    return request({
        url:`/cloud-sms/verify-code/send/app-login/${phoneNumber}`,

    })
}