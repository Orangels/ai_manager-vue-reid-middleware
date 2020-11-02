import axios from "axios";
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import router from "../../router/index";
import UI from '../ui';

/**
 * 封装axios类
 */
class http {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.loading = null;
    }
    
    getInstance() {
        // 自定义实例默认值
        let instance = axios.create({
            baseURL: this.baseUrl || '', //公共接口url（如果有多个的公共接口的话，需要处理）
            timeout: 300000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true, // default:false 是否允许带cookie等
        });

        // 请求拦截
        instance.interceptors.request.use(
            config => {
                // 在发送请求之前做些什么

                // 获取token，配置请求头
                // const TOKEN = localStorage.getItem('TOKEN_MARK')
                // 演示的token（注意配置请求头，需要后端做cros跨域处理，我这里自己前端配的跨域）
                // if (TOKEN) {
                //     config.headers['Authorization'] = TOKEN;
                // }
                // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                //我们将参数返回出来

                // 后端要求，每次请求都得传 user_name 
                let USER_MARK = localStorage.getItem('USER_MARK');
                if (config.method === 'get') {
                    if(config.params) config.params.user_name = USER_MARK;
                } else {
                    if(config.data) config.data.user_name = USER_MARK;
                }
                return config;
            },
            error => {
                // 对请求错误做些什么，处理这个错误

                // 可以直接处理或者展示出去,toast show()
                console.warn(error);
                //如果错误，我们则使用Promise异步方法将error输出
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        instance.interceptors.response.use(
            (response) => {
                // 对响应数据做点什么
                this.showLoading(false);
                // console.log(response)
                // 根据你们家的后端定义请求过期后返回的参数，处理token过期问题
                const { status } = response;
                // 判断状态码401或者其它条件
                // token过期后处理
                // 1.删除你本地存储的那个过期的token
                if (status === 200) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(response);
                }
            },
            (error) => {
                this.showLoading(false);
                // 对响应错误做点什么
                // if (!window.navigator.onLine)//关于断网组件中的刷新重新获取数据
                switch (error.response.status) {
                    // 未登录
                    case 401:
                        router.replace({
                            path: '/login',
                            query: { redirect: router.currentRoute.fullPath }
                        });
                        break;
                    case 500:
                        this.$message({ type: "error", message: "服务端出错" });
                        break;
                    default:
                        return Promise.reject(error.response);
                        break;
                }
            }
        );

        return instance;
    }

    /**
     * axios get 请求封装
     * @param {String} url 请求路径
     * @param {*} params 请求参数对象
     * @param {*} loading 该请求是否需要loading, 默认false：不需要
     */
    get(url, params, loading) {
        if (loading) this.showLoading(true);
        let instance = this.getInstance();
        return instance.get(url, { params });
    }

    /**
     * axios post 请求封装
     * @param {String} url 请求路径
     * @param {*} params 请求参数对象
     * @param {*} loading 该请求是否需要loading, 默认false：不需要
     */
    post(url, params, loading) {
        if (loading) this.showLoading(true);
        let instance = this.getInstance();
        return instance.post(url, params);
        // return instance.post(url, QS.stringify(params));
    }

    /**
     * 全局loading 
     * @param {Boolean} flag 全局loading 
     */
    showLoading(flag) {
        if (flag) {
            this.loading = UI.Loading.Singleton();
        } else {
            this.loading();
        }
    }
}

export default http;