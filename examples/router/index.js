/**
 * Created by tiner on 2019/8/27.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


// 路由数据
import routes from './routes'


Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
        routes
})

router.afterEach(to => {
        // 进度条
        NProgress.done()
})

export default router