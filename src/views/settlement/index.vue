<template>
  <div id="settlementPage">
    <x-header :title="title1">
      <div slot="overwrite-left" @click="back">
        <x-icon type="ios-arrow-left" class="goBack"></x-icon>
      </div>
    </x-header>
    <!--收货地址  -->
    <div class="collectAddress" v-if="!(currentCheckAddressIndex >-1)" @click="checkAddressVisible = true">请选择收货地址
      <x-icon type="ios-arrow-forward" class="forward" size="20"></x-icon>
    </div>
    <div class="finalAddressBox" v-if="currentCheckAddressIndex >-1" @click="checkAddressVisible = true">
      <p class="name">{{finalAddressInfo.buyerName}}</p>
      <p class="tel">{{finalAddressInfo.phone}}</p>
      <p class="address">{{finalAddressInfo.parkName}} --- {{finalAddressInfo.address}}</p>
      <em>></em>
    </div>
    <!--商家  -->
    <div class="shopBox">
      <div class="shopName">
        {{merchant_name}}
      </div>
      <ul class="shopList">
        <li v-for="(item,index) in goodList" :key="Math.random()">
          <img :src="item.prefix+item.path" class="img">
          <div class="shopDetail">
            <div class="name">{{item.product_name || item.productName}}</div>
            <!-- <div class="description">精品：1kg</div> -->
            <div class="price">¥{{item.current_price || item.currentPrice}}</div>
          </div>
          <em>x{{item.num}}</em>
        </li>
      </ul>
    </div>
    <!-- <div class="deliveryMode">
                                                                                  <span>配送方式</span>
                                                                                  <popup-picker :data="list1" v-model="value1" :placeholder="placeholder"></popup-picker>
                                                                                </div> -->
    <div class="leaveMsg">
      <x-input title="买家留言" ref="userNotes" placeholder="选填"></x-input>
    </div>
    <div class="shopCount">
      共{{goodList.length}}件商品 小计:
      <span>
        <em style="font-size:12px">￥</em>
        <b>{{orderAmt | formatPrice}}</b>
      </span>
    </div>
    <!--底部按钮  -->
    <div class="footer">
      <div class="priceSum">
        <div>
          应付：
          <span>¥ {{orderAmt | formatPrice}}</span>
        </div>
      </div>
      <div class="goPay" @click="buyNowHandle">去支付</div>
    </div>
    <!--收货地址popur  -->
    <div id="recieveAddressPopur" v-transfer-dom>
      <popup v-model="checkAddressVisible" height="100%" class="recieveAddressPopur">
        <h1>
          <span @click="checkAddressVisible = false">关闭</span> 选择收货地址
          <span @click="addAddressVisible = true">新增</span>
        </h1>
        <ul>
          <li v-for="(item,index) in addressList" :key="Math.random()" :class=" {active : currentCheckAddressIndex == index}" @click="adressClickHandle(index,item)">
            <!-- <h3>{{item.buyerName}}</h3>
                      <p class="address">{{item.parkName}}</p>
                      <p class="address">{{item.address}}</p>
                      <p class="tel">{{item.phone}}</p>
                      <em>
                        <x-icon type="ios-checkmark-empty" class="cart" size="30"></x-icon>
                      </em> -->
            <mt-cell-swipe title="标题文字" :right="[
                  {
                    content: '删除',
                    style: { background: 'red', color: '#fff' },
                    handler:()=>deleteAddressHandle(item)
                  }
                ]">
              <p>{{item.buyerName}}</p>
              <p>{{item.parkName}}</p>
              <p>{{item.address}}</p>
              <p>{{item.phone}}</p>
              <em>
                <x-icon type="ios-checkmark-empty" class="cart" size="30"></x-icon>
              </em>
            </mt-cell-swipe>
          </li>
        </ul>
      </popup>
    </div>
    <!-- 新增地址  -->
    <div id="addAddressPopur" v-transfer-dom>
      <popup v-model="addAddressVisible" height="100%" class="recieveAddressPopur">
        <h1>
          <span @click="addAddressVisible = false">取消</span> 新增收货地址
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </h1>
        <group>
          <x-input title="姓名:" :required="true" placeholder="必填" v-model="name"></x-input>
          <x-input title="电话:" :required="true" placeholder="必填" v-model="tel"></x-input>
          <selector title="园区:" :options="this.parkList.map((item) => {return item.name})" v-model="park.name"></selector>
          <x-input title="地址:" :required="true" placeholder="必填" v-model="address"></x-input>
        </group>
        <box gap="10px 10px">
          <x-button plain type="primary" @click.native="addAddressHandle">确定</x-button>
        </box>
      </popup>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { Box, Selector, Group, PopupPicker, TransferDom, Popup, XSwitch, XInput, Tab, XNumber, Badge, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
import { Countdown } from 'vux'
import { CellSwipe } from 'mint-ui';
export default {
  name: '',
  components: { CellSwipe, Box, Selector, PopupPicker, Group, Popup, XSwitch, XInput, XNumber, Badge, Countdown, XHeader, Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem },
  directives: {
    TransferDom
  },
  data() {
    return {
      title1: '确认信息',
      // placeholder: '请选择',
      // value1: [],
      // list1: [['小米', 'iPhone', '华为', '情怀', '三星', '其他', '不告诉你']],
      checkAddressVisible: false,
      addAddressVisible: false,
      currentCheckAddressIndex: -1,
      addressIsCheck: false,
      goodList: [],
      orderAmt: '',
      merchant_name: '',
      // 最终选择的地址信息
      finalAddressInfo: {
        parkId: '',
        parkName: '',
        phone: '',
        address: '',
        buyerName: ''
      },
      // 新增地址
      name: '',
      tel: '',
      address: '',
      parkList: [],
      park: '',
      addressList: [],

    }
  },
  mounted() {
    
    console.log(JSON.parse(sessionStorage.getItem('clickedGoodsByGoodsDetail')))
    // clickedGoodsByGoodsDetail
    // 从storage中取出当前的商品
    var data = JSON.parse(sessionStorage.getItem('clickedGoodsByGoodsDetail'))
    this.goodList = data.goodList
    this.orderAmt = data.orderAmt
    this.merchant_name = data.goodList[0].merchantName
    this.getAddressList()
    this.getParkList()
  },

  methods: {
    onBridgeReady: function(params) {

      var self = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": params.appId,     //公众号名称，由商户传入     
          "timeStamp": params.timeStamp,         //时间戳，自1970年以来的秒数     
          "nonceStr": params.nonceStr, //随机串     
          "package": params.package,
          "signType": params.signType,         //微信签名方式：     
          "paySign": params.paySign //微信签名 
        },
        function(res) {
         

          if (res.err_msg == "get_brand_wcpay_request:ok") {
            self.$router.push('/payResult')
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
        });
    },
    back: function() {
      this.$router.go(-1)
    },
    addAddressHandle: function() {
      this.addAddress()
    },
    buyNowHandle: function() {
      this.addOrder()
    },
    // 删除收货地址
    deleteAddressHandle: function(item) {

      this.$fetch({
        url: process.env.shop_front_api + '/shopBuyer/' + item.id,
        method: 'delete',
        data: {
          id: item.id
        }
      }).then((res) => {
        if (res.status == 200) {
          this.$vux.toast.text('删除成功！', 'middle')
          this.getAddressList()
          this.currentCheckAddressIndex = -1
        }
      }).catch((err) => {

      })
    },
    // 获取园区
    getParkList: function() {
      this.$fetch({
        url: process.env.shop_front_api + '/parkInfo/all',
        method: 'get',
      }).then((res) => {
        this.parkList = res
        this.park = this.parkList[0]
      }).catch((err) => {

      })
    },
    // 新增地址
    addAddress: function() {
      console.log(this.name.trim)
      if (this.address.trim() == '' || this.tel.trim() == '' || this.name.trim() == '') {
        this.$vux.toast.text('姓名、电话、地址不能为空', 'middle')
        return
      }
      this.$fetch({
        url: process.env.shop_front_api + '/shopBuyer',
        method: 'post',
        data: {
          openId: sessionStorage.getItem('openId'),
          parkId: this.park.id,
          parkName: this.park.name,
          phone: this.tel,
          address: this.address,
          buyerName: this.name,
        }
      }).then((res) => {
        this.$vux.toast.text('添加成功！', 'middle')

        setTimeout(function() {
          this.name = ' ',
            this.tel = ' ',
            this.address = ' ',
            this.addAddressVisible = false
          this.getAddressList()
        }.bind(this), 1000);
      }).catch((err) => {

      })
    },
    // 获取地址
    getAddressList: function() {
      this.$fetch({
        url: process.env.shop_front_api + '/shopBuyer/listshopBuyer',
        method: 'get',
        params: {
          openId: sessionStorage.getItem('openId'),
        }
      }).then((res) => {
        this.addressList = res.data
      }).catch((err) => {

      })
    },
    // 下单
    addOrder: function() {
      // alert('准备调用下单接口')
      this.$fetch({
        url: process.env.shop_front_api + '/order/doAnOrder',
        method: 'post',
        data: {
          orderAmt: this.orderAmt,
          goodList: this.goodList.map((item) => {
            return {
              goodsId: item.product_code || item.productCode,
              goodsName: item.product_name || item.productName,
              goodsNum: item.num,
              goodsPrice: item.current_price || item.currentPrice
            }
          }),
          openId: sessionStorage.getItem('openId'),
          userPhone: this.finalAddressInfo.phone.trim(),
          userAddr: this.finalAddressInfo.address.trim(),
          userName: this.finalAddressInfo.buyerName.trim(),
          userNotes: this.$refs.userNotes.$refs.input.value.trim(),
          deliveryWay: '',
          deliveryTime: '',
          deliveryAddr: '',
          type: this.$route.query.sourceType,
          parkId: this.finalAddressInfo.parkId,
          parkName: this.finalAddressInfo.parkName,
        }
      }).then((res) => {
        // alert(res)
        // alert(JSON.stringify(res))
        if (res.code == 200) {
          this.$vux.toast.text(res.message, 'middle')
          setTimeout(function() {
            this.goWxPay(res.orderId,this.orderAmt*100)
          }.bind(this), 1000);
        } else {
          this.$vux.toast.text(res.msg, 'middle')
        }
      }).catch((err) => {

      })
    },
    // 下单
    goWxPay: function(orderId,money) {

      this.$fetch({
        url: 'https://wechatpaycallback.parkwing.cn/payment/weixinPay/unifiedorder',
        method: 'post',
        data: {
          body: '商城支付',
          total_fee: money,
          openid: sessionStorage.getItem('openId'),
          out_trade_no: orderId
        }
      }).then((res) => {
        // alert('下单：'+JSON.stringify(res))
        this.onBridgeReady({
          "appId": res.appId,     //公众号名称，由商户传入     
          "timeStamp": res.timeStamp,         //时间戳，自1970年以来的秒数     
          "nonceStr": res.nonceStr, //随机串     
          "package": res.package,
          "signType": res.signType,         //微信签名方式：     
          "paySign": res.paySign //微信签名 
        })
      }).catch((err) => {

      })
    },
    // 勾选地址
    adressClickHandle: function(index, item) {
      this.currentCheckAddressIndex = index
      for (var k in this.finalAddressInfo) {
        this.finalAddressInfo[k] = item[k]
      }
      this.checkAddressVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
#addAddressPopur /deep/ .weui-btn {
  color: #108EE9;
  border-color: #108EE9;
}

#addAddressPopur /deep/ .weui-cells {
  margin-top: 0;
}

#addAddressPopur /deep/ .weui-cells {
  font-size: 14px !important;
}

