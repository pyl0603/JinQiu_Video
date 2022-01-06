<template>
  <div class="upload">
    <input
      type="file"
      class="inputFlie"
      @change="upImg"
      ref="file"
      accept="image/png, image/gif, image/jpg, image/jpeg, image/bmp;"
      id="container"
      multiple="multiple"
    />
    <div>{{imgUrl}}</div>
  </div>
</template>
<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
axios.defaults.headers.common["Authorization"] = "Bearer" + " " + getToken();
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
        let file = this.$refs.file.files;
        this.imgName = file.name;
        let fileUrl = await this.upImgs(file);
        console.log(fileUrl)
        this.$emit("upImg", fileUrl.data  );
        this.file = file;
        this.$refs.file.value = null;
      } catch (error) {
        this.$refs.file.value = null;
        console.log(error);
      }
    },
    async upImgs(val) {
      const loading = this.$loading({
        lock: true,
        text: "gaygay正在飞奔中"
      });
      // let url = 'https://api.jinqiulive.com/upload/manyPictures'
      let url = this.isEdit ? 'https://api.jinqiulive.com/upload/picture' : 'https://api.jinqiulive.com/aliyun/oss/picture-article'
      let form = new FormData();
      Object.values(val).map(res => {
        form.append("file", res);
      });
      return new Promise((resolve, reject) => {
        axios({
          url: url,
          // url: `https://api.jinqiulive.com/aliyun/oss/picture-article?type=picture`,
          method: "post",
          data: form,
          headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
          loading.close();
          this.$message("上传成功");
          resolve(res.data);
        });
      });
    }
  },
  async created() {}
};
</script>
