import Vue from 'vue';
import ElementUI from 'element-ui';
import './element-ui.scss';

// iconfont 字体图标库
import "@assets/iconfont/iconfont.css";

// 引入全局自定义组件样式
import "./ui-component.scss";


// 定义 this 的 $v
let $v = Vue.prototype.$v = {
    // theme
    theme: 'default',
    // paging
    paging: {
        layout: 'prev, pager, next, total, jumper, sizes',
        pageSizes: [5, 10, 20, 50],
        pageSize: 10,
        pagerCount: 5
    }

};

// 定义 ElementUI 的 alert
ElementUI.MessageBox.__alert__ = ElementUI.MessageBox.alert;

ElementUI.MessageBox.alert = function (message, title, options) {

    // lockScroll
    options.lockScroll = (document.body.style.overflow !== 'hidden');

    // confirmButtonClass
    options.confirmButtonClass = '@normal';

    // callback
    options.callback = function (action, instance) {

        window.setTimeout(() => window.postMessage({ type: 'unfrozen' }, window.location.origin), 300);

        switch (action) {

            case 'confirm':
                if (instance.confirm) instance.confirm(); break;

            case 'cancel':
                if (instance.cancel) instance.cancel(); break;

        }

    };

    window.postMessage({ type: 'frozen' }, window.location.origin);

    return ElementUI.MessageBox.__alert__(message, title, options);

};

// 定义 ElementUI 的 confirm
ElementUI.MessageBox.__confirm__ = ElementUI.MessageBox.confirm;

ElementUI.MessageBox.confirm = function (message, title, options) {

    // lockScroll
    options.lockScroll = (document.body.style.overflow !== 'hidden');

    // confirmButtonClass
    options.confirmButtonClass = '@normal';

    // cancelButtonClass
    options.cancelButtonClass = '@light-gray-colour';

    // callback
    options.callback = function (action, instance) {

        window.setTimeout(() => window.postMessage({ type: 'unfrozen' }, window.location.origin), 300);

        switch (action) {

            case 'confirm':
                if (instance.confirm) instance.confirm(); break;

            case 'cancel':
                if (instance.cancel) instance.cancel(); break;

        }

    };

    window.postMessage({ type: 'frozen' }, window.location.origin);

    return ElementUI.MessageBox.__confirm__(message, title, options);

};

// 定义 ElementUI 的 Tabs
ElementUI.Tabs.components.TabNav.methods.changeTab = function () {

};

ElementUI.Tabs.components.TabNav.methods.setFocus = function () {

};

ElementUI.Tabs.components.TabNav.components.TabBar.computed.barStyle.get = function () {

    // @distinct
    //
    var isDistinct;

    // node_modules/element-ui/lib/element-ui.common.js: 21081
    //
    var _this = this;

    if (!this.$parent.$refs.tabs) return {};
    var style = {};
    var offset = 0;
    var tabSize = 0;
    var sizeName = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
    var sizeDir = sizeName === 'width' ? 'x' : 'y';
    var firstUpperCase = function firstUpperCase(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, function (L) {
            return L.toUpperCase();
        });
    };
    this.tabs.every(function (tab, index) {
        var $el = _this.$parent.$refs.tabs[index];

        // @distinct
        //
        if (isDistinct === undefined) {
            isDistinct = (_this.$parent.$parent.$el.className.indexOf('@distinct') !== -1);
        }

        if (!$el) {
            return false;
        }

        if (!tab.active) {
            offset += $el['client' + firstUpperCase(sizeName)];
            return true;
        } else {
            tabSize = $el['client' + firstUpperCase(sizeName)];
            // if (sizeName === 'width' && _this.tabs.length > 1) {
            // ->
            if (sizeName === 'width') {
                // tabSize -= index === 0 || index === _this.tabs.length - 1 ? 20 : 40;
                // ->
                if (!isDistinct) {
                    tabSize -= (index ? 24 : 12);
                }
            }
            return false;
        }
    });

    // if (sizeName === 'width' && offset !== 0) {
    // ->
    if (!isDistinct && sizeName === 'width' && offset !== 0) {
        // offset += 20;
        // ->
        offset += 12;
    }
    var transform = 'translate' + firstUpperCase(sizeDir) + '(' + offset + 'px)';
    style[sizeName] = tabSize + 'px';
    style.transform = transform;
    style.msTransform = transform;
    style.webkitTransform = transform;

    return style;

};



// 定义 UI
let UI = {

    // Loading
    Loading: {

        Singleton() {

            let close = ($instance) => {

                if ($instance === UI.Loading.instance) {

                    $instance.close();

                    delete UI.Loading.instance;

                }

            };

            if (UI.Loading.instance) UI.Loading.instance.close();

            return close.bind(null, (UI.Loading.instance = ElementUI.Loading.service()));

        }

    }

};

Vue.use(ElementUI);

export default UI;
