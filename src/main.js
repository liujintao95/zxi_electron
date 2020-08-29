import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';

axios.defaults.baseURL = '127.0.0.1:5000'
Vue.prototype.$axios = axios
Vue.prototype.$file = window.require('electron').remote.getGlobal('file')



Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
