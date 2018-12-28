<template>
  <div id="goodsDetail">
    <!-- <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true"> -->
    <!-- 商品&nbsp;&nbsp; -->
    <!-- <span @click="tabbarHandle">&nbsp;详情</span> -->
    <!-- <a href="#productDesc">详情</a> -->
    <!-- <div slot="overwrite-left" @click="back">
                                  <x-icon type="ios-arrow-left" class="goBack"></x-icon>
                                </div> -->
    <!-- </x-header> -->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in goodsImageList" :key="Math.random()">
          <div class="img" :style="{backgroundImage:'url('+(item.prefix + item.path)+')'}"></div>
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination" v-for="(item,index) in goodsImageList" :key="Math.random()"></div>
    </div>
    <div class="priceBox">
      <div class="left">
        <div class="newPrice">￥
          <span>{{goods.currentPrice}}</span>
        </div>
        <div class="oldPrice">
          <del>￥{{goods.originalPrice}}</del>
          <div>
            <x-icon type="ios-alarm" size="16" class="alarm"></x-icon>
            <span>优惠价</span>
          </div>
        </div>
      </div>
      <div class="right">
        <!-- <p>距结束还剩:</p>
                                    <div>12:33:33</div> -->
        <p>服务园区:{{goods.servicePark}}</p>
        <div>商品类别:{{goods.typeName}}</div>
      </div>
    </div>
    <div class="nameBox">
      {{goods.productName}}
    </div>
    <div class="brandBox">
      <div>
        <x-icon type="ios-checkmark-outline" class="checkmark" size="15"></x-icon>优质商家</div>
      <div>
        <x-icon type="ios-checkmark-outline" class="checkmark" size="15"></x-icon>极速退款</div>
    </div>
    <div class="chooseParams" @click="aa">
      规格数量
      <x-icon type="ios-arrow-forward" class="forward" size="20"></x-icon>
    </div>
    <div class="productDesc" id="productDesc" v-html="goods.productDesc">
    </div>
    <!--  -->
    <popup v-model="show">
      <div class="popup0">
        <div style="min-height:400px">
          <x-icon type="ios-close-empty" class="close" @click="show = false" size="40"></x-icon>
          <div>
            <img :src="goods.prefix+goods.path" alt="" class="img">
            <div class="detail">
              <div class="price">¥
                <span>{{goods.currentPrice}}</span>
              </div>
              <!-- <div class="description">已选择：B套餐 红色</div> -->
            </div>
          </div>
          <section class="type">
            <div class="title">数量</div>
            <div class="util">
              <span @click="amountHandle(-1)">－</span>
              <p>{{amount}}</p>
              <span @click="amountHandle(1)">＋</span>
            </div>
          </section>
        </div>
      </div>
    </popup>
    <!--底部按钮  -->
    <div class="footer" v-if="footerVisible">
      <div class="cartBox" @click="goToCart">
        <x-icon type="ios-cart" ref="cartIcon" class="cart animated" size="30"></x-icon>
      </div>
      <div class="buyNow" @click="buyNowHandle">立即购买</div>
      <div class="addCar" @click="addCartHandle">加入购物车</div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import Cookies from 'js-cookie'
