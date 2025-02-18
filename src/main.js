import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
// ElementUI.
Vue.use(ElementUI);

new Vue({  //--1
  router,
  render: h => h(App) //--3
}).$mount('#app') //--2
