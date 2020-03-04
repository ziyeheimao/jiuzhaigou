import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import * as constant from '@/constants'
import VueAMap from 'vue-amap'                // api:  https://elemefe.github.io/vue-amap
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import 'element-ui/lib/theme-chalk/index.css' // 引入全部样式
import ElementUI from 'element-ui'
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import echarts from 'echarts'
// import formCreate from '@form-create/element-ui' // 动态表单
import api from '@/constants/api-url'
// Vue.use(formCreate)
Vue.use(ElementUI)
Vue.use(VueCookie)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}
// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.$constant = constant // 公共方法
Vue.prototype.$api = api
// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

// 引入高度地图
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '45802ff2270bfb46ee1bfe0cfb00915b',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
