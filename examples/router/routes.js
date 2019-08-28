import layoutHeaderAside from '@/layout/header-aside'


// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)



/**
 * 在主框架内显示
 */
const frameIn = [];

/**
 * 在主框架之外显示
 */
const frameOut = [];

/**
 * 错误页面
 */
const errorPage = [];

// 导出需要显示菜单的
export const frameInRoutes = frameIn

export default [
        ...frameOut,
        ...errorPage
]
