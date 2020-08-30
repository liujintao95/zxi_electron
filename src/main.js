import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios'
import qs from 'qs'
import 'element-ui/lib/theme-chalk/index.css';

axios.defaults.baseURL = 'http://127.0.0.1:5000'
axios.defaults.adapter = require('axios/lib/adapters/http');
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$file = window.require('electron').remote.getGlobal('file')



Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
