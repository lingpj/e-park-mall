// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';  // 引入mint-ui
import store from './store/index'
import 'mint-ui/lib/style.css'
import * as filters from './filters'; // 全局vue filter
import './assets/iconfont/iconfont.css'
import  { LoadingPlugin,ToastPlugin   } from 'vux'
import fetch from './utils/fetch';
import 'swiper/dist/css/swiper.css';
import animate from 'animate.css'
import { InfiniteScroll } from 'mint-ui';

Vue.use(InfiniteScroll);
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(Mint);
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  console.log(to.name)
  document.title = to.name
  store.commit('changeTabbarTitle',to.name)
  next()
});

Vue.prototype.$fetch = fetch

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
