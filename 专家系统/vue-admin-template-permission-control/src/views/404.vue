<template>
  <div class="dqx-http404-container">
    <div>
      <img src="@/assets/404_images/img_default_error.png" alt>
    </div>
    <div>
      <span @click="goHome" class="cp">返回首页</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page404",
  computed: {
    message() {
      return "The webmaster said that you can not enter this page...";
    }
  },
  methods:{
    goHome(){
      window.location.href = '/'
    }
  }
};
</script>

<style lang="scss" scoped>
.dqx-http404-container {
  text-align: center;
}
img{
  width: 640px;
  height: 216px;
  margin-bottom: 34px;
  margin-top: calc((100vh - 370px)/2);
}
span {
  display: inline-block;
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 8px;
  background: #18CE94;
  color: #fff;
}
</style>
