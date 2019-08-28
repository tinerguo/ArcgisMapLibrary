/**
 * Created by tiner on 2019/8/27.
 */
var d2admin = {
    namespaced: true,
    modules
};

import Vue from 'vue';
import Vuex from 'vuex';


const files = require.context('./modules', false, /\.js$/);
const modules = {};

files.keys().forEach(key => {
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
});


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        d2admin
    }
});
