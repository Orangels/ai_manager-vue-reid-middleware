import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
Vue.use(VueRouter)

import { staticRouter, asyncRouter } from "./router";


const router = new VueRouter({
    mode: 'hash', // 默认'hash'，如果是'history'需要后端支持
    // strict: process.env.NODE_ENV !== "production",
    routes: [
        ...staticRouter
    ]
});

/**
 * 
 * @param {*} authRules 
 * @param {*} metaAuthRules 
 */
function hasAuthRouter(authRules, metaAuthRules) {
    if (!authRules || authRules.length <= 0) {
        return false;
    }
    if (authRules.indexOf("admin") >= 0) return true; // admin权限 直接通过
    if (!metaAuthRules) return true;
    return authRules.some(role => metaAuthRules.indexOf(role) >= 0);
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param authRules
 * @param route
 */
function hasRouterRole(authRules, route) {
    if (authRules.indexOf("admin") >= 0 || !route.meta || !route.meta.authRule) {
        return true;
    }
    return authRules.some(authRule => route.meta.authRule.indexOf(authRule) >= 0);
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouter
 * @param authRules
 */
function filterAsyncRouter(asyncRouter, authRules) {
    const accessedRouters = asyncRouter.filter(route => {
        if (hasRouterRole(authRules, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, authRules);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
}


router.beforeEach(($to, $from, $next) => {
    const whiteList = ["/login", "/401", "/404", "/500"]; // 手动白名单
    if (whiteList.indexOf($to.path) != -1) {
        $next(); return;
    }
    // 判断是否有token
    let token = localStorage.getItem('TOKEN_MARK');
    if (token) {
        // $next();
        // 如果本地没有存储权限列表，先请求权限列表，在匹配你路由权限
        if (!store.state.app.authRules || store.state.app.authRules.length === 0) {
            store.dispatch('getAuthRouter').then(($res) => {
                let authRules = $res || [];
                if (authRules.length === 0 && (!$to.matched || $to.matched.length === 0)) {
                    next({ path: "/404", }); // 权限路由没有 && 静态路由没有
                    return;
                }
                // 根据权限获取 异步路由中要添加的路由
                let authRouters = filterAsyncRouter(asyncRouter, authRules);
                // 生成可访问的路由表
                router.addRoutes(authRouters); // 动态添加可访问路由表
                $next({ ...$to }); // hack方法 确保addRoutes已完成
                // 设置左边导航栏
                store.dispatch("filterRouterMenu", { authRouters }).then(() => { });
            }).catch(() => {
                $next({ path: '/login', query: { redirect: $to.fullPath } });
            })
        } else {
            if (!$to.matched || $to.matched.length === 0) {
                router.replace({ path: '/404' });
            } else {
                if (hasAuthRouter(store.state.app.authRules, $to.meta.authRule)) {
                    $next();
                } else {
                    $next({ path: '/403' })
                }
            }
        }
    } else {
        $next({ path: '/login', query: { redirect: $to.fullPath } });
    }
});

router.afterEach(() => {
    // NProgress.done(); // 结束Progress
});

export default router;
