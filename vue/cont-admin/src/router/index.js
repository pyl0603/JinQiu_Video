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
/***
 * 舆论 + admin + 自媒体 ( 分包打包 )
 */
export const constantRoutes = [
    {

        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {

        path: '/',
        component: () =>
            import ('@/views/choosePart/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    {
        path: '/test',
        component: () =>
            import ('@/components/UploadImg/upload-cropper'),
        hidden: true
    }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    {
        path: '/index',
        component: Layout,
        redirect: '/count',
        name: '统计',
        meta: { title: '统计', icon: 'example' },
        children: [{
                path: '/count',
                name: '统计',
                component: () =>
                    import ('@/views/count/index'),
                meta: { title: '统计', icon: 'form'}
            }
        ]
    },
    {
        path: '/addCont',
        component: Layout,
        redirect: '/addCont/index',
        name: '文章',
        meta: { title: '文章', icon: 'example', roles: ['EDITOR_ZMT_ARTICLE','EDITOR_INTERNAL_ARTICLE']  },
        children: [{
                path: '/addCont/index',
                name: 'addCont',
                component: () =>
                    import ('@/views/addCont/article'),
                meta: { title: '添加文章', icon: 'form'}
            },
            {
                path: 'contMana',
                name: 'contMana',
                component: () =>
                    import ('@/views/contMana/index'),
                meta: { title: '管理文章', icon: 'tree' }
            }
        ]
    },
    {
        path: '/video',
        component: Layout,
        redirect: '/video/index',
        name: '视频',
        meta: { title: '视频', icon: 'example' },
        children: [
            {
                path: 'index',
                name: 'video',
                component: () =>
                    import ('@/views/addCont/video'),
                meta: { title: '添加视频', icon: 'form', roles: ['EDITOR_INTERNAL_VIDEO', 'EDITOR_ZMT_VIDEO'] }
            },
            {
                path: 'videoMana',
                name: 'videoMana',
                component: () =>
                    import ('@/views/contMana/video'),
                meta: { title: '管理视频', icon: 'tree', roles: ['EDITOR_INTERNAL_VIDEO', 'EDITOR_ZMT_VIDEO']  }
            },
        ]
    },
    {
        path: '/live',
        component: Layout,
        redirect: '/live/indedx',
        name: '比赛',
        meta: { title: '比赛', icon: 'example' },
        children: [{
                path: 'index',
                name: 'live',
                component: () =>
                    import ('@/views/potpourris/index'),
                meta: { title: '直播间功能', icon: 'tree', roles: ['EDITOR_INTERNAL_VIDEO'] }
            },
            {
                path: 'rec',
                name: 'rec',
                component: () =>
                    import ('@/views/recComp/index'),
                meta: { title: '推荐比赛', icon: 'tree', roles: ['EDITOR_INTERNAL_VIDEO'] }
            },
        ]
    },
    {
        path: '/source',
        component: Layout,
        redirect: '/fileMana/index',
        name: '资源库',
        meta: { title: '资源库', icon: 'example' },
        children: [{
                path: 'index',
                name: 'fileMana',
                component: () =>
                    import ('@/views/fileMana/index'),
                meta: { title: '文件管理', icon: 'form', roles: ['EDITOR_ZMT_ARTICLE', 'EDITOR_INTERNAL_VIDEO','EDITOR_INTERNAL_ARTICLE','EDITOR_ZMT_VIDEO'] }
            },
            {
                path: 'tags',
                name: 'tags',
                component: () =>
                    import ('@/views/tags/index'),
                meta: { title: '标签管理', icon: 'tree', roles: ['EDITOR_INTERNAL_VIDEO','EDITOR_INTERNAL_ARTICLE'] }
            }
        ]
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