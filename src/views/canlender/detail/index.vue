<template>
    <div class='detail'>
        <x-header :title="title">
            <div slot="overwrite-left" @click="back">
                <x-icon type="ios-arrow-left" class="goBack"></x-icon>
            </div>
            <div v-if="!isClient" slot="right" @click="addMeetingVisible = true">
                新增
            </div>
        </x-header>
        <p class="noOrder" v-if="meetingOrderList.length == 0">
            暂无预定信息o(╥﹏╥)o
        </p>
        <div class="meetingList">
            <div v-if="isClient">
                <div class="meetingItem" v-for="item in meetingOrderList" :key="Math.random()">
                    <p>
                        <span>园区：</span>{{item.ownedPark}}</p>
                    <p>
                        <span>时间：</span>{{date}}：{{item.orderTime.split(',')[0]}}—{{item.orderTime.split(',')[1]}}</p>
                    <p>
                        <span>会议室名称：</span>{{item.listName}}</p>
                    <p>
                        <span>客服人员：</span>{{item.creator}}</p>
                </div>
            </div>
            <ul v-if="!isClient">
                <li v-for="(item,index) in meetingOrderList" :key="Math.random()">
                    <mt-cell-swipe title="" :right="[
                                          {
                                            content: '删除',
                                            style: { background: 'red', color: '#fff' },
                                             handler:()=>deleteOrderHandle(item) 
                                          }
                                        ]">
                        <p>园区：{{item.ownedPark}}</p>
                        <p>时间：{{date}}：{{item.orderTime.split(',')[0]}}—{{item.orderTime.split(',')[1]}}</p>
                        <p>会议室名称：{{item.listName}}</p>
                        <p>客服人员：{{item.creator}}</p>
                    </mt-cell-swipe>
                </li>
            </ul>
        </div>
        <!-- 新增会议室  -->
        <div id="recieveAddressPopur" v-transfer-dom>
            <popup v-model="addMeetingVisible" height="100%" class="recieveAddressPopur">
                <h1>
                    <span @click="addMeetingVisible = false">取消</span> 新增会议室订单
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </h1>
                <group>
                    <datetime format="YYYY-MM-DD HH:mm" v-model="startTime" :title="dateTimeTitle1"></datetime>
                    <datetime format="YYYY-MM-DD HH:mm" v-model="endTime" :title="dateTimeTitle2"></datetime>
                    <x-input title="会议室名称:" placeholder="必填" v-model="meetingName"></x-input>
                </group>
                <box gap="10px 10px">
                    <x-button plain type="primary" @click.native="addMeetingOrder">确定</x-button>
                </box>
            </popup>
        </div>
    </div>
</template>

<script>
import { Box, XButton, Datetime, Selector, Group, PopupPicker, TransferDom, Popup, XSwitch, XInput, Tab, XNumber, Badge, TabItem, Sticky, Divider, Swiper, SwiperItem } from 'vux'

import { XHeader } from 'vux'
export default {
    name: '',
    components: { XButton, XHeader, Datetime, Popup, XInput, Box, Selector, Group, TransferDom },
    directives: {
        TransferDom
    },
    data() {
        return {
            meetingOrderList: [],
            title: '',
            isClient: false,
            addMeetingVisible: false,
            // 新增会议室参数：
            dateTimeTitle1: '开始时间：',
            dateTimeTitle2: '结束时间：',
            endTime: '',
            startTime: '',
            meetingName: '',
            date:''
        }
    },
    mounted() {
        this.date = this.$route.query.date
        this.title = this.date + '会议室预定'
        this.isClient = this.$route.query.isClient
        this.getCurrentDateOrderList(this.date)
    },
    methods: {
        back: function() {
            this.$router.go(-1)
        },
        
        // 删除handle
        deleteOrderHandle: function(item) {
            this.removeMeetingOrder(item)
        },
        // 新增会议室预定信息
        addMeetingOrder: function() {
            var startTime = this.startTime.split(' ')[1]
            var endTime = this.endTime.split(' ')[1]
            console.log(this.startTime,this.endTime)
            if(this.startTime.trim().length < 1 ||  this.endTime.trim().length < 1){
                this.$vux.toast.text('开始时间和结束时间不能为空!', 'middle')
                return 
            }
            if(this.meetingName.trim().length < 1){
                this.$vux.toast.text('会议室名称不能为空!', 'middle')
                return 
            }
            this.$fetch({
                url: process.env.shop_front_api + '/mettingOrder',
                method: 'post',
                data: {
                    creator: '',
                    orderDate: this.$route.query.date + ' 00:00:00',
                    orderTime: startTime + ',' + endTime,
                    listName: this.meetingName,
                    ownedPark: this.$route.query.parkName   
                }
            }).then((res) => {
                this.addMeetingVisible = false
                this.$vux.toast.text('添加成功!', 'middle')
                this.getCurrentDateOrderList()
            }).catch((err) => {

            })
        },
        // 删除会议室预定信息
        removeMeetingOrder: function(data) {
            console.log(data)
            // this.$vux.loading.show({
            //     text: '正在加载...'
            // })
            this.$fetch({
                url: process.env.shop_front_api + '/mettingOrder/' + data.id,
                method: 'DELETE',
            }).then((res) => {
                // this.$vux.loading.hide()
                this.$vux.toast.text('删除成功!', 'middle')
                this.getCurrentDateOrderList()
            }).catch((err) => {

            })
        },
        // 获取选中日期的订单信息
        getCurrentDateOrderList: function() {
            var date = this.$route.query.date
            this.$vux.loading.show({
                text: '正在加载...'
            })
            this.$fetch({
                url: process.env.shop_front_api + '/mettingOrder/listmettingOrder',
                method: 'post',
                data: {
                    // listName: "测试",
                    // ownedPark: "虹桥园（北区）",
                    orderDate: date,
                    page: 1,
                    limit: 200,
                    ownedPark:this.$route.query.parkName  
                }
            }).then((res) => {
                this.$vux.loading.hide()
                this.meetingOrderList = res.data.list

            }).catch((err) => {

            })
        }
    }
}
</script>

<style lang='scss' scoped>
.recieveAddressPopur {
    background-color: #fff;
    & /deep/ .weui-cells{
        margin-top: 0;
    }
    & /deep/ .mint-cell {
        background: none;
    }
    & /deep/ .mint-cell-title {
        display: none;
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
    & /deep/ .weui-btn {
        color: #108EE9;
        border-color: #108EE9;
    }
    & /deep/ a {
        text-decoration: none;
    }
    & /deep/ .weui-cell__ft {
        text-align: left;
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
}

.detail {
    & /deep/ .mint-cell-swipe-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
    }
    & /deep/ .mint-cell-title {
        display: none;
    }
    & /deep/ .mint-cell-value {
        display: block !important;
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
    & /deep/ .goBack {
        fill: #108EE9;
        position: relative;
        left: -10px;
        top: -2px;
    }
    & /deep/ .vux-header {
        background-color: #fff;
        border-bottom: 1px solid #eee;
        .vux-header-title {
            color: #111;
            font-size: 16px;
        }
        .vux-header-right {
            color: #108EE9;
        }
    }
    .noOrder {
        height: 200px;
        line-height: 200px;
        text-align: center;
        color: #999;
    }

    .meetingList {
        // padding: 10px;
        .meetingItem {
            padding: 10px;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            p {
                margin-top: 5px;
                color: #328FDE;
                font-size: 14px;
                span {
                    font-size: 16px;
                    color: #111;
                }
            }
        }
    }
}
</style>
