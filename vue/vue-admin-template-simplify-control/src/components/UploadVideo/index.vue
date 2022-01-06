<template>
  <div class="upload">
    <input type="file" class="inputFlieV" @change="upVideo" ref="file" accept="video/*">
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
    async upVideo(evnt) {
      try {
        let file = this.$refs.file.files[0];
        this.videoName = file.name;
        let fileUrl = await this.upVideos(file);
        this.$emit("upVideo", this.file);
        this.$emit('finishUp',fileUrl)
        this.$refs.file.value = null;
      } catch (error) {
        this.$refs.file.value = null;
        alert(error);
      }
    },
    async upVideos(val) {
      let url = this.isEdit
        ? "/upload/video"
        : "/aliyun/oss/video";
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
