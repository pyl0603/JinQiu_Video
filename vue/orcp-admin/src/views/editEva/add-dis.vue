<template>
  <div class="dis f18 c424">
    <div class="mt30">
      选择圈子：
      <el-select v-model="value" placeholder="请选择" class="mr30">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="mt30">
      帖子标题：
      <el-input placeholder="请输入帖子标题" v-model="title"></el-input>
    </div>
    <div class="mt30">
      帖子内容：
      <el-input placeholder="请输入帖子内容" type="textarea" v-model="cont"></el-input>
    </div>
    <div class="mt30">添加图片(最多上传9张图，图片比例3:2)：</div>
    <div class="mt30">
      <el-col :span="7" :push="1" v-for="(item,index) in disImg" :key="index" class="mb10 img-icon">
        <div class="upload-before" v-if="item == ''">
          <svg-icon icon-class="tupian"></svg-icon>
          <span class="f14 cada">690*460</span>
        </div>
        <div class="upload-after" v-if="item != ''">
          <img :src="item" alt />
          <svg-icon icon-class="del" class="close-btn cp" @click="delImg(index)"></svg-icon>
        </div>
        <upload ref="upload" @upImg="upImg($event,index)"></upload>
      </el-col>
    </div>
    <div class="btm-btn">
      <el-button @click="preview">预览</el-button>
      <el-button type="dqx-btn" @click="addDiss">发布</el-button>
    </div>
  </div>
</template>
<script>
import upload from "@/components/UploadImg/upload-eva";
import { getCircle, addDis } from "@/api/eva";
export default {
  data() {
    return {
      title: "",
      cont: "",
      disImg: ["", "", "", "", "", "", "", "", ""],
      options: [],
      value: "",
      firstId: ""
    };
  },
  components: {
    upload
  },
  methods: {
    // 获取圈子
    async getCircles() {
      getCircle().then(res => {
        this.options = res.data;
        this.value = this.options[0].id;
        this.firstId = this.options[0].id;
      });
    },
    async upImg(val, e) {
      console.log(val);
      this.disImg[e] = val;
      this.$set(this.disImg, e, val);
    },
    async delImg(val) {
      this.$set(this.disImg, val, "");
    },
    // 预览
    async preview() {
      this.$emit("preview", [this.title, this.cont, this.disImg]);
    },
    // 新增
    async addDiss() {
      console.log(1);
      let type = 0;
      if (this.imgInfo.length > 0) {
        type = 1;
      }
      addDis({
        title: this.title,
        content: this.cont,
        community: this.value,
        type: type,
        images: this.imgInfo
      }).then(_ => {
        this.$message("发帖成功");
        this.$emit("refresh");
        Object.assign(this.$data, this.$options.data());
        this.getCircles();
      });
    }
  },
  mounted() {
    this.getCircles();
  },
  computed: {
    imgInfo() {
      return this.disImg.filter(res => {
        return res != "";
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.close-btn {
  color: red;
  position: absolute;
  margin-top: -5.9vw;
  margin-left: 6.7vw;
  z-index: 9;
  font-size: 14px;
  width: 20px;
  height: 20px;
}
.dis {
  height: calc(100vh - 60px);
  padding: 0 20px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .el-input,
  .el-textarea {
    width: calc(100% - 120px);
  }
  /deep/.el-textarea__inner {
    height: 160px;
  }
  /deep/.inputFlie {
    width: 7.5vw;
    height: 5.5vw;
    position: absolute;
    margin-left: -0vw;
    margin-top: -5.5vw;
    opacity: 0;
    z-index: 1;
  }
  .upload-after {
    width: 7.5vw;
    height: 5.5vw;
    img {
      width: 7.5vw;
      height: 5.5vw;
    }
  }
  .upload-before {
    width: 7.5vw;
    height: 5.5vw;
    background: #f5f5f5;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    span {
      display: block;
    }
    .svg-icon {
      font-size: 39px;
      color: #adadad;
      margin-top: 1.3vw;
    }
  }
  .btm-btn {
    position: absolute;
    bottom: 20px;
    text-align: center;
    width: 25%;
  }
}
</style>

