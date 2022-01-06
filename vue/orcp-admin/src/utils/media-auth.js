import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_key'
const IdKey = 'vue_admin_template_id'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getId() {
    return Cookies.get(IdKey)
}

export function setId(Id) {
    return Cookies.set(IdKey, Id)
}

export function removeId() {
    return Cookies.remove(IdKey)
}