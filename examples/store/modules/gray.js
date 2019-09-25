export default {
    namespaced: true,
    state: {
    // 灰度
        active: false,
        text:'你好 世界',
        count: 0
    },
    actions: {
        gogoshow(){
            console.log('ddddddddddddddd');
        },
        increment (context) {
            context.commit('increment');
        }
    },
    mutations: {
        /**
         *
         * @param {*} state
         */
        increment (state) {
            state.count++;
        },
        /**
         * @description 切换灰度状态
         * @param {Object} state vuex state
         */
        toggle (state) {
            state.active = !state.active;
        },
        /**
         * @description 设置灰度模式
         * @param {Object} state vuex state
         * @param {Boolean} active active
         */
        set (state, active) {
            state.active = active;
        }
    }
};
