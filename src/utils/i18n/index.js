import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ElementUILocale from 'element-ui/lib/locale';
import ElementUILocale_enUS from 'element-ui/lib/locale/lang/en';
import ElementUILocale_zhCN from 'element-ui/lib/locale/lang/zh-CN';
import I18n_enUS from './i18n.en-US';
import I18n_zhCN from './i18n.zh-CN';

Vue.use(VueI18n);

let i18n = new VueI18n(
    {
        locale: 'zh-CN',
        messages: {
            'en-US': {
                ...ElementUILocale_enUS,
                ...I18n_enUS
            },
            'zh-CN': {
                ...ElementUILocale_zhCN,
                ...I18n_zhCN
            }
        }
    }
);

// 定义 element-ui 的 i18n
ElementUILocale.i18n(($key, $value) => { i18n.t($key, $value) });

// 定义 this 的 $l
Vue.prototype.$l = ($l) => { i18n.locale = $l };


export default i18n;
