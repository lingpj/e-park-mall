import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: _import('/home/index'),
    },
    {
      path: '/market',
      name: '商品',
      component: _import('/market/index'),
    },
    {
      path: '/cart',
      name: '购物车',
      component: _import('/cart/index'),
    },
    {
      path: '/mine',
      name: '我的',
      component: _import('/myOrder/index'),
    },
    {
      path: '/settlement',
      name: '结算',
      component: _import('/settlement/index'),
    },
    {
      path: '/myOrder',
      name: '我的订单',
      component: _import('/myOrder/index'),
    },
    {
      path: '/orderDetail',
      name: '订单详情',
      component: _import('/orderDetail/index'),
    },
    {
      path: '/goodsDetail',
      name: '商品详情',
      component: _import('/goodsDetail/index'),
    },
    {
      path: '/payResult',
      name: '付款结果',
      component: _import('/payResult/index'),
    },
    {
      path: '/canlender',
      name: '日历',
      component: _import('/canlender/index'),
      // children: [
      //   { path: '/canlender/detail', name: '预定详情', component: _import('/canlender/detail/index'), },
      // ]
    },
    {
      path: '/canlender/detail',
      name: '预定详情',
      component:_import('/canlender/detail/index')
    },
  ]
})
