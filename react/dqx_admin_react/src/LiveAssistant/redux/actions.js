import * as types from './actionTypes'
/**
 *  控制导航栏伸缩
 */
export function toggleCollapsed(collapsed) {
  return {
    type: types.ToggleCollapsed,
    collapsed
  }
}

/**
 * token操作类型
 */
export function setToken(token) {
  return{
    type: types.SetToken,
    token
  }
}

/**
 * loading操作类型
 */
export function setLoading(loading) {
  return{
    type: types.SetLoading,
    loading
  }
}

/**
 * username
 */
export function setUserName(username) {
  return{
    type: types.SetUserName,
    username
  }
}