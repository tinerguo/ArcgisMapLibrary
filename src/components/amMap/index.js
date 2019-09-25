/**
 * Vue.use 的时候会调用install方法
 * @type {{install: ((Vue)), name: string}}
 */
const AmMap = {
    install (Vue) {
        Vue.prototype.$ammap = new Vue({
            data: {
                GIS: {} //gis 构造函数

            },
            methods:{

            },
            created:function(){
            },
            mounted () {
            },
            beforeMount:function(){

            }
        });
    },
    name:'AmMap'
};
export default AmMap;
