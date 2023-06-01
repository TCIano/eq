import '@/styles/tailwind.css'
import 'ant-design-vue/dist/antd.css'
//引入全局样式
import './styles/global.less'
import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import 'lib-flexible'
//引入antd样式
import Antd from 'ant-design-vue'

import router from './router'
Vue.use(Antd)
Vue.config.productionTip = false

new Vue({
   router,
   store,
   render: h => h(App),
}).$mount('#app')
