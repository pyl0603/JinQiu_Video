import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
/** *
 * 舆论 + admin + 自媒体 ( 分包打包 )
 */
export const constantRoutes = [{

        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
        path: '/',
        component: Layout
    },
    {
        path: '/start',
        name: 'start',
        component: Layout,
        children: [{
            path: '',
            name: '启动页',
            component: () =>
                import ('@/views/start/index'),
            meta: { title: '启动页', icon: 'table' }
        }]
    },
    {
        path: '/channel',
        name: 'channel',
        component: Layout,
        meta: { title: '频道管理', icon: 'tree' },
        children: [{
            path: '',
            name: '频道调整',
            component: () =>
                import ('@/views/channel/index'),
            meta: { title: '频道调整', icon: 'tree' }
        }]
    },
    {
        path: '/live',
        component: Layout,
        name: '直播间',
        meta: { title: '直播间', icon: 'example' },
        children: [{
                path: 'football/room',
                name: '足球直播间',
                component: () =>
                    import ('@/views/liveRoom/index'),
                meta: { title: '足球直播间', icon: 'tree' }
            },
            {
                path: 'football/source',
                name: '足球直播源',
                component: () =>
                    import ('@/views/liveSource/index'),
                meta: { title: '足球直播源', icon: 'tree' }
            },
            {
                path: 'basketball/room',
                name: '篮球直播间',
                component: () =>
                    import ('@/views/liveRoom/index'),
                meta: { title: '篮球直播间', icon: 'tree' }
            },
            {
                path: 'basketball/source',
                name: '篮球直播源',
                component: () =>
                    import ('@/views/liveSource/index'),
                meta: { title: '篮球直播源', icon: 'tree' }
            }
        ]
    },
    {
        path: '/push',
        component: Layout,
        redirect: '/push',
        name: '推送',
        meta: { title: '推送', icon: 'example' },
        children: [{
                path: 'overview',
                name: 'overview',
                component: () =>
                    import ('@/views/push/overview'),
                meta: { title: '推送概览', icon: 'dashboard' }
            },
            {
                path: 'system',
                name: 'system',
                component: () =>
                    import ('@/views/push/system'),
                meta: { title: '系统推送', icon: 'form' }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        redirect: '/user',
        name: '用户',
        meta: { title: '用户', icon: 'example' },
        children: [{
                path: 'backgroundUser',
                name: '后台用户',
                component: () =>
                    import ('@/views/backgroundUser/index'),
                meta: { title: '后台用户', icon: 'form', roles: ['ADMIN'] }
            },
            {
                path: 'userManagement',
                name: '用户管理',
                component: () =>
                    import ('@/views/userManagement/index'),
                meta: { title: '用户管理', icon: 'form' }
            },
            {
                path: 'feedback',
                name: 'feedback',
                component: () =>
                    import ('@/views/feedback/index'),
                meta: { title: '用户反馈', icon: 'form' }
            }
        ]
    },
    {
        path: '/protocol',
        component: Layout,
        children: [{
            path: '',
            name: 'protocol',
            component: () =>
                import ('@/views/protocol/index'),
            meta: { title: '协议文档', icon: 'tree' }
        }]
    },
    {
        path: '/version',
        component: Layout,
        children: [{
            path: '',
            name: 'version',
            component: () =>
                import ('@/views/version/index'),
            meta: { title: '版本更新', icon: 'tree' }
        }]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router