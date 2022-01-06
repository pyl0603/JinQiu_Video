const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    uid:state => state.user.uid,
    evaToken: state => state.userEva.token,
    evaAvatar: state => state.userEva.avatar,
    evaRealName: state => state.userEva.name,
    evaName: state => state.userEva.name,
    evaRoles: state => state.userEva.roles,
    userInfo: state => state.userEva.userInfo,
    testname: state => state.userEva.testname,
    permission_routes: state => state.permission.routes,
    permission_eva_routes: state => state.permissionEva.routes,
    total: state => state.paging.total,
    isPaging: state => state.paging.isPaging,
    page: state => state.paging.page
}
export default getters