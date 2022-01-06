import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permissionEva from './modules/permissionEva'
import settings from './modules/settings'
import userEva from './modules/userEva'
import paging from './modules/paging'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        permissionEva,
        settings,
        userEva,
        paging
    },
    getters
})

export default store