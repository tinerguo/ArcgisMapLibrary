// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
// eslint-disable-next-line no-underscore-dangle
const _import = require('ex/libs/util.import.' + process.env.NODE_ENV);


import layout from 'ex/layout';


/**
 * 在主框架内显示
 */
const frameIn = [
    {
        path: '/',
        name: '',
        component: layout,
        children: [
            {
                path: '',
                name: '',
                meta: {
                    auth: true
                },
                component: _import('system/index')
            },
            {
                path: 'index',
                name: 'index',
                meta: {
                    auth: true
                },
                component: _import('system/index')
            },
            {
                path: 'show',
                name: 'show',
                meta: {
                    auth: true
                },
                component: _import('system/index')
            }
        ]
    }
];

/**
 * 在主框架之外显示
 */
const frameOut = [
    {
        path: '/login',
        name: 'login',
        component: _import('system/login')
    }
];

/**
 * 错误页面
 */
const errorPage = [];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
];
