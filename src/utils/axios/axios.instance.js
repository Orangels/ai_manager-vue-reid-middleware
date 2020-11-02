import HttpRequest from './index'

// 以后可配置多域请求
// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest()
export default axios
