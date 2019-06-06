import Vue from 'vue'
import App from './App.vue'

import './assets/css/common.css'
import 'font-awesome/css/font-awesome.min.css' 

import store from './store'
import router from './router'
import filters  from './filters'

Object.keys(filters).forEach(key=>Vue.filter(key,filters[key]))

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render:h=>h(App)
}).$mount('#app')