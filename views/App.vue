import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/base.min.css'
import '../public/fontello.css'

Vue.config.productionTip = false
new Vue({
router,
store,
render: h => h(App),
}).$mount('#app')