import Index from "@views/index/Index.vue";

/**
 * 静态路由，不需要权限的路由
 */
export const staticRouter = [
    {
        path: '/',
        redirect: '/task-center'
    },
    {
        path: '/',
        component: Index,
        meta: { title: '根目录' },
        children: [
            {
                path: '/hello',
                name: 'hello',
                meta: { title: '组件模板' },
                component: () => import(/* webpackChunkName: "7c0f36f2-32a4-48da-a73e-b4f556341478" */"@components/_/hello/hello-component"),
            },
        ]
    },
    {
        path: '/login',
        meta: { title: '登录' },
        component: () => import(/* webpackChunkName: "8b08445d-9b47-eafa-e202-0a5895a6d3d0" */'@views/login/login')
    },
    // 错误提示页面
    {
        path: '/404',
        name: '404',
        meta: { title: '访问页面不存在' },
        component: () => import(/* webpackChunkName: "7c0f36f2-32a4-48da-a73e-b4f556341478" */"@views/error/404")
    },
    {
        path: '/403',
        name: '403',
        meta: { title: '没有权限访问' },
        component: () => import(/* webpackChunkName: "8d0c9416-01ee-4ad7-961c-73f4d537ffb6" */"@views/error/403")
    }
];


/**
 * 动态路由，需要获取权限
 */
export const asyncRouter = [
    {
        path: '/',
        component: Index,
        meta: { title: '根目录' },
        children: [
            {
                path: '/task-center',
                meta: {
                    title: '任务中心',
                    authRule: ['task-center']
                },
                component: () => import(/* webpackChunkName: "f646c581-0b0f-437b-b3e6-d835f9b44d8d" */"@views/task-center/task-center"),
            },
            {
                path: '/task-mgt',
                meta: {
                    title: '任务管理',
                    authRule: ['task-mgt']
                },
                component: () => import(/* webpackChunkName: "0e4cc20f-a7da-406a-a6df-f55a45a9fcf0" */"@views/task-mgt/task-mgt")
            },
            {
                path: '/task-process',
                meta: {
                    title: '任务进度',
                    authRule: ['task-process']
                },
                component: () => import(/* webpackChunkName: "aaf32a07-7527-433d-85a3-33888d138b00" */"@views/task-process/task-process")
            },
            {
                path: '/task-template',
                meta: {
                    title: '模板管理',
                    authRule: ['task-template']
                },
                component: () => import(/* webpackChunkName: "53cd85b4-32eb-433f-85f3-1440bd6f2b2f" */"@views/task-template/task-template")
            },
        ]
    },
    {
        path: '/mark-mgt',
        meta: {
            title: '标注管理',
            authRule: ['mark-mgt']
        },
        component: () => import(/* webpackChunkName: "52b1d753-fe29-407b-8688-b6a12188f0f2" */"@views/mark-mgt/mark-mgt"),
    },
];
