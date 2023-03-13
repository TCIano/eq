import Vue from 'vue'
import Vuex from 'vuex'
import setting from './modules/setting'
import train from './modules/train'
Vue.use(Vuex)
const store = new Vuex.Store({
   state: {},
   actions: {},
   mutations: {},
   getters: {},
   modules: {
      setting,
      train
   },
})
export default store
