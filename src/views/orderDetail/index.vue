<template>
    <div class="container">
        <x-header :title="title1">
            <div slot="overwrite-left" @click="back">
                <x-icon type="ios-arrow-left" class="goBack"></x-icon>
            </div>
        </x-header>

        <div class="cell">
            {{status[parseInt(dataObj.orderStatus) -1]}}
             <span class="c-blue"><a style="color:#108EE9;text-decoration:none" :href="'tel:'+dataObj.goodsInfo[0].phone">联系商家</a></span> 
        </div>
        <div class="collectAddress">
            <div>
                <p>{{dataObj.userName}}&emsp;&emsp;&emsp;&emsp;{{dataObj.userPhone}}</p>
                <address>{{dataObj.parkName}} --- {{dataObj.userAddr}} </address>
            </div>
        </div>
        <!-- <div class="deliveryMode">
                <div>
                    配送方式
                    <span>上门自提</span>
                </div>
                <div>
                    自提时间
                    <span>2018年11月2日15:43:14</span>
                </div>
                <div>
                    自提地点
                    <span>上海市青浦区宝龙广场1号楼101</span>
                </div>
            </div> -->
        <div class="shopBox">
            <div class="shopName">
                {{dataObj.goodsInfo[0].merchantName}}
                <!-- <span>联系商家</span>  -->
            </div>
            <ul class="shopList">
                <li v-for="(item,index) in dataObj.goodsInfo" :key="Math.random()">
                    <img :src="item.prefix + item.path" class="img" alt="">
                    <div class="shopDetail">
                        <div class="name">{{item.productName}}</div>
                        <!-- <div class="description">精品：1kg</div> -->
                        <div class="price">¥{{item.currentPrice}}</div>
                    </div>
                    <em>x{{item.goodsNum}}</em>
                </li>
            </ul>
            <div class="shopCount">
                共{{dataObj.goodsInfo.length}}件商品 小计:
                <span>
                    <em style="font-size:12px">￥</em>
                     <b>{{dataObj.goodsInfo | getOrderSumMoney}}</b> 
                </span>
            </div>
        </div>
        <div class="cell">
            买家留言
            <span>{{dataObj.userNotes}}</span>
        </div>
        <div class="orderTime">
            <div>
                订单编号
                <span>{{dataObj.orderId}}</span>
            </div>
            <div>
                订单时间
                <span>{{dataObj.createTime}}</span>
            </div>
            <div v-if="dataObj.sendTime">
                发货时间
                <span>{{dataObj.sendTime}}</span>
            </div>
            <div v-if="dataObj.dealTime">
                成交时间
                <span>{{dataObj.dealTime}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { XHeader } from 'vux'
import { XInput, Tab, PopupPicker, XNumber, Badge, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
import { Countdown } from 'vux'

export default {
    name: '',
    components: { XInput, PopupPicker, XNumber, Badge, Countdown, XHeader, Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem },
    data() {
        return {
            title1: '订单详情',
            dataObj: {},
            status: ['待付款', '待发货', '已发货', '已完成', '已关闭'],
            goodsList: [],
        }
    },
    mounted() {
        for (var k in this.$route.query) {
            this.dataObj[k] = this.$route.query[k]
        }
        this.dataObj = JSON.parse(JSON.stringify(this.dataObj))
        // this.getOrderDetail(this.$route.query.orderId)
        console.log(this.dataObj)
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
    // 
    methods: {
        // 获取订单详情
        getOrderDetail: function(id) {
            this.$fetch({
                url: process.env.shop_front_api+'/order/getGoodsByOrderId',
                method: 'get',
                params: {
                    orderId: id
                }
            }).then((res) => {
                this.goodsList = res.goodsList
            }).catch((err) => {

            })
        },
        back: function() {
            this.$router.go(-1)
        },

    }
}
</script>

<style lang='scss' scoped>
.b-10 {
    border-bottom: 10px solid #eee !important;
    height: 54px !important;
}

.cell {
    background-color: #fff;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    font-size: 15px;
    border-bottom: 1px solid #eee;
}

.c-blue {
    color: #108EE9;
}

.container {
    padding-bottom: 30px;
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
        color: #108EE9;
    }
    & /deep/ .vux-tab-ink-bar {
        background-color: #108EE9;
    }
    .deliveryMode,
    .orderTime {
        border-bottom: 10px solid #eee;
        background-color: #fff;
        color: #333333;
        &>div {
            display: flex;
            justify-content: space-between;
            padding: 8px 15px;
        }
    }
    .collectAddress {
        padding: 15px;
        background-color: #FFFAEB;
        min-height: 80px;
        font-size: 15px;
        color: #333333;
        border-top: 10px solid #eee;
        border-bottom: 10px solid #eee;
        &>div {
            // display: flex;
            // flex-direction: column;
            // justify-content: space-between;
            // align-items: center;
            // min-height: 40px;
        }
        address {
            color: #888;
            font-size: 13px;
            margin-top: 15px;
        }
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
            height: 50px;
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
                // color: #108EE9;
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
    background-color: #eee;
}
</style>
