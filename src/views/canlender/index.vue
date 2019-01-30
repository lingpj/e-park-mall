<template>
    <div class='canlender'>
        <selector title="选择园区:" :options="this.parkList.map((item) => {return item.name})" v-model="park"></selector>
        <inline-calendar id="canlender" ref="calendar" @on-change="onChange" @on-view-change="onViewChange" class="inline-calendar-demo" :show.sync="show" v-model="value" :range="range" :show-last-month="showLastMonth" :show-next-month="showNextMonth" :highlight-weekend="highlightWeekend" :return-six-rows="return6Rows" :hide-header="hideHeader" :hide-week-list="hideWeekList" :replace-text-list="replaceTextList" :weeks-list="weeksList" :render-function="buildSlotFn" :disable-past="disablePast" :disable-future="disableFuture" :disable-weekend="disableWeekend">
            <!-- <div slot="each-day">
                                            哈哈
                                        </div> -->
        </inline-calendar>
        <!-- <button @click="btnClick">按钮</button> -->

    </div>
</template>

<script>
import { InlineCalendar, Selector } from 'vux'
import {getWxParams} from '../../utils/wxShare'
export default {
    name: '',
    components: { InlineCalendar, Selector },
    data() {
        return {
            show: true,
            value: '',
            listValue: '',
            range: false,
            showLastMonth: true,
            showNextMonth: true,
            highlightWeekend: true,
            return6Rows: true,
            hideHeader: false,
            hideWeekList: false,
            replaceTextList: { 'TODAY': '今' },
            replace: false,
            changeWeeksList: false,
            weeksList: [],
            useCustomFn: false,
            buildSlotFn: () => '',
            disablePast: false,
            disableFuture: false,
            disableWeekend: false,
            // 分页
            listQuery: {
                page: 1,
                limit: 10
            },
            // 园区列表
            parkList: [],
            park: '',
            currentYearMonth: {
                year: '',
                month: '',
            },
            // 当前有预定的日期
            hasMeetingOrderDateArr: []
        }
    },
    mounted() {
        this.getParkList()
        this.initWxConfig()
    },
    watch: {
        park: function() {
            this.getMeetingStatusByMonth(this.currentYearMonth)
        }
    },
    methods: {
        btnClick: function() {
            console.log(this.park)
        },
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
                    var shareUrl = process.env.shop_front_api+'/#/canlender/'+data.appId
                    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                    var obj = {
                        title: '会议室预定', // 分享标题
                        desc: 'E通世界会议室预定', // 分享描述
                        link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: 'http://pwmall.parkwing.cn/file/shop/pic/dsafsda.png', // 分享图标
                    }
                    wx.onMenuShareTimeline(obj);
                    wx.onMenuShareAppMessage(obj)
                });
            })
        },
        // 获取园区
        getParkList: function() {
            this.$fetch({
                url: process.env.shop_front_api + '/parkInfo/all',
                method: 'get',
            }).then((res) => {
                this.parkList = res
                this.park = res[0].name
            }).catch((err) => {

            })
        },
        onChange(val) {
            // console.log('on-change', val)
            var isClient = window.location.href.indexOf('userName') != -1 ? false : true
            this.$router.push({ path: '/canlender/detail', query: { date: val, parkName: this.park, isClient: isClient } })
        },
        onViewChange(val, count) {
            console.log('on view change', val, count)
            this.currentYearMonth.year = val.year
            this.currentYearMonth.month = val.month
            this.getMeetingStatusByMonth(val)
        },
        getMeetingStatusByMonth: function(date, page, limit) {
            if (this.park == '') return
            this.$vux.loading.show({
                text: '正在加载...'
            })
            this.hasMeetingOrderDateArr = []
            this.$fetch({
                url: process.env.shop_front_api + '/mettingOrder/listOrderDate',
                method: 'GET',
                params: {
                    // listName: "测试",
                    // ownedPark: "虹桥园（北区）",
                    // orderDate: "2018-09-01",
                    orderMonth: date.year + '-' + (date.month < 10 ? '0' + date.month : date.month),
                    page: this.listQuery.page,
                    limit: this.listQuery.limit,
                    ownedPark: this.park
                }
            }).then((res) => {
                this.$vux.loading.hide()
                var self = this
                if (res.data) {
                    this.buildSlotFn = (line, index, data) => {
                        if (res.data.indexOf(data.formatedDate) == -1) {
                            return ''
                        } else {
                            console.log('>>>   ',line, index, data)
                            var trs = document.querySelectorAll('#canlender table tbody tr')
                            var td = trs[1].children[index].children[0]
                            if (data.isToday) {
                                td.style.background = 'pink'
                                td.style.border = '1px solid pink'
                            } else {
                                td.style.background = 'lightblue'
                                td.style.border = '1px solid lightblue'
                            }

                            self.hasMeetingOrderDateArr.push({ col: line, row: index })
                            return ''
                        }
                        return ''
                    }
                } else {

                    this.buildSlotFn = (line, index, data) => {
                        console.log(line, index, data)
                        var trs = document.querySelectorAll('#canlender table tbody tr')
                        var td = trs[1].children[index].children[0]
                        td.style.background = '#fff'
                        td.style.border = 'none'

                        return ''
                    }
                }
            }).catch((err) => {

            })
        }
    }
}
</script>

<style lang='scss' scoped>
.canlender {
    & /deep/ .vux-selector {
        border-bottom: 1px solid #eee;
    }
    & /deep/ #canlender {
        table th {
            background: #eee;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
        }
        table td {
            height: 50px;
            padding: 30px 0;
            font-size: 20px;
        }
    }
}
</style>
