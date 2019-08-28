// Vue
import Vue from 'vue'
import App from './App'
// store
// import store from '~ex/store/index'

// 菜单和路由设置
import router from './router'
// import { frameInRoutes } from '~ex/router/routes'

// require('@/assets/style/font/iconfont.css');

// 核心插件
// Vue.use(d2Admin)

new Vue({
  router,
  // store,
  render: h => h(App),
  created () {

  },
  mounted () {

  }
}).$mount('#app')
