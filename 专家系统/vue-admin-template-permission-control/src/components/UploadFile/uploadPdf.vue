<template>
  <div class="upload">
    <input type="file" class="inputFlie" @change="upFlie" ref="file" accept=".pdf" id="container">
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
    }
  },
  methods: {
    // 上传文件
    async upFlie(evnt) {
      try {
        let file = this.$refs.file.files[0];
        this.imgName = file.name;
        let fileUrl = await this.upFlies(file);
        this.$emit("upFlie", fileUrl.data.fileUrl);
        this.file = file;
        this.$refs.file.value = null;
      } catch (error) {
        this.$refs.file.value = null;
        console.log(error);
      }
    },
    async upFlies(val) {
      let url =  "/aliyun/oss/file";
      let form = new FormData();
      form.append("file", val);
      return new Promise((resolve, reject) => {
        upload(url, form).then(res => {
          this.$message("上传成功");
          resolve(res);
        });
      });
    }
  }
};
</script>
