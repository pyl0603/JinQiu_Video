import { login, logout, getInfo, accountLogin } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userId: '',
    roles: [],
    userInfo: {},

  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phoneNumber, code, passwordMD5 } = userInfo

    if (code) {
      return new Promise((resolve, reject) => {
        login({ phoneNumber: phoneNumber.trim(), code: code }).then(response => {
          const { data } = response
          const { userInfo } = data
          commit('SET_TOKEN', data.userToken)
          console.log('token', data.userToken);
          commit('SET_USERINFO', userInfo)
          setToken(data.userToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        accountLogin({ phoneNumber: phoneNumber.trim(), passwordMD5: passwordMD5 }).then(response => {
          const { data } = response
          const { userInfo } = data
          commit('SET_TOKEN', data.userToken)
          console.log('token', data.userToken);
          commit('SET_USERINFO', userInfo)
          setToken(data.userToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log(state.userInfo, '!!!!!!!!!!!!!!!!!!');
      // getInfo(state.token).then(response => {
      // const { data } = response

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
      commit('SET_NAME', nickname)
      commit('SET_AVATAR', avatar)
      commit('SET_USERID', userId)
      commit('SET_ROLES', roles)
      resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        ommit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_USERID', '')
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      commit('SET_USERID', '')
      commit('RESET_STATE')
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

