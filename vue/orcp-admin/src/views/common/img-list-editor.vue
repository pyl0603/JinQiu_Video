<template>
  <div class="img-pop">
    <div class="pop-cont">
      <div class="up-btn">
        <div class="el-col-12">历史记录(多图)</div>
        <div class="el-col-12 tar">
          <el-button type="dqx-btn" class="ml20">直接上传</el-button>
          <uploadI ref="uploadI" @upImg="upImg" :isEdit="isEdit"></uploadI>
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
import Item from "@/views/fileMana/item.vue";
import uploadI from "@/components/UploadImg/upload-many";
export default {
  data() {
    return {
      upDate: false
    };
  },
  props:{
    isEdit:{
      type:Boolean,
      default:false
    }
  },
  components: {
    Item,
    uploadI
  },
  methods: {
    // 图片地址传递
    chooseItem(val){
    let item = [];
    item.push({fullImgPath:val})
    this.$emit('chooseItem',item)
    },
    //   图片上传成功回调(暂未完成)
    upImg(val) {
      this.upDate = !this.upDate;
      this.$emit('chooseItem',val)
    },
    // 关闭弹窗
    cancel(){
      this.$emit("cancel")
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
  .pop-btn{
    margin-top: -40px;
    margin-right: 10px;
    padding-bottom: 10px;
  }
  .up-btn .el-button {
    position: absolute;
    right: 20px;
  }
  /deep/.inputFlie {
    position: absolute;
    margin-left: -120px;
    height: 40px;
    width: 100px;
    opacity: 0;
    z-index: 10;
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
  /deep/.el-pagination__total{
    position: absolute;
    left: 18%;
  }
}
</style>

