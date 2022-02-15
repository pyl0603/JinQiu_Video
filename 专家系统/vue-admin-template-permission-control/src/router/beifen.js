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
        path: '/loginEva',
        component: () =>
            import ('@/views/login/login-other'),
        hidden: true
    },

    {
        path: '/eva',
        component: () =>
            import ('@/views/editEva/index'),
        meta: { icon: 'nested', title: '舆论' }
    },
    {

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
    },
    {
        path: '/test',
        component: () =>
            import ('@/components/UploadImg/upload-cropper'),
        hidden: true
    },
    {
        path: '/depDet',
        component: Layout,
        children: [{
            path: '/depDet',
            name: 'depDet',
            component: () =>
                import ('@/views/department/depDet'),

        }],
        hidden: true
    },
    {
        path:'/edit/article',
        component:Layout,
        children: [{
            path: '/edit/article',
            name: '文章详情',
            component: () =>
                import ('@/views/addCont/article'),

        }],
        hidden: true
    }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
        path: '/',
        component: Layout,
        children: [{
            path: '',
            name: 'index',
            component: () =>
                import ('@/views/index'),
            meta: { title: '数据', icon: 'dashboard', roles: ['ADMIN', 'EDITOR'] }
        }]
    },
    {
        path: '/data',
        component: Layout,
        // redirect: '/dashboard',
        children: [{
            path: 'data',
            name: 'data',
            component: () =>
                import ('@/views/dashboard/index'),
            meta: { title: '数据', icon: 'dashboard', roles: ['ADMIN', 'EDITOR'] }
        }]
    },

    {
        path: '/application',
        component: Layout,
        redirect: '/application/start',
        name: '应用',
        meta: { title: '应用', icon: 'example' },
        children: [{
                path: 'start',
                name: '启动页设置',
                component: () =>
                    import ('@/views/start/index'),
                meta: { title: '启动页设置', icon: 'table', roles: ['APPLICATION_WELCOME', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'banner',
                name: 'banner',
                component: () =>
                    import ('@/views/banner/index'),
                meta: { title: 'banner设置', icon: 'tree', roles: ['APPLICATION_BANNER', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'live',
                name: 'live',
                component: () =>
                    import ('@/views/live/index'),
                meta: { title: '直播间设置', icon: 'tree', roles: ['APPLICATION_LIVE_SOURCE', 'ADMIN', 'APPLICATION_LIVE_NAVIGATE', 'EDITOR'] }
            },
            {
                path: 'channel',
                name: 'channel',
                component: () =>
                    import ('@/views/channel/index'),
                meta: { title: '频道调整', icon: 'tree', roles: ['APPLICATION_CHANNEL_MANAGE', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'circle',
                name: 'circle',
                component: () =>
                    import ('@/views/circle/index'),
                meta: { title: '圈子管理', icon: 'tree', roles: ['APPLICATION_COMMUNITY', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'diss',
                name: 'diss',
                component: () =>
                    import ('@/views/diss/index'),
                meta: { title: '帖子管理', icon: 'tree', roles: ['APPLICATION_DISCUSS', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'potpourris',
                name: 'potpourris',
                component: () =>
                    import ('@/views/potpourris/index'),
                meta: { title: '集锦管理', icon: 'tree', roles: ['ADMIN'] }
            },
            {
                path: 'follow',
                name: 'follow',
                component: () =>
                    import ('@/views/follow/index'),
                meta: { title: '关注列表', icon: 'tree', roles: ['APPLICATION_ATTENTION', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'protocol',
                name: 'protocol',
                component: () =>
                    import ('@/views/protocol/index'),
                meta: { title: '协议文档', icon: 'tree', roles: ['APPLICATION_LICENCE', 'ADMIN'] }
            },
            {
                path: 'version',
                name: 'version',
                component: () =>
                    import ('@/views/version/index'),
                meta: { title: '版本更新', icon: 'tree', roles: ['APPLICATION_VERSION', 'ADMIN'] }
            },
            {
                path: 'shiming',
                name: 'Tree',
                component: () =>
                    import ('@/views/tree/index'),
                meta: { title: '实名认证', icon: 'tree', roles: ['APPLICATION_USER_VERIFY', 'ADMIN'] }
            }
        ]
    },
    {
        path: '/push',
        component: Layout,
        redirect: '/push/index',
        name: '推送',
        meta: { title: '推送', icon: 'example' },
        children: [{
                path: 'index',
                name: 'push',
                component: () =>
                    import ('@/views/push/index'),
                meta: { title: '内容推送', icon: 'form', roles: ['PUSH_NOTIFICATION', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'newPush',
                name: 'newPush',
                component: () =>
                    import ('@/views/newPush/index'),
                meta: { title: '系统消息', icon: 'tree', roles: ['PUSH_SYS_MESSAGE', 'ADMIN', 'EDITOR'] }
            }
        ]
    },
    {
        path: '/edit',
        component: Layout,
        redirect: '/addCont/index',
        name: '编辑',
        meta: { title: '编辑', icon: 'example' },
        children: [{
                path: 'index',
                name: 'addCont',
                component: () =>
                    import ('@/views/addCont/index'),
                meta: { title: '添加内容', icon: 'form', roles: ['EDITOR_ARTICLE_CREATE', 'EDITOR_VIDEO_CREATE', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'contMana',
                name: 'contMana',
                component: () =>
                    import ('@/views/contMana/index'),
                meta: { title: '管理内容', icon: 'tree' }
            }
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
                meta: { title: '文件管理', icon: 'form', roles: ['RESOURCE_FILES_MANAGE', 'ADMIN', 'EDITOR'] }
            },
            {
                path: 'tags',
                name: 'tags',
                component: () =>
                    import ('@/views/tags/index'),
                meta: { title: '标签管理', icon: 'tree', roles: ['TAG_MANAGE', 'ADMIN', 'EDITOR'] }
            }
        ]
    },
    {
        path: '/feedback',
        component: Layout,
        redirect: '/feedback/index',
        name: '用户反馈',
        meta: { title: '用户反馈', icon: 'example', roles: ['FEEDBACK_MANAGER', 'ADMIN'] },
        children: [{
            path: 'index',
            name: 'feedback',
            component: () =>
                import ('@/views/feedback/index'),
            meta: { title: '用户反馈', icon: 'form' }
        }]
    },
    {
        path: '/check',
        component: Layout,
        redirect: '/check/article',
        name: '审核',
        meta: { title: '审核', icon: 'example' },
        children: [{
                path: 'article',
                name: '文章审核',
                component: () =>
                    import ('@/views/check/article'),
                meta: { title: '文章审核', icon: 'form', roles: ['SETTING_BACK_UP', 'ADMIN'] }
            },
            {
                path: 'video',
                name: '视频审核',
                component: () =>
                    import ('@/views/check/video'),
                meta: { title: '视频审核', icon: 'form', roles: ['SETTING_BACK_UP', 'ADMIN'] }
            },
            {
                path: 'user',
                name: '用户',
                component: () =>
                    import ('@/views/userCheck/index'),
                meta: { title: '用户审核', icon: 'form' }
            }
        ]
    },
    // {
    //     path: '/check',
    //     component: Layout,
    //     redirect: '/userCheck/index',
    //     name: '用户审核',
    //     meta: { title: '审核', icon: 'example', roles: ['ADMIN'] },
    //     children: [{
    //         path: 'index',
    //         name: 'check',
    //         component: () =>
    //             import ('@/views/userCheck/index'),
    //         meta: { title: '用户审核', icon: 'form' }
    //     }]
    // },
    {
        path: '/backups',
        component: Layout,
        redirect: '/backups/index',
        name: '设置',
        meta: { title: '设置', icon: 'example' },
        children: [{
                path: 'index',
                name: 'backups',
                component: () =>
                    import ('@/views/backups/index'),
                meta: { title: '备份', icon: 'form', roles: ['SETTING_BACK_UP', 'ADMIN'] }
            },
            {
                path: 'department',
                name: 'department',
                component: () =>
                    import ('@/views/department/index'),
                meta: { title: '部门管理', icon: 'tree', roles: ['SETTING_DEPARTMENT_MANAGE', 'ADMIN'] }
            },
            {
                path: 'child',
                name: 'child',
                component: () =>
                    import ('@/views/department/child'),
                meta: { title: '我的部门管理', icon: 'tree', roles: ['SETTING_DEPARTMENT_MANAGE_MY'] }
            },
            {
                path: 'appUser',
                name: 'appUser',
                component: () =>
                    import ('@/views/appUser/index'),
                meta: { title: '用户维护', icon: 'tree', roles: ['ADMIN'] }
            },
            {
                path: 'report',
                name: 'report',
                component: () =>
                    import ('@/views/report/index'),
                meta: { title: '举报', icon: 'tree', roles: ['SETTING_REPORT', 'ADMIN'] }
            },
            {
                path: 'sensitive',
                name: 'sensitive',
                component: () =>
                    import ('@/views/sensitive/index'),
                meta: { title: '敏感词', icon: 'tree', roles: ['SETTING_SENSITIVE_WORDS', 'ADMIN'] }
            },
            {
                path: 'journal',
                name: 'journal',
                component: () =>
                    import ('@/views/journal/index'),
                meta: { title: '操作日志', icon: 'tree', roles: ['SETTING_ACTION_LOG', 'ADMIN'] }
            }
        ]
    },
    {
        path: '/nested',
        component: Layout,
        redirect: '/nested/menu1',
        name: 'Nested',
        meta: {
            title: 'Nested',
            icon: 'nested',
            roles: ['ADMIN']
        },
        children: [{
                path: 'menu1',
                component: () =>
                    import ('@/views/nested/menu1/index'), // Parent router-view
                name: 'Menu1',
                meta: { title: 'Menu1', roles: ['EDITOR'] },
                children: [{
                        path: 'menu1-1',
                        component: () =>
                            import ('@/views/nested/menu1/menu1-1'),
                        name: 'Menu1-1',
                        meta: { title: 'Menu1-1' }
                    },
                    {
                        path: 'menu1-2',
                        component: () =>
                            import ('@/views/nested/menu1/menu1-2'),
                        name: 'Menu1-2',
                        meta: { title: 'Menu1-2', roles: ['EDITOR'] },
                        children: [{
                                path: 'menu1-2-1',
                                component: () =>
                                    import ('@/views/nested/menu1/menu1-2/menu1-2-1'),
                                name: 'Menu1-2-1',
                                meta: { title: 'Menu1-2-1' }
                            },
                            {
                                path: 'menu1-2-2',
                                component: () =>
                                    import ('@/views/nested/menu1/menu1-2/menu1-2-2'),
                                name: 'Menu1-2-2',
                                meta: { title: 'Menu1-2-2' }
                            }
                        ]
                    },
                    {
                        path: 'menu1-3',
                        component: () =>
                            import ('@/views/nested/menu1/menu1-3'),
                        name: 'Menu1-3',
                        meta: { title: 'Menu1-3' }
                    }
                ]
            },
            {
                path: 'menu2',
                component: () =>
                    import ('@/views/nested/menu2/index'),
                meta: { title: 'menu2' }
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