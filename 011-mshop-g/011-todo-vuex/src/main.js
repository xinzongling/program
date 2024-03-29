//整个项目的入口文件


import Vue from 'vue'
import App from './App.vue'
import './assets/css/common.css'

import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
