<template>
  <div>
    <homeHeader></homeHeader>
    <span @click="myOrderHandle">我的订单</span>
    <homeFooter></homeFooter>
  </div>
</template>

<script>
import homeHeader from '../../components/homeHeader'
import homeFooter from '../../components/homeFooter'
export default {
  name: '',
  components: {
    homeHeader,
    homeFooter
  },
  data() {
    return {
    }
  },
  mounted(){
    this.$router.push('/myOrder')
  },
  methods: {
    myOrderHandle: function() {
      this.$router.push('/myOrder')
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
