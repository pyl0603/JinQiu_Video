<template>
  <div class="img-pop">
    <div class="pop-cont">
      <div class="up-btn">
        <div class="el-col-6">历史记录</div>
        <div class="other-url el-col-12">
          <el-input placeholder="请输入第三方链接" v-model="url"></el-input>
          <el-button type="dqx-btn" @click="chooseItem(url)">确认</el-button>
        </div>
        <div class="el-col-6 tar">
          <el-button type="dqx-btn" class="ml20 up-now">直接上传</el-button>
          <uploadI ref="uploadI" @upVideo="upVideo" :isEdit="true"></uploadI>
        </div>
      </div>
      <Item ref="Item" :upDate="upDate" :isPop="true" @chooseItem="chooseItem"></Item>
      <div class="pop-btn tar">
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Item from "@/views/fileMana/item-video.vue";
import uploadI from "@/components/UploadVideo/index";
export default {
  data() {
    return {
      upDate: false,
      url:'',   //第三方链接
    };
  },
  components: {
    Item,
    uploadI
  },
  methods: {
    // 图片地址传递
    chooseItem(val) {
      this.$emit("chooseItem", val);
    },
    //   图片上传成功回调(暂未完成)
    upVideo(val) {
      this.upDate = !this.upDate
    },
    // 关闭弹窗
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>
<style lang="scss" scoped>
.img-pop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  .pop-btn {
    margin-top: -40px;
    margin-right: 10px;
    padding-bottom: 10px;
  }
  .up-btn .up-now {
    position: absolute;
    right: 20px;
  }
  /deep/.inputFlieV {
    position: absolute;
    margin-left: -120px;
    height: 40px;
    width: 100px;
    opacity: 0;
  }
  .up-btn {
    height: 40px;
    position: absolute;
    margin-top: -30px;
    width: 60%;
    padding-left: 20px;
    line-height: 40px;
  }
  .pop-cont {
    padding-top: 40px;
    background: #fff;
    width: 60%;
    margin-left: 15%;
    margin-top: 50px;
  }
  /deep/.el-collapse {
    background: #fff;
    .el-collapse-item {
      padding: 0 20px;
    }
  }
  /deep/.el-pagination {
    padding: 10px;
    width: 85%;
  }
  /deep/.el-pagination__total {
    position: absolute;
    left: 18%;
  }
  .other-url {
    display: inline-block;
  }
  .el-input {
    display: inline-block;
    width: 20vw;
  }
}
</style>

