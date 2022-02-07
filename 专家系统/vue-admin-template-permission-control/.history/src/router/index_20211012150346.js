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
/**
 * 舆论 + admin + 自媒体 ( 分包打包 )
 */
export const constantRoutes = [
    {

        path: '/test/index',
        component: Layout,
        children: [{
            path: '/test/index',
            name: 'test',
            component: () =>
                import('@/views/test/index'),

        }],
        hidden: true
    },

    {

        path: '/login',
        component: () =>
            import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import('@/views/404'),
        hidden: true
    },
    {
        path: '/test',
        component: () =>
            import('@/components/UploadImg/upload-cropper'),
        hidden: true
    },
    {
        path: '/depDet',
        component: Layout,
        children: [{
            path: '/depDet',
            name: 'depDet',
            component: () =>
                import('@/views/department/depDet'),

        }],
        hidden: true
    },
    {
        path: '/edit/article',
        component: Layout,
        children: [{
            path: '/edit/article',
            name: '文章详情',
            component: () =>
                import('@/views/addCont/article'),

        }],
        hidden: true
    }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    {
        path: '/',
        component: Layout,
        children: [{
            path: '',
            name: 'index',
            component: () =>
                import('@/views/index'),
            meta: { title: '数据', icon: 'dashboard' }
        }]
    },
    {
        path: '/count',
        component: Layout,
        redirect: '/count/basketball/article',
        name: '数据分析',
        meta: { title: '数据分析', icon: 'dashboard', roles: ['ADMIN', 'DATA_ANALYSIS'] },
        children: [{
            path: 'basketball/article',
            name: 'data',
            component: () =>
                import('@/views/dashboard/index'),
            meta: { title: '篮球文章统计', icon: 'dashboard' }
        },
        {
            path: 'basketball/video',
            name: 'data',
            component: () =>
                import('@/views/dashboard/video'),
            meta: { title: '篮球视频统计', icon: 'dashboard' }
        },
        {
            path: 'football/article',
            name: 'data',
            component: () =>
                import('@/views/dashboard/index'),
            meta: { title: '足球文章统计', icon: 'dashboard' }
        },
        {
            path: 'football/video',
            name: 'data',
            component: () =>
                import('@/views/dashboard/video'),
            meta: { title: '足球视频统计', icon: 'dashboard' }
        },
        {
            path: 'push/record',
            name: 'data',
            component: () =>
                import('@/views/push/record'),
            meta: { title: '推送概览', icon: 'dashboard' }
        }
            // {
            //     path: 'eva',
            //     name: 'data',
            //     component: () =>
            //         import ('@/views/dashboard/eva'),
            //     meta: { title: '评论统计', icon: 'dashboard'}
            // }
        ]
    },
    {
        path: '/basketball',
        component: Layout,
        redirect: '/basketball/banner',
        name: '篮球应用',
        meta: { title: '篮球应用', icon: 'example', roles: ['ADMIN', 'APPLICATION_FOOTBALL', 'COMMON_SETTING'] },
        children: [
            {
                path: 'banner',
                name: 'banner',
                component: () =>
                    import('@/views/banner/index'),
                meta: { title: 'banner设置', icon: 'tree' }
            },
            {
                path: 'push',
                name: 'push',
                component: () =>
                    import('@/views/push/index'),
                meta: { title: '内容推送', icon: 'form' }
            },
            {
                path: 'follow',
                name: 'follow',
                component: () =>
                    import('@/views/follow/index'),
                meta: { title: '关注列表', icon: 'tree' }
            },
            {
                path: 'article',
                name: '文章管理',
                component: () =>
                    import('@/views/check/article'),
                meta: { title: '文章管理', icon: 'tree' }
            },
            {
                path: 'video',
                name: '视频管理',
                component: () =>
                    import('@/views/check/video'),
                meta: { title: '视频管理', icon: 'tree' }
            },
            {
                path: 'circle',
                name: 'circle',
                component: () =>
                    import('@/views/circle/index'),
                meta: { title: '圈子管理(管理)', icon: 'tree', roles: ['ADMIN', 'COMMON_SETTING'] }
            },
            {
                path: 'live',
                name: 'live',
                component: () =>
                    import('@/views/live/index'),
                meta: { title: '直播间设置(管理)', icon: 'tree', roles: ['ADMIN', 'COMMON_SETTING'] }
            },
            {
                path: 'channel',
                name: 'channel',
                component: () =>
                    import('@/views/channel/index'),
                meta: { title: '频道调整(管理)', icon: 'tree', roles: ['ADMIN', 'COMMON_SETTING'] }
            }
        ]
    },
    {
        path: '/football',
        component: Layout,
        redirect: '/football/banner',
        name: '足球应用',
        meta: { title: '足球应用', icon: 'example', roles: ['ADMIN', 'APPLICATION_FOOTBALL', 'COMMON_SETTING'] },
        children: [
            {
                path: 'banner',
                name: 'banner',
                component: () =>
                    import('@/views/banner/index'),
                meta: { title: 'banner设置', icon: 'tree' }
            },
            {
                path: 'push',
                name: 'push',
                component: () =>
                    import('@/views/push/index'),
                meta: { title: '内容推送', icon: 'form' }
            },
            {
                path: 'follow',
                name: 'follow',
                component: () =>
                    import('@/views/follow/index'),
                meta: { title: '关注列表', icon: 'tree' }
            },
            {
                path: 'article',
                name: '文章管理',
                component: () =>
                    import('@/views/check/article'),
                meta: { title: '文章管理', icon: 'tree' }
            },
            {
                path: 'video',
                name: '视频管理',
                component: () =>
                    import('@/views/check/video'),
                meta: { title: '视频管理', icon: 'tree' }
            },
            {
                path: 'circle',
                name: 'circle',
                component: () =>
                    import('@/views/circle/index'),
                meta: { title: '圈子管理(管理)', icon: 'tree', roles: ['ADMIN', 'COMMON_SETTING'] }
            },
            {
                path: 'live',
                name: 'live',
                component: () =>
                    import('@/views/live/index'),
                meta: { title: '直播间设置(管理)', icon: 'tree', roles: ['ADMIN', 'COMMON_SETTING'] }
            },
            {
                path: 'channel',
                name: 'channel',
                component: () =>
                    import('@/views/channel/index'),
                meta: { title: '频道调整(管理)', icon: 'tree', roles: ['ADMIN', 'COMMON_SETTING'] }
            }
        ]
    },
    {
        path: '/expert',
        component: Layout,
        redirect: '/expert/banner',
        name: '专家应用',
        meta: { title: '专家应用', icon: 'example', roles: ['ADMIN', 'APPLICATION_FOOTBALL', 'COMMON_SETTING'] },
        children: [
            {
                path: 'banner',
                name: 'banner',
                component: () =>
                    import('@/views/banner/index'),
                meta: { title: 'banner设置', icon: 'tree' }
            },
        ]
    },
    {
        path: '/lives',
        component: Layout,
        redirect: '/lives/index',
        name: '直播管理',
        meta: { title: '直播管理', icon: 'example', roles: ['ADMIN', 'APPLICATION_FOOTBALL', 'COMMON_SETTING'] },
        children: [
            {
                path: 'channel',
                name: 'channel',
                component: () =>
                    import('@/views/channel/anchor'),
                meta: { title: '频道管理', icon: 'tree', roles: ['ADMIN', 'COMMON_SETTING'] }
            },
            {
                path: 'banner',
                name: 'banner',
                component: () =>
                    import('@/views/banner/anchor'),
                meta: { title: 'banner管理', icon: 'tree' }
            },
            {
                path: '/self/live',
                name: 'live',
                component: () =>
                    import('@/views/live/index'),
                meta: { title: '自建比赛直播间设置', icon: 'tree', roles: ['ADMIN', 'COMMON_SETTING'] }
            },
            {
                path: 'follow',
                name: 'follow',
                component: () =>
                    import('@/views/follow/anchor'),
                meta: { title: '关注列表', icon: 'tree' }
            },
            {
                path: 'anchor',
                name: 'anchor',
                component: () =>
                    import('@/views/anchor/index'),
                meta: { title: '主播管理', icon: 'tree' }
            },
        ]
    },
    {
        path: '/start',
        component: Layout,
        redirect: '/start',
        name: '应用通用',
        meta: { title: '应用通用(管理)', icon: 'example', roles: ['ADMIN', 'COMMON_SETTING'] },
        children: [
            // {
            //     path: 'start',
            //     name: '启动页设置',
            //     component: () =>
            //         import('@/views/start/index'),
            //     meta: { title: '启动页设置', icon: 'table' }
            // },
            {
                path: 'newPush',
                name: 'newPush',
                component: () =>
                    import('@/views/newPush/index'),
                meta: { title: '系统消息', icon: 'tree' }
            },
            {
                path: 'rec',
                name: 'rec',
                component: () =>
                    import('@/views/follow/rec'),
                meta: { title: '推荐列表', icon: 'tree' }
            },
            {
                path: 'sensitive',
                name: 'sensitive',
                component: () =>
                    import('@/views/sensitive/index'),
                meta: { title: '敏感词', icon: 'tree' }
            },
            {
                path: 'protocol',
                name: 'protocol',
                component: () =>
                    import('@/views/protocol/index'),
                meta: { title: '协议文档', icon: 'tree' }
            },
            {
                path: 'version',
                name: 'version',
                component: () =>
                    import('@/views/version/index'),
                meta: { title: '版本更新', icon: 'tree' }
            },
        ]
    },
    {
        path: '/check',
        component: Layout,
        redirect: '/check/football/article',
        name: '内容审核',
        meta: { title: '内容审核', icon: 'example', roles: ['ADMIN', 'CHECK_MEDIA'] },
        children: [
            {
                path: 'expert',
                name: 'expert',
                component: () =>
                    import('@/views/check/expert'),
                meta: { title: '专家方案审核', icon: 'tree' }
            },
            {
                path: 'football/article',
                name: '足球文章审核',
                component: () =>
                    import('@/views/check/article'),
                meta: { title: '足球文章审核', icon: 'form' }
            },
            {
                path: 'football/video',
                name: '足球视频审核',
                component: () =>
                    import('@/views/check/video'),
                meta: { title: '足球视频审核', icon: 'form' }
            },
            {
                path: 'basketball/article',
                name: '篮球文章审核',
                component: () =>
                    import('@/views/check/article'),
                meta: { title: '篮球文章审核', icon: 'form' }
            },
            {
                path: 'basketball/video',
                name: '篮球视频审核',
                component: () =>
                    import('@/views/check/video'),
                meta: { title: '篮球视频审核', icon: 'form' }
            },
            {
                path: 'diss',
                name: 'diss',
                component: () =>
                    import('@/views/diss/index'),
                meta: { title: '帖子管理', icon: 'tree' }
            },
            {
                path: 'eva',
                name: 'eva',
                component: () =>
                    import('@/views/check/eva'),
                meta: { title: '评论审核', icon: 'tree' }
            },
            {
                path: 'report',
                name: 'report',
                component: () =>
                    import('@/views/report/index'),
                meta: { title: '举报', icon: 'tree' }
            }
        ]
    },
    {
        path: '/checkUser',
        component: Layout,
        redirect: '/user',
        name: '用户审核',
        meta: { title: '用户审核', icon: 'example', roles: ['ADMIN', 'CHECK_USER'] },
        children: [
            {
                path: 'user',
                name: '用户',
                component: () =>
                    import('@/views/userCheck/index'),
                meta: { title: '用户审核', icon: 'form' }
            },
            {
                path: 'expert',
                name: 'Tree',
                component: () =>
                    import ('@/views/userCheck/expert'),
                meta: { title: '专家用户审核', icon: 'tree'}
            },
            {
                path: 'anchor',
                name: 'Tree',
                component: () =>
                    import ('@/views/userCheck/anchor'),
                meta: { title: '主播审核', icon: 'tree'}
            }
        ]
    },
    {
        path: '/activity',
        component: Layout,
        redirect: '/invitation',
        name: '活动',
        meta: { title: '活动', icon: 'example', roles: ['ADMIN', 'CHECK_USER'] },
        children: [
            {
                path: 'invitation',
                name: '拉新活动',
                component: () =>
                    import('@/views/invitation/index'),
                meta: { title: '拉新活动', icon: 'form' }
            },
        ]
    },
    {
        path: '/backups',
        component: Layout,
        redirect: '/backups/department',
        name: '权限管理',
        meta: { title: '管理权限', icon: 'example', roles: ['ADMIN', 'COMMON_MANAGER'] },
        children: [
            // {
            //     path: 'index',
            //     name: 'backups',
            //     component: () =>
            //         import ('@/views/backups/index'),
            //     meta: { title: '备份', icon: 'form' }
            // },
            {
                path: 'department',
                name: 'department',
                component: () =>
                    import('@/views/department/index'),
                meta: { title: '部门管理', icon: 'tree', roles: ['ADMIN'] }
            },
            {
                path: 'child',
                name: 'child',
                component: () =>
                    import('@/views/department/child'),
                meta: { title: '我的部门管理', icon: 'tree' }
            },
            {
                path: 'feedback',
                name: 'feedback',
                component: () =>
                    import('@/views/feedback/index'),
                meta: { title: '用户反馈', icon: 'form' }
            },
            {
                path: 'appUser',
                name: 'appUser',
                component: () =>
                    import('@/views/appUser/index'),
                meta: { title: '用户维护', icon: 'tree' }
            },
            {
                path: 'journal',
                name: 'journal',
                component: () =>
                    import('@/views/journal/index'),
                meta: { title: '操作日志', icon: 'tree' }
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