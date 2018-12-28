<template>
    <div class="container" id="myOrderPage">
        <!-- <x-header :title="title1">
                                            <div slot="overwrite-left" @click="back">
                                                <x-icon type="ios-arrow-left" class="goBack"></x-icon>
                                            </div>
                                        </x-header> -->
        <tab>
            <tab-item selected @on-item-click="onItemClick">全部</tab-item>
            <tab-item @on-item-click="onItemClick('1')">待付款</tab-item>
            <tab-item @on-item-click="onItemClick('2')">服务中</tab-item>
            <tab-item @on-item-click="onItemClick('4')">已完成</tab-item>
        </tab>
        <p id="noGoods" v-if="currentShowList.length == 0">暂无订单 o(╥﹏╥)o </p>
        <div class="shopBox" v-for="(item,index) in currentShowList" :key="Math.random()">
            <div class="shopName">
                {{item.goodsInfo[0].merchantName}}
                <span>{{status[parseInt(item.orderStatus) - 1]}}</span>
            </div>
            <ul class="shopList" @click="shopListHandle(item)">
                <li v-for="(order,index) in item.goodsInfo" :key="Math.random()">
                    <img :src="order.prefix+order.path" class="img">
                    <div class="shopDetail">
                        <div class="name">{{order.productName}}</div>
                        <!-- <div class="description">精品：1kg</div> -->
                        <div class="price">¥{{order.currentPrice}}</div>
                    </div>
                    <em>x{{order.goodsNum}}</em>
                </li>
            </ul>
            <div class="shopCount">
                共{{item.goodsInfo.length}}件商品 小计:
                <span>
                    <em style="font-size:12px">￥</em>
                    <b>{{item.goodsInfo | getOrderSumMoney}}</b>
                </span>
            </div>
            <div class="utils">
                <!-- <div class="cancelOrderBtn" v-if="parseInt(item.orderStatus) < 3" @click="cancelBtnHandle(item,'5')">取消订单</div> -->
                <div class="orderPayBtn" v-if="item.orderStatus=='1'" @click="payOrderHandle(item)">付款</div>
                <div class="cancelOrderBtn" v-if="item.orderStatus=='2'" @click="cancelBtnHandle(item,'4')">确认完成</div>
            </div>
        </div>
        <confirm class="confirm" title="提示" @on-confirm="confirmHandle" @on-cancel="confirmUnion.visible = false" v-model="confirmUnion.visible">{{confirmUnion.content}}
        </confirm>
    </div>
</template>

