import { login, logout, getInfo } from '@/api/user-eva'
import { getToken, setToken, removeToken, getId, setId, removeId } from '@/utils/eva-auth'
import { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userInfo: ''
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_MAIN_USER: (state, userInfo) => {
        state.userInfo = userInfo
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { data } = response
                commit('SET_TOKEN', data.access_token)
                setToken(data.access_token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response

                if (!data) {
                    reject('Verification failed, please Login again.')
                }
                console.log(data)
                    // 获取权限
                let roles = []
                data.authorities.map(res => {
                    roles.push(res.name)
                })
                const { nickname, avatar_url, authorities } = data
                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }
                setId(data.id)
                commit('SET_ROLES', roles)
                commit('SET_NAME', nickname)
                commit('SET_AVATAR', avatar_url)
                commit('SET_MAIN_USER', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resetRouter()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            removeId()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}