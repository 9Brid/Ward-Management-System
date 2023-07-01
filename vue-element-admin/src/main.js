import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
// import zhCn from 'element-plus/lib/locale/lang/zh-cn' // element-plus
import zhCn from 'element-ui/lib/locale/lang/zh-CN' // 导入中文
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import axios from 'axios'

import * as filters from './filters' // global filters
import 'default-passive-events'
import { Message } from 'element-ui'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// mock虚拟数据
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
Vue.prototype.axios = axios
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.use(Element, {
  locale: zhCn // 如果使用中文，无需设置，默认为中文直接删除次属性即可，也可以执行导入中文包手动再次设定为(zhLocale)，当前为：英文enLang
})

// 挂载到$message上
Vue.prototype.$message = Message
