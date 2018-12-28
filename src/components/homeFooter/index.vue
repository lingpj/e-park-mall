<template>
    <div class='container'>
        <mt-tabbar v-model="selected">
            <mt-tab-item id="首页">
                <img slot="icon" v-if="selected != '首页'" src="../../assets/home.png"> 首页
                <img slot="icon" v-if="selected == '首页'" src="../../assets/home.png">
            </mt-tab-item>
            <mt-tab-item id="商品">
                <img slot="icon" v-if="selected != '商品'" src="../../assets/shop.png"> 商品
                <img slot="icon" v-if="selected == '商品'" src="../../assets/shop.png">
            </mt-tab-item>
            <mt-tab-item id="购物车">
                <img slot="icon" v-if="selected != '购物车'" src="../../assets/cart.png"> 购物车
                <img slot="icon" v-if="selected == '购物车'" src="../../assets/cart.png">
            </mt-tab-item>
            <mt-tab-item id="我的">
                <img slot="icon" v-if="selected != '我的'" src="../../assets/user.png"> 我的
                <img slot="icon" v-if="selected == '我的'" src="../../assets/user.png">
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import store from '../../store'
import { Tabbar, TabbarItem } from 'vux'
export default {
    name: '',
    components: {},
    data() {
        return {
            selected: store.getters.getTabbarTitle,
            default: '../../assets/logo.png',
            titleArr: [
                { title: '首页', path: '/' },
                { title: '商品', path: '/market' },
                { title: '购物车', path: '/cart' },
                { title: '我的', path: '/mine' },
            ]
        }
    },
    mounted() {

    },
    watch: {
        selected: function() {
            var item = this.titleArr.filter(item => this.selected == item.title)[0]
            store.commit('changeTabbarTitle', item.title)
            this.$router.push(item.path)
        }
    },
    methods: {
     
    }
}
</script>

<style lang='scss' scoped>
.container {
    height: 55px;
    position: fixed;
    bottom:0;
    left: 0;
    width:100%;
    z-index:99;
}
</style>
