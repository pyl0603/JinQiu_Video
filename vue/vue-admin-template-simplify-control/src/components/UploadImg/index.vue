<template>
  <div class="upload">
    <input
      type="file"
      class="inputFlie"
      @change="upImg"
      ref="file"
      accept="image/png, image/gif, image/jpg, image/jpeg, image/bmp;"
      id="container"
    />
    <div>{{imgUrl}}</div>
  </div>
</template>
<script>
import { upload } from "@/api/oss";
export default {
  data() {
    return {
      imgName: "", //图片名字
      file: "", //图片文件
      ossData: "" //oss信息
    };
  },
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 上传图片
    async upImg(evnt) {
      try {
        let file = this.$refs.file.files[0];
        this.imgName = file.name;
        let fileUrl = await this.upImgs(file);
        console.log(fileUrl.data);
        this.$emit("upImg", fileUrl.fullImgPath);
        this.file = file;
        this.$refs.file.value = null;
      } catch (error) {
        this.$refs.file.value = null;
        console.log(error);
      }
    },
    async upImgs(val) {
      let url = this.isEdit
        ? "/upload/picture"
        : "/aliyun/oss/picture-article";
      let form = new FormData();
      form.append("file", val);
      return new Promise((resolve, reject) => {
        upload(url, form).then(res => {
          this.$message("上传成功");
          resolve(res.data);
        });
      });
    }
  },
  async created() {}
};
</script>
