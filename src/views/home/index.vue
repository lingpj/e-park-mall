<template>
  <div style="padding-bottom:55px">
    <homeHeader></homeHeader>
    <mt-swipe :auto="4000" class="myswipe">
      <mt-swipe-item>
        <!-- <img src="../../assets/1.jpg" alt=""> -->
        <div class="box">
          <div class="one"></div>
        </div>
      </mt-swipe-item>
      <mt-swipe-item>
        <!-- <img src="../../assets/2.jpg" alt=""> -->
        <div class="box">
          <div class="two"></div>
        </div>
      </mt-swipe-item>
      <mt-swipe-item>
        <!-- <img src="../../assets/3.jpg" alt=""> -->
        <div class="box">
          <div class="three"></div>
        </div>
      </mt-swipe-item>
      <mt-swipe-item>
        <!-- <img src="../../assets/4.jpg" alt=""> -->
        <div class="box">
          <div class="four"></div>
        </div>
      </mt-swipe-item>
    </mt-swipe>
    <div class="guessLike">
      <div>新品尝鲜</div>
      <ul>
        <li v-for="item in goodsList" @click="goodsListClickHandle(item)" :key="Math.random()+100">
          <!-- <img :src="item.list[0].prefix + item.list[0].path" alt=""> -->
          <div class="img" :style="{backgroundImage:'url('+(item.list[0].prefix + item.list[0].path)+')'}"></div>
          <div class="title">{{item.productName}}</div>
          <div class="description">园区：{{item.servicePark}}</div>
          <div class="price">
            <span class="nowPrice">¥{{item.currentPrice}}</span>
            <del>¥{{item.originalPrice}}</del>
          </div>
        </li>
      </ul>
    </div>
    <homeFooter></homeFooter>
  </div>
</template>



<script>

import homeHeader from '../../components/homeHeader'
import homeFooter from '../../components/homeFooter'
import { getQueryObject } from '../../utils/index'
import Cookies from 'js-cookie'
import store from '../../store'
import getWxParams from '../../utils/wxShare'
export default {
  name: '',
  components: {
    homeHeader,
    homeFooter
  },
  data() {
    return {
      swipeDataArr: [
        { url: '/assets/1.jpg' },
        { url: '../../assets/2.jpg' },
        { url: '../../assets/3.jpg' },
      ],
      goodsList: []
    }
  },
  mounted() {
    // 获取首页的openId
    var openId = sessionStorage.getItem('openId')
    if (!openId || openId == '') {
      if (getQueryObject().token) {
        openId = getQueryObject().token
      } else {
        openId = 'qwer'
      }
    }
    sessionStorage.setItem('openId', openId)
    Cookies.set('openId', openId)
    this.getGoodsList()
    this.initWxConfig()
 
  },
  methods: {
    // 初始化微信分享
    initWxConfig: function() {
      
      getWxParams(this).then(function(data) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名
            jsApiList: ['onMenuShareTimeline',
              'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
          });
          wx.ready(function() {
            
            var shareUrl ='http://api.parkwing.cn/shop/share?id=index' 
            var obj = {
              title: '我给你分享了绝妙的商品哦，赶紧来看看吧!', // 分享标题
              desc: '不一样的服务商城，应有尽有的贴⼼心服务!', // 分享描述
              link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: 'http://pwmall.parkwing.cn/file/shop/pic/dsafsda.png', // 分享图标
            }
            wx.onMenuShareTimeline(obj);
            wx.onMenuShareAppMessage(obj)
          });
      
      }).catch(function(){
        
      })
    },

    // 商品点击
    goodsListClickHandle: function(item) {
      console.log(item)
      this.$router.push({ path: '/goodsDetail', query: { id: item.id } })
    },
    // 商品列表
    getGoodsList: function() {
      this.$fetch({
        url: process.env.shop_front_api + '/front/shopProduct/listShopProductFront',
        method: 'get',
      }).then((res) => {
        this.goodsList = res.data
      }).catch((err) => {

      })
    }
  }
}
</script>

<style lang='scss' scoped>
.myswipe {
  height: auto;
  & /deep/ .mint-swipe-items-wrap>div {
    height: inherit;
  }
  & /deep/ .mint-swipe-items-wrap {
    height: 200px;
  }
  .box {
    width: 100%; // height: 200px;
    height: 200px;
    .one {
      background: url('http://pwmall.parkwing.cn/file/shop/pic/1.jpg');
      height: 200px;

      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .two {
      background: url('http://pwmall.parkwing.cn/file/shop/pic/2.jpg');
      height: 200px;

      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .three {
      background: url('http://pwmall.parkwing.cn/file/shop/pic/3.jpg');
      height: 200px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .four {
      background: url('http://pwmall.parkwing.cn/file/shop/pic/4.jpg');
      height: 200px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}

.guessLike {
  font-size: 14px; // padding-bottom: 50px;
  max-height: calc(100% + 1px);
  &>div {
    padding: 10px 15px;
  }
  ul {
    // display: flex; // padding: 0 5px;
    // flex-wrap: wrap;
    background-color: #eee;
    li {
      display: inline-block;
      width: 50%; // margin-bottom: 10px;
      border-bottom: 10px solid #eee; // padding: 0 5px;
      .img {
        background-size: 100% 100%;
        background-position: center center;
        width: 100%;
        height: 185px; // border: 1px solid #eee;
        background-color: #E2E2E2;
      }
      .title {
        padding: 8px 10px 4px 10px;
        font-size: 13px;
        background-color: #fff;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .description {
        padding: 4px 10px 4px 10px;
        font-size: 11px;
        color: #888;
        background-color: #fff;
      }
      .price {
        background-color: #fff;
        padding-left: 10px;
        padding-top: 5px;
        color: #888;
        font-size: 11px;
        .nowPrice {
          // color: #F43530;
          color: #111;
          font-size: 14px;
          letter-spacing: 1px;
          font-weight: 550;
          margin-right: 5px;
        }
      }
    }
    li:nth-child(2n+1) {
      border-right: 5px solid #eee;
      border-left: 5px solid #eee; // padding-right: 5px;
      // float: left;
    }
    li:nth-child(2n) {
      border-right: 5px solid #eee;
      border-left: 5px solid #eee; // padding-left: 5px;
      // float: right;
    }
  }
}
</style>
