import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    uid:'',
    userInfo:{}
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
    SET_UID: (state, uid) => {
        state.uid = uid
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password,code } = userInfo
        return new Promise((resolve, reject) => {
            login({ phoneNumber: username.trim(), verifyCode: code }).then(response => {
                const { data } = response
                commit('SET_TOKEN', data.userToken)
                commit('SET_USERINFO', data.userInfo)
                setToken(data.userToken)
                console.log(data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            // getInfo(state.token).then(response => {
                // const { data } = response

                // if (!data) {
                //     reject('Verification failed, please Login again.')
                // }
                // console.log(data)
                console.log(state.userInfo);
                // const { roles, nickname, avatar_url,id } = state.userInfo
                // 如果是部门主管，追加一个部门管理权限 SETTING_DEPARTMENT_MANAGE_MY
                // if (data.departments.length) {
                //     roles.push('SETTING_DEPARTMENT_MANAGE_MY')
                // }
                // // roles must be a non-empty array
                // if (!roles || roles.length <= 0) {
                //     reject('getInfo: roles must be a non-null array!')
                // }
                if (!state.userInfo) {
                    return reject('Verification failed, please Login again.')
                  }
                  const roles = ['admin']
                  const { avatar, userId, nickname } = state.userInfo
                  const data = {
                    name: nickname,
                    avatar,
                    userId,
                    roles,
                  }
                commit('SET_ROLES', roles)
                commit('SET_UID',userId)
                commit('SET_NAME', nickname)
                commit('SET_AVATAR', avatar)
                resolve(data)
            // }).catch(error => {
            //     reject(error)
            // })
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