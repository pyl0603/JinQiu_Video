import request from '@/utils/media-request'

export function login(data) {
    return request({
        url: '/client-zmt/login/account',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/client-assistant/userinfo',
        method: 'get',
        // params: { token }
    })
}

export function logout() {
    return request({
        url: '/client-assistant/logout',
        method: 'post'
    })
}