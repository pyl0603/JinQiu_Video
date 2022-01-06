import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const Category = 'Category'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getCategory(){
    return Cookies.get(Category)
}

export function setCategory(caty){
    return Cookies.set(Category,caty)
}

export function delCategory(){
    return Cookies.remove(Category)
}