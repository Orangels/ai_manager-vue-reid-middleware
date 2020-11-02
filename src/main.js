import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import i18n from './utils/i18n/index';
import UI from './utils/ui/index';
import { async } from 'q';
import "./utils";
import "./App.scss"



new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
