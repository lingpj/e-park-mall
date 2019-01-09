<template>
  <div>
    <homeHeader></homeHeader>
    <!-- <h1>全部商品</h1> -->
    <div class="guessLike">
      <ul v-infinite-scroll="loadMoreHandle" infinite-scroll-immediate-check="false" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <li v-for="item in goodsList" @click="goodsListClickHandle(item)" :key="Math.random()+100">
          <div class="img" :style="{backgroundImage:'url('+(item.list[0].prefix + item.list[0].path)+')'}"></div>
          <div class="title">{{item.productName}}</div>
          <div class="description">园区：{{item.servicePark}}</div>
          <div class="price">
            <span class="nowPrice">¥{{item.currentPrice}}</span>
            <del>¥{{item.originalPrice}}</del>
          </div>
        </li>
        <p class="loadingTip" v-if="loading"> 正在加载 ...
          <spinner type="ripple" size="30px"></spinner>
        </p>
        <divider class="divider" v-if="dividerVisible">我是有底线的</divider>
      </ul>
    </div>
    <homeFooter></homeFooter>
  </div>
</template>

<script>
import { Spinner, Divider } from 'vux'
import homeHeader from '../../components/homeHeader'
import homeFooter from '../../components/homeFooter'
import {getWxParams} from '../../utils/wxShare'
export default {
  name: '',
  components: {
    homeHeader,
    homeFooter,
    Spinner,
    Divider,
  },
  data() {
    return {
      goodsList: [],
      loadMore: '',
      loading: false,
      pageParams: {
        limit: 6,
        page: 1
      },
      dividerVisible: false,

    }
  },

  mounted() {
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
          var shareUrl =process.env.shop_front_api+'/share?id=id'
          // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
          var obj = {
            title: '赶紧来看看我给你分享的宝贝们吧！', // 分享标题
            desc: '不一样的服务商城，应有尽有的贴⼼心服务!', // 分享描述
            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://pwmall.parkwing.cn/file/shop/pic/dsafsda.png', // 分享图标
          }
          wx.onMenuShareTimeline(obj);
          wx.onMenuShareAppMessage(obj)
        });
      })
    },
    // 获取商品列表
    getGoodsList: function() {

      if (this.dividerVisible) {
        return
      } else {
        this.loading = true;
      }
      this.$fetch({
        url: process.env.shop_front_api + '/front/shopProduct/listShopProductFrontAll',
        method: 'get',
        params: this.pageParams
      }).then((res) => {
        this.goodsList = this.goodsList.concat(res.data.lists)
        this.loading = false
        if (res.data.count == this.goodsList.length) {
          this.dividerVisible = true
        }
      }).catch((err) => {
        this.loading = false;
      })
    },
    // 商品详情
    goodsListClickHandle: function(item) {
      console.log(item)
      this.$router.push({ path: '/goodsDetail', query: { id: item.id } })
    },
    // 载入更多
    loadMoreHandle() {
      this.pageParams.page += 1
      this.getGoodsList()
    }
  }
}
</script>

<style lang='scss' scoped>
h1 {
  text-align: center;
  color: #26a2ff;
  height: 47px;
  line-height: 47px;
}

.guessLike {
  font-size: 14px; // padding-bottom: 50px;
  max-height: calc(100% + 1px);
  padding-bottom: 55px;
  .loadingTip {
    text-align: center;
    color: #888;
  }
  .divider {
    margin-top: 15px;
  }
  &>div {
    padding: 10px 15px;
  }
  ul {
    // display: flex; // padding: 0 5px;
    // flex-wrap: wrap;
    padding-bottom: 35px;
    padding-top: 5px;
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
