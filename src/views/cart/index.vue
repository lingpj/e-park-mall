<template>
    <div id="cartPage">
        <x-header class="xHeader">
            <!-- <span style="color:#111;">购物车</span> -->
            <!-- <div slot="overwrite-left" @click="back">
                        <x-icon type="ios-arrow-left" class="goBack"></x-icon>
                    </div> -->
            <div slot="right">
                <span class="editBtn" @click="editHandle">{{isEditing ?'完成':'编辑'}}</span>
            </div>
        </x-header>
        <p id="noGoods" v-if="goodsList.length == 0">暂无商品 o(╥﹏╥)o </p>
        <div class="productBox" v-if="goodsList.length >0">
            <div>
                <p class="title">
                    <check-icon :value.sync="checkAll">{{goodsList[0] ? goodsList[0].merchant_name : '' }}</check-icon>
                </p>
                <ul>
                    <li v-for="(item,index) in goodsList" @click="checkIconHandle(item,$event)" :key="Math.random()">
                        <i class="weui-icon weui_icon_success weui-icon-success" v-if="item.isChecked"></i>
                        <i class="weui-icon weui_icon_circle weui-icon-circle" v-if="!item.isChecked"></i>
                        <div class="detailBox">
                            <!-- <div class="img"></div>     -->
                            <!-- <img :src="item.prefix+item.path" class="img" alt=""> -->
                            <div class="img" :style="{backgroundImage:'url('+(item.prefix+item.path)+')'}"></div>
                            <div class="detailText">
                                <p class="name">{{item.product_name}}</p>
                                <p class="originalPrice">¥{{item.original_price}}</p>
                                <p class="nowPrice">¥{{item.current_price}}</p>
                            </div>
                        </div>
                        <div class="countBox">
                            <span @click="amountHandle(item,index,-1)">－</span>
                            <p>{{item.num}}</p>
                            <span @click="amountHandle(item,index,1)">＋</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <footer>
            <check-icon class="checkAllBtn" :value.sync="checkAll">全选</check-icon>
            <div class="number">已选{{ getCheckedIds().length }}件。</div>
            <div class="sum">合计:
                <span>¥{{sumMoney}}</span>
            </div>
            <div class="redBtn" @click="goPay">{{isEditing ? '删除' :'去结算'}}</div>
        </footer>

    </div>
</template>

<script>

