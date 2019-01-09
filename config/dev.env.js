'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  shop_front_api: '"/bs"',
  // shop_front_api: '"http://api.parkwing.cn/shop"',
})
