// Vue
import Vue from 'vue';
import App from './App';
// store
import store from 'ex/store/index';

import AMMap from '@/index';
require('ex/assets/reset.css');

// 菜单和路由设置
import router from './router';
// import { frameInRoutes } from '~ex/router/routes'
// require('@/assets/style/font/iconfont.css');
// 核心插件
// Vue.use(d2Admin)
import Element from 'element-ui';
Vue.use(Element, { size: 'small' });

require('ex/mock/index.js');

Vue.use(AMMap);

new Vue({
    router,
    store,
    render: h => h(App),
    created () {

    },
    mounted () {

    }
}).$mount('#app');
