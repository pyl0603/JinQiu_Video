<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import { getCategory,setCategory } from '@/utils/auth'
import Cookies from 'js-cookie'
export default {
  name: 'App',
  data(){
    return{
      type:0,
      routeType:0,
      isRouterAlive:true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.change-type{
  position: fixed;
  bottom: 50vh;
  right: 30px;
  z-index: 9;
  span{
    display: block;
    margin-top: 10px;
    text-align: center;
    line-height: 30px;
    width: 50px;
    height: 30px;
    border: 1px solid #e4e4e4;
    border-radius: 8px;
    font-size: 12px;
    background: #fff;
  }
  .on{
    background: #18CE94;
    color: #fff;
    border: 1px solid #18CE94;
  }
}
</style>
