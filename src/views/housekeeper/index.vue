<template>
  <div>
    <homeHeader></homeHeader>
     <h1 @click="handle">购物车</h1>
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
    
  },

  methods: {
    handle: function() {
      this.$router.push('/cart')
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
