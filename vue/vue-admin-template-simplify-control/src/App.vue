<template>
  <div id="app">
    <router-view />
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
      routeType:0
    }
  },
  created() {
    if(!Cookies.get('Category')){
      Cookies.set('Category',0)
    }
    this.type = Cookies.get('Category')
  },
  updated(){
    this.routeType = this.$route.fullPath.indexOf('basketball') > -1 ? 1 : 0;
    Cookies.set('Category',this.routeType)
  },
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
    background: #1268FF;
    color: #fff;
    border: 1px solid #1268FF;
  }
}
</style>
