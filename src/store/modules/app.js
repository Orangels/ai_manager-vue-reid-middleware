import { staticRouter } from "@/router/router";
import $router from "@/router/index";
export default {
    state: {
        authRules: [], // 权限列表
        routers: staticRouter, // 全部路由，默认不需要权限的路由
    },
    mutations: {
        /**
         * 设置所有路由
         * @param {*} state 
         * @param {*} authRouters 
         */
        setAllRouters(state, authRouters) {
            state.routers = staticRouter.concat(authRouters);
        },
        /**
         * 设置权限表
         * @param {*} state 
         * @param {*} authRules 
         */
        setAuthRules(state, authRules) {
            state.authRules = authRules;
        },
        /**
         * 退出登录
         * @param {*} state 
         */
        loginOut(state) {
            state.authRules = [];
            state.routers = staticRouter;
            window.localStorage.removeItem("TOKEN_MARK");
            window.localStorage.removeItem("USER_MARK");
            window.localStorage.removeItem("is_admin");
            $router.push("/login");
        }
    },
    actions: {
        /**
         * 获取路由权限（路由菜单）
         * @param {*} param0 
         */
        getAuthRouter({ commit }) {
            return new Promise((resolve, rejece) => {
                // userInfo().then(response => {
                //     if (response.code !== 0) {
                //         reject("登录失效");
                //     }
                // const data = response.data || [];
                // 后端现在还没有接口，先暂定
                let is_admin = window.localStorage.getItem('is_admin');
                let authRules = [];
                if (is_admin) {
                    authRules = ["mark-mgt", "task-center", "task-mgt", "task-process", "task-template"];
                } else {
                    authRules = ["mark-mgt", "task-center"];
                }
                commit('setAuthRules', authRules);
                resolve(authRules);
                // }).catch(error => {
                //     reject(error);
                // });
            })
        },

        /**
         * 设置路由
         * @param {*} param0 
         */
        filterRouterMenu({ commit }, authRouters) {
            commit('setAllRouters', authRouters)
        },

    }
}