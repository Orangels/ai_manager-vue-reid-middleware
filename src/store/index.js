import Vue from 'vue'
import Vuex from 'vuex'

import app from "./modules/app";
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app
    },
    state: {
        collapse: true,// 菜单收起与否，false：展开
    },
    mutations: {
        // 菜单收起与否，false：展开
        collapseChange($state, $value) {
            $state.collapse = $value;
        }
    },
    actions: {

    }
})
