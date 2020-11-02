/**
 * 所有通用性配置
 */
import Vue from 'vue';

// 通用性function
import "./common/proto";

// 引入axios.js文件
import http from "./axios/axios.instance";
Vue.prototype.$http = http;

// 接口定义
import api from "./api/index";
Vue.prototype.$api = api;

// require('./mock'); //引入mock数据，关s闭则注释该行

// 自定义组件  全局注册
import components from './common/components';
Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
});

// 全局filters,后添加全局过滤器

Vue.config.productionTip = false;
