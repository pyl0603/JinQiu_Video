<template>
  <div class="choose">
    <div class="for-center">
      <div class="football cp" @click="getIn('zq',0)">
          <span></span>
          <em>进入足球模块</em>
      </div>
      <div class="basketball cp" @click="getIn('lq',1)">
          <span></span>
          <em>进入篮球模块</em>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  methods:{
    getIn(val,e){
      Cookies.set('Category',e)
      localStorage.setItem('type',val);
      this.$router.push({
        path:'/count'
      })
    }
  },
  mounted(){
    localStorage.removeItem('type')
  }
}
</script>
<style lang="scss" scoped>
.choose {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  background: linear-gradient(
    90deg,
    rgba(24, 206, 195, 1),
    rgba(236, 226, 198, 1)
  );
  .for-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 1000px;
    display: flex;
    justify-content: space-between;
  }
  .basketball {
    width: 340px;
    height: 340px;
    background: rgba(255, 255, 255, .16);
    border: 1px solid rgba(173, 173, 173, 0.1);
    border-radius: 20px;
    text-align: center;
    em{
        display: block;
        text-align: center;
        margin-top: 30px;
        font-size:24px;
        color: #171717;
    }
    span{
        display: inline-block;
        width: 120px;
        height: 120px;
        background: url('~img/ic_home_basketball.png') no-repeat top center;
        background-size: 100%;
        margin-top: 85px;
         &:hover{
            animation: rotate 5s infinite linear;
        }
    }
  }
  .football {
    width: 340px;
    height: 340px;
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(173, 173, 173, 0.1);
    border-radius: 20px;
    em{
        display: block;
        text-align: center;
        margin-top: 30px;
        font-size:24px;
        color: #171717;
    }
    span{
        display: inline-block;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: #fff url('~img/ic_home_football.png') no-repeat top center;
        background-size: 100%;
        margin-top: 85px;
        &:hover{
            animation: rotate 5s infinite linear;
        }
    }
  }
}
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>