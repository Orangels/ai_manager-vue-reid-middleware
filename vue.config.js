// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
const path = require('path')
const debug = process.env.NODE_ENV !== 'production'
module.exports = {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
    //例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
    //baseUrl 从 Vue CLI 3.3 起已弃用，请使用publicPath
    //baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

    // outputDir: 生成文件的目录名称（要和baseUrl的生产环境路径一致）
    outputDir: "dist",
    //用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    // 配置js、css等文件夹的二级目录位置，不设置则会在dist下生成4个文件夹
    // assetsDir: "./static",
    //指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
    indexPath: "./index.html",
    //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
    filenameHashing: false,

    // lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
    lintOnSave: true,
    /** 
     * 生产环境是否生成 sourceMap 文件
     * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
     * */
    productionSourceMap: false,
    chainWebpack: (config) => {
        if (debug) { // 开发环境配置
            config.devtool = 'cheap-module-eval-source-map'
        } else { // 生产环境配置
            config.devtool = '#source-map'
        }
        // 修改文件引入自定义路径
        config.resolve.alias
            .set('@', path.resolve(__dirname, './src'))
            .set('@public', path.resolve(__dirname, './public'))
            .set('@views', path.resolve(__dirname, './src/views'))
            .set('@components', path.resolve(__dirname, './src/components'))
            .set('@assets', path.resolve(__dirname, './src/assets'));

        config.module
            .rule("i18n")
            .resourceQuery(/blockType=i18n/)
            .type('javascript/auto')
            .use("i18n")
            .loader("@kazupon/vue-i18n-loader")
            .end();
    },
    // 和 chainWebpack 类似 
    configureWebpack: (config) => {
        Object.assign(config, {
            // 开发生产共同配置, 配置别名
            //     resolve: {
            //         extensions: ['.js', '.json', '.vue'],
            //         alias: {
            //             '@': path.resolve(__dirname, './src') //设置路径别名
            //             // '@views': path.resolve(__dirname, './src/views'),
            //             // '@components': path.resolve(__dirname, './src/components'),
            //             // '@assets': path.resolve(__dirname, './src/assets')
            //         }
            //     }
            // // webpack 的性能提示
            performance: {
                hints: 'warning',
                //入口起点的最大体积 整数类型（以字节为单位）
                maxEntrypointSize: 50000000,
                //生成文件的最大体积 整数类型（以字节为单位 1000k）
                maxAssetSize: 100000000,
                //只给出 css 、 js 文件的性能提示
                assetFilter: function (assetFilename) {
                    return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
                }
            }
        })
    },
    // 它支持webPack-dev-server的所有选项
    devServer: {
        host: "0.0.0.0", //指定使用地址，默认localhost,  0.0.0.0代表可以被外界访问
        port: 8080, // 端口号
        https: false, // 编译失败时刷新页面
        open: true, //配置自动启动浏览器
        hot: true, // 开启热加载
        hotOnly: false,
        // proxy: 'http://154.8.197.178:8888' // 配置跨域处理,只有一个代理
        //proxy: 'http://172.16.104.200:8000', // 配置跨域处理,只有一个代理
        proxy: 'http://127.0.0.1:8000',
        // proxy: 'http://10.11.149.225:8000',
        // proxy: 'http://172.16.105.34:8888' // 配置跨域处理,只有一个代理

        // 配置多个代理
        // proxy: {
        //     "/api": {
        //         target: "<url>",// 要访问的接口域名
        //         ws: true,// 是否启用websockets
        //         changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        //         pathRewrite: {
        //             '^/api': '' //这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
        //         }
        //     },
        //     "/foo": {
        //         target: "<other_url>"
        //     }
        // }
    },
    // 
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/utils/ui/variable.scss";`
            }
        }
    },
    /**
   * 第三方插件配置
   */
    pluginOptions: {
        // 'style-resources-loader': {
        //     preProcessor: 'scss',
        //     patterns: [
        //         path.resolve(__dirname, '@/utils/utils/ui/theme.default.scss'),
        //         path.resolve(__dirname, '@/utils/ui/theme.default-base64.scss'),
        //         path.resolve(__dirname, '@/utils/ui/theme.default-loading.scss'),
        //     ],
        // },
    }
};