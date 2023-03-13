import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
Vue.config.productionTip = false
//引入全局样式
import './styles/global.less'
import '@/styles/tailwind.css'
import 'lib-flexible'
//引入antd样式
import 'ant-design-vue/dist/antd.css'

// const Tools = function dispatchEventstroage() {
//    const signSetItem = localStorage.setItem
//    localStorage.setItem = function (key, val) {
//       let setEvent = new Event("setItemEvent")
//       setEvent.key = key
//       setEvent.newValue = val
//       window.dispatchEvent(setEvent)
//       signSetItem.apply(this, arguments)
//    }
// }
// Vue.use(Tools)
Vue.use(Antd)

new Vue({
   router,
   store,
   render: h => h(App),
}).$mount('#app')