#addAddressPopur /deep/ .weui-label {
  width: 50px;
}

.forward {
  fill: #C7C7CC;
  float: right;
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
  fill: #F43530;
  background-color: #fff;
}

.cart {
  fill: #108EE9;
}

.checkmark {
  fill: #F43530;
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

.recieveAddressPopur {
  // overflow: hidden;
  & /deep/ .mint-cell {
    background: none;
  }
  & /deep/ .mint-cell-title {
    display: none;
  }
  & /deep/ .mint-cell-value {
    display: block;
    padding-bottom: 10px;
    p {
      margin-top: 10px;
      font-size: 14px;
    }
    p:first-child {
      font-size: 16px;
      color: #111;
    }
  }
  & /deep/ .mint-cell-wrapper {
    background: none;
  }
  & /deep/ .mint-cell-swipe-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
  }
  & /deep/ .mint-cell-swipe-buttongroup {
    // width: 150px;
  }
  .active {
    h3 {
      color: #108EE9;
    }
    em {
      display: block;
      position: absolute;
      right: 10px;
      top: calc( (100% -30px) /3);
    }
  }
  h1 {
    text-align: center;
    padding: 0 15px;
    background-color: #fff;
    height: 46px;
    line-height: 46px;
    border-bottom: 1px solid #eee;
    span:first-child {
      float: left;
      color: #108EE9;
      font-size: 15px;
    }
    span:last-child {
      float: right;
      color: #108EE9;
      font-size: 15px;
    }
  }
  ul {
    overflow: hidden;
    background-color: #fff;
    li {
      margin: 0 0; // padding:5px;
      border-bottom: 1px solid #eee;
      position: relative;
      h3 {
        font-size: 17px;
      }
      .address {
        margin: 10px 0;
        font-size: 15px;
        color: #888888;
      }
      .tel {
        color: #888888;
        font-size: 15px;
      }
      em {
        display: none;
      }
    }
  }
}

