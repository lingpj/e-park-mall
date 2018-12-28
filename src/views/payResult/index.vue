<template>
    <div class="container">
        <x-header :title="title1">
            <div slot="overwrite-left" @click="back">
                <x-icon type="ios-arrow-left" class="goBack"></x-icon>
            </div>
        </x-header>
        <div class="content">
            <p class="result">付款成功</p>
            <p class="price">0.01元</p>
            <!-- <p class="msg">预计10月10日送达地点</p> -->
            <div class="utils">
                <span @click="lookOrder">查看订单</span>
                <span @click="goHome">继续逛逛</span>
            </div>
        </div>
        <!-- <div class="ad">广告位</div>
        <div class="guessLike">
            <div>邻居也在买</div>
            <ul>
                <li>
                    <div class="img"></div>
                    <div class="title">商品名称商品名称商品名称</div>
                    <div class="description">简介简介简介简介</div>
                </li>
                <li>
                    <div class="img"></div>
                    <div class="title">商品名称商品名称商品名称</div>
                    <div class="description">简介简介简介简介</div>
                </li>
            </ul>
        </div> -->
    </div>
</template>

<script>
import { XHeader } from 'vux'
import { Confirm, XInput, Tab, PopupPicker, XNumber, Badge, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
import { Countdown } from 'vux'

export default {
    name: '',
    components: { Confirm, XInput, PopupPicker, XNumber, Badge, Countdown, XHeader, Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem },
    data() {
        return {
            title1: '付款结果',
        }
    },

    methods: {
        back: function() {
            this.$router.push('/myOrder')
        },
        lookOrder:function(){
            this.$router.push('/myOrder')
        },
        goHome:function(){
            this.$router.push('/')
        }
    }
}
</script>

<style lang='scss' scoped>
.container {
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
    .guessLike{
        &>div{
            padding:10px 15px;
        }
        ul{
            display: flex;
            li{
                width: 50%;
                .img{
                    height: 185px;
                    width: 185px;
                    background-color: #eee;
                }
                .title{
                    padding: 8px 10px 4px 10px;
                    font-size: 13px;
                }
                .description{
                    padding: 4px 10px 4px 10px;
                    font-size: 11px;
                    color:#888;
                }
            }
            li:nth-child(2n+1){
                border-right: 5px solid #fff;
            }
            li:nth-child(2n){
                border-left: 5px solid #fff;
            }
        }
    }
    .ad{
        color:#888;
        font-size: 12px;
        height: 88px;
        line-height: 88px;
        text-align: center;
        border-bottom: 10px solid #eee;
    }
    .content {
        height: 233px;
        padding-top: 40px;
        text-align: center;
        border-bottom:1px solid #eee;
        .result {
            color: #108EE9;
            font-size: 17px;
        }
        .price {
            font-weight: bold;
            font-size: 24px;
            margin-top: 20px;
        }
        .msg {
            color: #888;
            font-size: 15px;
            margin-top: 20px;
        }
        .utils {
            display: flex;
            justify-content: space-between;
            width: 200px;
            margin: 30px auto 0 auto;
            
            span {
                width: 80px;
                height: 30px;
                border: 1px solid lightgray;
                line-height: 30px;
                text-align: center;
                border-radius: 5px;
                font-size: 13px;
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
</style>
