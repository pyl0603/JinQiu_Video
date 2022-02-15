import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    user_id:'',
    userInfo:{},

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
    SET_ID: (state, roles) => {
        state.user_id = roles
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
      }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { phoneNumber, code } = userInfo
        return new Promise((resolve, reject) => {
            login({ phoneNumber: phoneNumber.trim(), code: code }).then(response => {
                const { data } = response
        const { userInfo } = data
                
                commit('SET_TOKEN', data.userToken)
                // setToken(data.userToken)
        commit('SET_USERINFO',userInfo )
        console.log(state.userInfo)

                resolve()
                // debugger
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

                if (!state.userInfo) {
                    reject('Verification failed, please Login again.')
                }
                const roles = ['EDITOR_INTERNAL_VIDEO', 'EDITOR_ZMT_VIDEO']
                const { avatar,userId,nickname } = state.userInfo
                const data = {
                    name:nickname,
                    avatar,
                    userId,
                    roles,
                  }
                  console.log(state.userInfo)
                // console.log(data)
                // const { roles, nickname, avatar_url,id } = data
                // roles must be a non-empty array
                // if (!roles || roles.length <= 0) {
                //     reject('getInfo: roles must be a non-null array!')
                // }

                commit('SET_ROLES', roles)
                commit('SET_NAME', nickname)
                commit('SET_AVATAR', avatar)
                commit('SET_ID', userId)
                resolve(data)
                
            // }).catch(error => {
            //     reject(error)
            //     debugger
            // })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                localStorage.removeItem('type')
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