/**
 * Created by tiner on 2019/8/27.
 */
import Vue from 'vue'
import Vuex from 'vuex'


const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
        modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

var d2admin = {
        namespaced: true,
        modules
}


Vue.use(Vuex)

export default new Vuex.Store({
        modules: {
                d2admin
        }
})
