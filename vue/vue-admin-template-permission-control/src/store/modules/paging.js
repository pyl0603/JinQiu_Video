const state = {
    /**
     * @type {Number} 
     * @description set paging total record
     */
    total: 100,
    /**
     * @type {boolean} true | false 
     * @description whether show paging
     */
    isPaging: false,
    /**
     * @type {Number} 
     * @description set paging start page
     */
    page: 1
}

const mutations = {
    setPaging(state, str) {
        state.isPaging = str;
    },
    setTotal(state, str) {
        state.total = str;
    },
    setPage(state, str) {
        state.page = str;
    }

}

export default {
    state,
    mutations
}