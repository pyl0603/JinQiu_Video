const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    uid:state => state.user.uid,
    permission_routes: state => state.permission.routes,
    total: state => state.paging.total,
    isPaging: state => state.paging.isPaging,
    page: state => state.paging.page
}
export default getters