import { XHeader } from 'vux'
import { Popup, Tab, XNumber, Badge, TabItem, Sticky, Divider, XButton, } from 'vux'
import Swiper from 'swiper'
import getWxParams from '../../utils/wxShare'
import { getQueryObject } from '../../utils/index'
export default {
  name: '',
  components: { Toast, Popup, XNumber, Badge, XHeader, Tab, TabItem, Sticky, Divider, XButton, },
  data() {
    return {
      show: false,
      // 商品属性
      goods: {
        id: '',
        originalPrice: '',
        productCode: '',
        productDesc: '',
        productName: '',
        repertory: '',
        sales: '',
        currentPrice: '',
        prefix: '',
        path: '',
        num: 1,
      },
      amount: 1,
      goodsImageList: [],
      footerVisible: true
    }
  },
  mounted() {
    // 如果是打开别人分享的链接，覆盖当前数据

    if (getQueryObject().token) {
      var openId = getQueryObject().token
      sessionStorage.setItem('openId', openId)
      Cookies.set('openId', openId)
    }
    
    // fakeId存在，表示是后台暂时添加的商品要预览，隐藏footer和分享功能
    if (!this.$route.query.id || this.$route.query.id == '') {
      this.footerVisible = false
      this.getGoodsDetailById(this.$route.query.fakeId, '/shopTranscriptProduct/')
      
    } else {
      this.getGoodsDetailById(this.$route.query.id)
    }
  },
  methods: {
    aa: function() {
      this.show = true
    },
    // 初始化微信分享
    initWxConfig: function(args) {
      var self = this

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
          if (!self.$route.query.id || self.$route.query.id == '') {
            WeixinJSBridge.call('hideOptionMenu');
          }

          // var shareUrl = window.location.href
          var shareUrl = 'http://yyxx.parkwing.cn/shop/share?id=' + args.id
          // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
          var obj = {
            title: args.title, // 分享标题
            desc: args.intro, // 分享描述
            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: args.path, // 分享图标
          }
          wx.onMenuShareTimeline(obj);
          wx.onMenuShareAppMessage(obj)
        });
      })
    },
    tabbarHandle: function() {
      window.scroll(0, 500)
    },
    back: function() {
      this.$router.go(-1)
    },
    buyNowHandle: function() {
      this.goods.num = this.amount
      if (this.goods.num > this.goods.repertory) {
        Toast('购买失败，库存不足!');
        return
      }
      // 将商品存储storage，带到下单页
      var data = {
        goodList: [this.goods],
        openId: sessionStorage.getItem('openId'),
        orderAmt: this.goods.currentPrice * this.goods.num
      }
      sessionStorage.setItem('clickedGoodsByGoodsDetail', JSON.stringify(data))
      this.$router.push({path:'/settlement',query:{ sourceType:1 }})
    },
    // 加/减数量
    amountHandle: function(n) {
      if (this.amount == 1 && n < 0) return
      this.amount += n
    },
    // 获取轮播图
    getGoodsImageList: function() {
      this.$fetch({
        url: process.env.shop_front_api + '/shopProductPicture/listShopProductPicture',
        method: 'get',
        params: {
          productCode: this.goods.productCode
        }
      }).then((res) => {
        this.goods.prefix = res.data[0].prefix
        this.goods.path = res.data[0].path
        this.goodsImageList = res.data
        // 初始化微信分享
        this.initWxConfig({
          title: this.goods.productName,
          intro: this.goods.productIntro || '',
          path: this.goods.prefix + this.goods.path,
          id: this.goods.id
        })

        this.$nextTick(function() {
          new Swiper('.swiper-container', {
            autoplay: {
              disableOnInteraction: false,
            },
            pagination: {
              el: '.swiper-pagination',   //分页器
            },
          })
        })
      }).catch((err) => {

      })
    },
    // 根据ID获取商品信息
    getGoodsDetailById: function(id, url) {

      var aUrl = '/shopProduct/'
      if (url) {
        aUrl = url
      }
      this.$fetch({
        url: process.env.shop_front_api + aUrl + id,
        method: 'get',
      }).then((res) => {
         
        if (res.status == 200) {
          for (var k in res.data) {
            this.goods[k] = res.data[k]
          }
          this.getGoodsImageList()
        }
      }).catch((err) => {
      
      })
    },
    // 切换动画cartIcon
    toggleCartIcon: function() {
      console.log(this.$refs.cartIcon)
      this.$refs.cartIcon.className = 'cart animated flip'
      setTimeout(function() {
        this.$refs.cartIcon.className = 'cart animated'
      }.bind(this), 1000);
    },
    // 加入购物车
    addCartHandle: function() {
      this.goods.num = this.amount
      if (this.goods.num > this.goods.repertory) {
        Toast('加入购物车失败，库存不足!');
        return
      }
      this.$fetch({
        url: process.env.shop_front_api + '/shopCar',
        method: 'post',
        data: {
          // id: this.goods.id,
          merchantId: this.goods.merchantId,
          merchantName: this.goods.merchantName,
          num: this.amount,
          remark: this.goods.id,
          openId: sessionStorage.getItem('openId'),
          productCode: this.goods.productCode,
          productName: this.goods.productName,
          typeId: this.goods.typeId,
          typeName: this.goods.typeName,
        }
      }).then((res) => {
        if (res.status == 200) {
          if (res.message == 'success') {
            Toast('添加成功!');
            this.toggleCartIcon()
          } else {
            Toast(res.message);
          }
        } else {
          this.$vux.toast.text('添加失败！', 'middle')
        }

      }).catch((err) => {

      })

    },
    goToCart: function() {
      this.$router.push('/cart')
    }
  }
}
</script>

<style lang='scss' scoped>
#productDesc {
  padding: 15px;
  line-height: 25px;
  background-color: #fff; // height: calc(100% + 1px);
}

.swiper-container {
  width: 100%;
  height: 340px;
}

.photo-box {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  width: 100%;
  height: 340px;
}

.img {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  width: 100%;
  height: 340px;
}

.vux-header {
  background-color: #fff;
}

.goBack {
  fill: #108EE9;
  position: relative;
  left: -10px;
}

.alarm {
  fill: #328FDE;
  background-color: #fff;
}

.cart {
  fill: #108EE9;
}

.checkmark {
  fill: rgba(50, 143, 222, 1);
}

