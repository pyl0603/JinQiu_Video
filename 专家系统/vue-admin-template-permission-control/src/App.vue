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
      routeType:0,
      isTime:false
    }
  },
  created() {
    if(!Cookies.get('Category')){
      Cookies.set('Category',0)
    }
    if(new Date().getTime() > 1585907610000){
      this.isTime = true
    }
    this.type = Cookies.get('Category')
    console.log(window.matchMedia("(prefers-color-scheme)"))
  },
  updated(){
    if (this.$route.fullPath.indexOf('self') > -1) {
      this.routeType = 2
    } else {
      this.routeType = this.$route.fullPath.indexOf('basketball') > -1 ? 1 : 0;
    }
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
    background: #18CE94;
    color: #fff;
    border: 1px solid #18CE94;
  }
}
</style>
