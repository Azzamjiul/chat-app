import Vue from 'vue'
import App from './App.vue'
import './styles.css';
import { io } from 'socket.io-client';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
