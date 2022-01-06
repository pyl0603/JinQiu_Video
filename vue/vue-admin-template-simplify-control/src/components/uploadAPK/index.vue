<template>
  <div class="upload">
    <input type="file" class="inputFlieA" @change="upAPK" ref="file" accept=".apk">
  </div>
</template>
<script>
import { upload } from "@/api/oss";
export default {
  data() {
    return {
      videoName: "", //视频名字
      file: "" //视频名文件
    };
  },
  methods: {
    // 上传视频
    async upAPK(evnt) {
      try {
        let file = this.$refs.file.files[0];
        this.videoName = file.name;
        let fileUrl = await this.upAPKs(file);
        this.$emit("upAPK", this.file);
        this.$refs.file.value = null;
      } catch (error) {
        this.$refs.file.value = null;
        alert(error);
      }
    },
    async upAPKs(val) {
      let url =  "/aliyun/oss/apk";
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