@keyframes opacityChange {
  from {
    opacity: 0;
  }
  to {
    opacity: .8;
  }
}

@keyframes bottom2Top {
  from {
    height: 0;
  }
  to {
    height: 300px;
  }
}

#goodsDetail {
  padding-bottom: 55px;
  & /deep/ .swiper-wrapper img {
    width: 100%;
  }
  & /deep/ .vux-header-title {
    color: #108EE9;
    font-size: 16px;
    a {
      // font-style: normal; 
      text-decoration: none;
      color: #108EE9;
      margin-left: 15px;
    }
  }
  .popup0 {
    position: relative;
    .type {
      .title {
        margin-top: 30px;
      }
      .util {
        display: flex;
        margin-top: 15px;
        span {
          width: 28px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          border: 1px solid #eee;
          color: #888;
        }
        p {
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          text-align: center;
          height: 28px;
          line-height: 28px;
          width: 41px;
          color: #6D6D6D;
          font-size: 14px;
        }
      }
    }
    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      fill: #888;
    }
    &>div {
      padding: 15px;
      background-color: #fff;
      &>div {
        display: flex;
        .img {
          height: 70px;
          width: 70px;
          background-color: #eee;
          margin-right: 15px;
        }
        .detail {
          padding-top: 25px;
          .price {
            font-size: 12px;
            color: #F43530;
            span {
              font-size: 16px;
            }
          }
          .description {
            margin-top: 10px;
            font-size: 14px;
          }
        }
      }
    }
  }
  & /deep/ .vux-header-more:after {
    color: #108EE9 !important;
  }
  .tab {
    width: 100px;
    margin: 0 auto;
  }
  .swipe {
    height: 300px;
    background-color: #eee;
  }
  .priceBox {
    display: flex;
    .left {
      padding: 10px;
      background-color: #328FDE;
      color: #fff;
      width: 230px;
      display: flex;
      .newPrice {
        width: 60%;
        span {
          font-size: 30px;
          font-weight: 500;
        }
      }
      .oldPrice {
        margin-left: 15px;
        svg {
          position: relative; // left: -10px;
        }
        div {
          display: flex;
          align-items: center;
          justify-content: center;
          outline: 1px solid #fff;
          span {
            font-size: 10px;
            line-height: 18px;
          }
        }
      }
    }
    .right {
      flex: 1;
      background-color: rgba(50, 143, 222, .6);
      padding-left: 8px;
      p {
        text-align: center;
        font-weight: 500;
        font-size: 12px;
        margin: 8px 0;
        color: #fff;
      }
      div {
        color: #fff;
        text-align: center;
        font-size: 12px;
      }
    }
  }
  .nameBox {
    height: 71px;
    padding: 18px;
    line-height: 130%;
    box-sizing: border-box;
    letter-spacing: 1px;
    background-color: #fff !important;
  }
  .brandBox {
    height: 34px;
    color: #888888;
    background-color: rgb(250, 250, 250);
    padding: 8px 18px;
    font-size: 13px;
    display: flex;
    letter-spacing: 1px;
    &>div {
      .checkmark {
        margin-right: 5px;
      }
      display: flex;
      align-items: center;
    }
    &>div:first-child~* {
      margin-left: 10px;
    }
  }
  .chooseParams {
    border-top: 10px solid #eee;
    border-bottom: 10px solid #eee;
    font-size: 16px;
    padding: 12px 18px;
    letter-spacing: 1px;
    background-color: #fff;
    .forward {
      fill: #C7C7CC;
      float: right;
    }
  }
  .chooseParamsPopup {
    z-index: 444;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(111, 111, 111, .8);
    animation: opacityChange .2s linear;
    .content {
      animation: bottom2Top .2s linear;
      padding: 15px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 300px;
      background-color: #fff;
      .utils {
        margin-top: 30px;
      }
      .close-empty {
        position: absolute;
        right: 15px;
        top: 15px;
        fill: #888888;
      }
      .productBox {
        display: flex;
        position: relative;
        .img {
          width: 70px;
          height: 70px;
          background-color: #eee;
          margin-right: 15px;
        }
        .price {
          margin-top: 32px;
          color: #F43530;
          font-size: 10px;
          span {
            font-size: 14px;
            font-weight: bold;
          }
        }
        .number {
          font-size: 14px;
          margin-top: 8px;
        }
      }
    }
  }
  .footer {
    overflow: hidden;
    border-top: 1px solid #eee;
    height: 55px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 9999999;
    background-color: #fff;
    &>div {
      width: 50%;
    }
    .buyNow {
      box-sizing: border-box;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      font-size: 18px;
      text-align: center;
      line-height: 55px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 5px;
    }
    .addCar {
      background-color: #328FDE;
      text-align: center;
      line-height: 55px;
      color: #fff;
      font-size: 18px;
    }
    .cartBox {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
