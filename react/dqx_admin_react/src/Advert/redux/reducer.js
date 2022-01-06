import { combineReducers } from 'redux';
import * as actionType from './actionTypes'

//  初始状态
const initialState = {
	collapsed: false,
	token:'',
	loading: false
}

/**
 * 修改控制导航栏状态
 */
function menuStatus(state = initialState.collapsed, action) {
	switch (action.type) {
		case actionType.ToggleCollapsed: return action.collapsed;
		default:
      return state
	}
}


/**
 * 设置token
 */
function tokenValue(state = initialState.token, action) {
	switch (action.type) {
		case actionType.SetToken: return action.token;
		default:
      return state
	}
}

/**
 * 设置loading
 */
function loadingValue(state = initialState.loading, action) {
	switch (action.type) {
		case actionType.SetLoading: return action.loading;
		default:
      return state
	}
}

const adSystem = combineReducers({
  menuStatus,
  tokenValue,
  loadingValue
})

export default adSystem;