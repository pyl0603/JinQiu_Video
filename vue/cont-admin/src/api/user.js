import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/client-publish/login/account',
        method: 'post',
        data
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