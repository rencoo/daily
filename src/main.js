// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 配置axios
import Axios from 'axios'
import './assets/css/global.css'
// 定义moment全局日期过滤器
import Moment from 'moment'
// 引入 daily-article 与 item 组件
import DailyArticle from './components/Daily-article/Daily-article'
import Item from './components/Item/Item'
// 注册全局组件
Vue.component(DailyArticle.name, DailyArticle)
Vue.component(Item.name, Item)

// 定义moment全局日期过滤器
Vue.filter('convertTime', function (data, formatStr) {
  return Moment(data).format(formatStr)
})
// 相对时间(ex 1小时前)
Vue.filter('relativeTime', function (previousTime) {
  return Moment(previousTime).fromNow()
})

// 配置公共URL
Axios.defaults.baseURL = 'http://127.0.0.1:8010/'
// 添加响应拦截器
Axios.interceptors.response.use(res => res.data)
// 给所有子类挂载$axios属性
Vue.prototype.$axios = Axios
// 给所有子类添加获取今天时间戳方法
Vue.prototype.$getTodayTime = function (data = new Date()) {
  // 输出类型 'number'
  // moment.js获取的时间戳是字符串
  return Number(Moment(data).startOf('day').format('x'))
}
// 给所有子类添加获取日期方法
Vue.prototype.$prevDay = function (timestamp = (new Date()).getTime()) {
  // 输入参数类型 number
  return Moment(timestamp).format('YYYYMMDD')
}

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