#settlementPage {

  .finalAddressBox {
    position: relative;
    background-color: #fff;
    border-top: 10px solid #eee;
    border-bottom: 10px solid #eee;
    padding: 15px 15px;
    .tel {
      margin: 10px 0;
    }
    .address {
      font-size: 13px;
      color: #888;
    }
    em {
      position: absolute;
      right: 15px;
      top: calc( 100% /2 - 4px);
      color: #999;
    }
  }
  & /deep/ .vux-header {
    border-bottom: 1px solid #eee;
  }


  .shopCount {
    padding: 0 15px;
    height: 45px;
    background-color: #fff;
    line-height: 45px;
    text-align: right;
    font-size: 15px;
    b {
      font-weight: normal;
      font-size: 15px;
      color: #F43530;
    }
  }
  .deliveryMode {

    font-size: 15px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 0 15px;
    height: 45px;
    line-height: 45px;
    & /deep/ .weui-cell {
      padding: 0;
    }
    & /deep/ .vux-cell-box:before {
      display: none;
    }
  }
  .leaveMsg {
    // border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    font-size: 15px;
    padding: 0 15px;
    & /deep/ .vux-x-input {
      padding: 0;
    }
    height: 45px;
    background-color: #fff;
    line-height: 45px;
  }
  .shopBox {
    background-color: #fff;

    .shopName {
      height: 40px;
      font-size: 15px;
      line-height: 40px;
      padding-left: 15px;
      border-bottom: 1px solid #eee;
    }
    .shopList {
      li {
        position: relative;
        padding: 15px;
        display: flex;
        font-size: 15px;
        border-bottom: 1px solid #eee;
        em {
          position: absolute;
          right: 15px;
          top: 15px;
          color: #888;
          font-size: 12px;
        }
        .img {
          width: 70px;
          height: 70px;
          background-color: #eee;
          margin-right: 15px;
        }
        .description {
          font-size: 12px;
          color: #888888;
        }
        .shopDetail {
          padding: 2px 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            width: 90%;
            line-height: 16px;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
  .collectAddress {
    // margin: 10px 0;
    border-top: 10px solid #eee;
    border-bottom: 10px solid #eee;
    background-color: #FFFAEB;
    height: 93px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    color: #333333;
    padding: 0 15px;
  }
  & /deep/ .vux-header-title {
    span {
      color: #333333;
      font-weight: 500;
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
      background-color: #F43530;
      color: #fff;
      width: 230px;
      display: flex;
      .newPrice {
        span {
          font-size: 30px;
          font-weight: 500;
        }
      }
      .oldPrice {
        margin-left: 15px;
        svg {
          position: relative;
          left: -10px;
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
      background-color: #FFE5E4;
      padding-left: 8px;
      p {
        text-align: center;
        font-weight: 500;
        font-size: 12px;
        margin: 8px 0;
        color: #F43530;
      }
      div {
        color: #F43530;
        text-align: center;
        font-size: 14px;
      }
    }
  }
  .nameBox {
    height: 71px;
    padding: 18px;
    line-height: 130%;
    box-sizing: border-box;
    letter-spacing: 1px;
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
    z-index: 300;
    background-color: #fff;
    .priceSum {
      &>div {
        font-size: 15px;
        span {
          color: #F43530; // letter-spacing: 1px;
          font-weight: bold;
        }
      }
      box-sizing: border-box;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      font-size: 18px;
      line-height: 55px;
      padding: 0 15px;
      width: 70%;
    }
    .goPay {
      width: 30%;
      background-color: #F43530;
      text-align: center;
      line-height: 55px;
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>