<script>
import { XHeader } from 'vux'
import { Confirm, XInput, Tab, PopupPicker, XNumber, Badge, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
import { Countdown } from 'vux'
import { Toast } from 'mint-ui';
export default {
    name: '',
    components: { Confirm, XInput, PopupPicker, XNumber, Badge, Countdown, XHeader, Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem },
    data() {
        return {
            title1: '我的订单',
            orderList: [],
            status: ['待付款', '服务中', '', '已完成', '已关闭'],
            currentActiveOrder: {},
            currentShowList: [],
            confirmUnion: {
                visible: false,
                content: '',
            },
            // 要改变订单的状态
            currentActiveOrderStatus: ''
        }
    },
    mounted() {
 
        this.getOrderList()

        var appId = localStorage.getItem('appId')
        var timestamp = localStorage.getItem('timestamp')
        var nonceStr = localStorage.getItem('nonceStr')
        var signature = localStorage.getItem('signature')
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名
            jsApiList: [
                'hideMenuItems'
            ],
        });
        wx.ready(function() {
            WeixinJSBridge.call('hideOptionMenu');
        });
    },
    filters: {
        getOrderSumMoney: function(arr) {
            var r = 0;
            arr.forEach(function(element) {
                r += (element.currentPrice * element.goodsNum)
            });
            return r
        }
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
        // 获取订单列表
        getOrderList: function() {
            this.$fetch({
                url: process.env.shop_front_api + '/order/getMyOrder',
                method: 'get',
                params: {
                    openId: sessionStorage.getItem('openId')
                }
            }).then((res) => {
                this.orderList = res.data.orderInfo
                this.currentShowList = res.data.orderInfo
            }).catch((err) => {

            })
        },
        back: function() {
            this.$router.push('/')
        },
        // 取消/完成 订单
        cancelBtnHandle: function(item, status) {
            this.currentActiveOrder = item
            this.confirmUnion.visible = true
            if (status == '4') {
                this.confirmUnion.content = '确认该订单已完成？'
            } else {
                this.confirmUnion.content = '确定取消该订单？'
            }

            this.currentActiveOrderStatus = status
        },
        //  取消订单
        confirmHandle: function() {
            this.$fetch({
                url: process.env.shop_front_api + '/order/updateOrderInfo',
                method: 'put',
                data: {
                    orderId: this.currentActiveOrder.orderId,
                    orderStatus: this.currentActiveOrderStatus
                }
            }).then((res) => {
                if (res.status == 200) {
                    Toast('操作成功！')
                    this.getOrderList()
                }
            }).catch((err) => {

            })
        },
        // 去付款
        payOrderHandle: function(item) {
            // this.$router.push('/payResult')
            this.goWxPay(item.orderId)
        },
        // 微信支付
        goWxPay: function(orderId) {

            this.$fetch({
                url: 'https://wechatpaycallbackuat.parkwing.cn/payment/weixinPay/unifiedorder',
                method: 'post',
                data: {
                    body: '商城支付',
                    total_fee: 1,
                    openid: sessionStorage.getItem('openId'),
                    out_trade_no: orderId
                }
            }).then((res) => {
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
        // tabs切换
        onItemClick: function(n) {
            if (!n) {
                this.currentShowList = this.orderList
                return
            }
            this.currentShowList = this.orderList.filter((item) => {
                if (item.orderStatus == n) {
                    return true
                }
                return false
            })
        },
        // 订单详情
        shopListHandle: function(item) {
            // console.log(item)
            this.$router.push({ path: '/orderDetail', query: item })
        },

    }
}
</script>

<style lang='scss' scoped>
#noGoods {
    text-align: center;
    color: #888;
    line-height: 300px;
}

#myOrderPage {
    & /deep/ .weui-dialog__btn_primary {
        color: #108EE9 !important;
    }
    & /deep/ .vux-header-title {
        span {
            color: #333333;
            font-weight: 500;
        }
    }
    & /deep/ .vux-header {
        border-bottom: 1px solid #eee;
    }
    & /deep/ .vux-tab-selected {
        color: #108EE9 !important;
    }
    & /deep/ .vux-tab-ink-bar {
        background-color: #108EE9;
    }
    .shopBox {
        background-color: #fff;
        border-bottom: 10px solid #eee;
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
        .utils {
            // height: 50px;
            display: flex;
            justify-content: flex-end;
            padding: 10px 0;
            .cancelOrderBtn,
            .certainCollectBtn {
                border: 1px solid lightgray;
                border-radius: 5px;
                height: 30px;
                text-align: center;
                font-size: 13px;
                margin-right: 15px;
                line-height: 30px;
                padding: 0 10px;
            }
            .orderPayBtn {
                margin-right: 15px;
                border: 1px solid #eee;
                border-radius: 5px;
                background-color: #F43530;
                height: 30px;
                text-align: center;
                font-size: 13px;
                color: #fff;
                line-height: 30px;
                padding: 0 10px;
            }
        }
        .shopName {
            display: flex;
            justify-content: space-between;
            height: 40px;
            font-size: 15px;
            line-height: 40px;
            padding: 0 15px;
            border-bottom: 1px solid #eee;
            span {
                color: #108EE9;
            }
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
                }
            }
        }
    }
}

.vux-header {
    background-color: #fff;
}

.goBack {
    fill: #108EE9;
    position: relative;
    left: -10px;
}





.container {
    background-color: #fff;
}
</style>