import { CheckIcon, XHeader, Popup, Countdown, Tab, XNumber, Badge, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
import { Toast } from 'mint-ui';
export default {
    name: '',
    components: { Toast, CheckIcon, Popup, XNumber, Badge, Countdown, XHeader, Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem },
    data() {
        return {
            checkAll: false,
            goodsList: [],
            isEditing: false,
            sumMoney: 0
        }
    },

    mounted() {
        this.getCartDataList()

    },
    beforeDestroy() {
        console.log('销毁》。。。。。。')
    },
    watch: {
        checkAll: function() {
            var self = this
            this.goodsList.forEach(function(goods) {
                goods.isChecked = self.checkAll
            });
            this.sumMoney = this.getGoodsMoney()
        }
    },
    methods: {
        back: function() {
            this.$router.go(-1)
        },
        editHandle: function() {
            this.isEditing = !this.isEditing
        },
        // 加/减数量
        amountHandle: function(item, index, n) {
            if (item.num == 1 && n < 0) return
            console.log(item)
            if ((item.num == item.repertory) && n > 0) {
                Toast('商品库存不足！')
                return
            }
            item.num += n
            this.goodsList = JSON.parse(JSON.stringify(this.goodsList))
            this.sumMoney = this.getGoodsMoney()
            // 更新商品
            this.editGoodsByIds(item)
        },
        // 去结算
        goPay: function() {
            if (this.getCheckedIds().length == 0) {
                Toast('请选择商品！')
                return
            }
            if (this.isEditing == true) {
                this.removeGoodsByIds()
            } else {
                var obj = this.checkGoodsListNumber()
                console.log(obj)
                if (!obj.result) {
                    Toast('商品:' + obj.goods.product_name + '，库存仅剩：' + obj.goods.repertory + '，当前数量已超出！')
                    return
                }
                // 将商品存储storage，带到下单页
                var data = {
                    orderAmt: this.sumMoney,
                    goodList: this.goodsList.filter((goods) => {
                        if (goods.isChecked == true) {
                            return true
                        } else {
                            return false
                        }
                    }),
                    openId: sessionStorage.getItem('openId'),
                }
                sessionStorage.setItem('clickedGoodsByGoodsDetail', JSON.stringify(data))
                this.$router.push({path:'/settlement',query:{ sourceType:0 }})
            }
        },
        // 检查购物车数量
        checkGoodsListNumber: function() {
            var result = {}
            this.goodsList.every((goods) => {
                if (goods.num > goods.repertory) {
                    result = {
                        goods: goods,
                        result: false
                    }
                } else {
                    result = {
                        goods: goods,
                        result: true
                    }
                }
            })
            return result
        },
        // 根据ID删除购物车商品
        removeGoodsByIds: function() {
            this.$fetch({
                url: process.env.shop_front_api + '/shopCar/deleteShopCar',
                method: 'delete',
                data: {
                    shopIds: this.getCheckedIds(),
                    openId: sessionStorage.getItem('openId')
                }
            }).then((res) => {
                Toast('商品删除成功！');
                this.getCartDataList()
            }).catch((err) => {

            })
        },
        // 编辑购物车
        editGoodsByIds: function(item) {
            // alert('item:' + JSON.stringify(item))
            this.$fetch({
                url: process.env.shop_front_api + '/shopCar/' + item.id,
                method: 'put',
                data: {
                    id: item.id,
                    openId: sessionStorage.getItem('openId'),
                    num: item.num,
                    merchantName: item.merchant_name,
                    merchantId: item.merchant_id,
                    productCode: item.product_code,
                    productName: item.product_name,
                    typeId: item.type_id,
                    typeName: item.type_name
                }
            }).then((res) => {
                // alert('yes：' + JSON.stringify(res))
                Toast('商品编辑成功！');

            }).catch((err) => {
                // alert('no：' + JSON.stringify(err))
            })
        },
        // 当前checkIds
        getCheckedIds: function() {
            var ids = []
            this.goodsList.forEach((goods) => {
                if (goods.isChecked == true) {
                    ids.push(goods.id)
                }
            })
            return ids
        },
        // 总价
        getGoodsMoney: function() {
            var result = 0;
            this.goodsList.forEach((goods) => {
                if (goods.isChecked) {
                    result += parseFloat(goods.num) * parseFloat(goods.current_price)
                }
            })
            return result
        },
        // ckeck事件
        checkIconHandle: function(item, $event) {
            var dom = $event.target
            if (dom.tagName == 'I') {
                item.isChecked = !item.isChecked
                this.goodsList = JSON.parse(JSON.stringify(this.goodsList))
                this.sumMoney = this.getGoodsMoney()
            } else {

            }
        },
        // 获取商品列表
        getCartDataList: function() {
            this.$fetch({
                url: process.env.shop_front_api + '/shopCar/listShopCar',
                method: 'get',
                params: {
                    openId: sessionStorage.getItem('openId')
                }
            }).then((res) => {
                if (res.code == 500) {
                    this.goodsList = []
                } else {
                    this.goodsList = res.data || []
                    this.goodsList.forEach(function(goods) {
                        goods.isChecked = false
                    });
                    this.sumMoney = this.getGoodsMoney()
                }
            }).catch((err) => {
                this.goodsList = []
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.show {}

.img {
    background-size: cover;
    background-position: center center;
    width: 70px;
    height: 70px; // border: 1px solid #eee;
    background-color: #eee;
}

#noGoods {
    text-align: center;
    color: #888;
    line-height: 300px;
}

.vux-header {
    background-color: #fff;
}

.goBack {
    fill: #108EE9;
    position: relative;
    left: -10px;
}

#cartPage {
    & /deep/ .weui_icon_success {
        width: 25px !important;
    }
    & /deep/ .weui-icon-circle {
        font-size: 18px !important;
    }
    & /deep/ .weui-icon-success:before,
    .vux-check-icon>.weui-icon-success-circle:before {
        color: #108EE9 !important;
        font-size: 18px;
        position: relative;
        top: -3px;
    }
    & /deep/ .xHeader {
        border-bottom: 1px solid #eee;
    }
    .productBox {
        .title {
            border-bottom: 1px solid #eee;
            padding: 10px 0 10px 10px;
            font-size: 14px;
        }
        ul {
            border-bottom: 10px solid #eee;
            li {
                position: relative;
                display: flex;
                align-items: center;
                padding: 15px 0 15px 10px;
                border-bottom: 1px solid #eee;
                .detailBox {
                    display: flex;
                    margin-left: 5px;

                    .detailText {
                        margin-left: 10px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding: 3px 0;
                        flex: 1;
                        .name {
                            font-size: 15px;
                            text-overflow: -o-ellipsis-lastline;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            line-height: 16px;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                        }
                        .originalPrice {
                            color: #888;
                            font-size: 12px;
                            text-decoration: line-through;
                        }
                        .nowPrice {
                            color: #F43530;
                            font-size: 14px;
                            font-weight: 550;
                        }
                    }
                }
                .countBox {
                    position: absolute;
                    right: 15px;
                    bottom: 20px;
                    display: flex;
                    margin-top: 15px;
                    span {
                        width: 28px;
                        height: 28px;
                        line-height: 26px;
                        text-align: center;
                        border: 1px solid lightgray;
                        color: #777;
                        font-size: 22px;
                        position: relative;
                    }
                    p {
                        border-top: 1px solid lightgray;
                        border-bottom: 1px solid lightgray;
                        text-align: center;
                        height: 28px;
                        line-height: 28px;
                        width: 41px;
                        color: #111;
                        font-size: 14px;
                    }
                }
            }
        }
    }
    .editBtn {
        color: #108EE9;
        font-size: 16px;
    }
    footer {
        padding-left: 6px;
        background-color: #fff;
        height: 55px;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        border-top: 1px solid #eee;
        display: flex;
        align-items: center;
        .number {
            font-size: 14px;
            color: #888888;
            margin-left: 8px;
        }
        .sum {
            font-size: 14px;
            margin-left: 8px;
            span {
                color: #F43530;
                font-weight: 550;
                letter-spacing: 1px;
            }
        }
        .checkAllBtn {
            font-size: 14px;
            margin-left: 5px;
        }
        .redBtn {
            position: absolute;
            right: 0;
            top: 0;
            color: #fff;
            background-color: #F43530;
            font-size: 18px;
            height: 100%;
            text-align: center;
            line-height: 55px;
            width: 110px;
        }
    }
}
</style>
