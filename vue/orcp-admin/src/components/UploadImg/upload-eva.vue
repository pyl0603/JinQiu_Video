<template>
  <div class="upload">
    <input
      type="file"
      class="inputFlie"
      @change="upImg"
      ref="file"
      accept="image/png, image/gif, image/jpg, image/jpeg, image/bmp;"
      id="container"
    >
    <div>{{imgUrl}}</div>
  </div>
</template>
<script>
import axios from "axios";
import { getToken, getId } from '@/utils/eva-auth'
axios.defaults.headers.common["Authorization"] = "Bearer" + " " + getToken();
// axios.defaults.headers.common['uid'] = getId();
import { upload, getOssToken } from "@/api/oss";
import { mapGetters } from "vuex";
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
    isEdit:{
      type:Boolean,
      default:false
    }
  },
  methods: {
    // 上传图片
    // async upImg(evnt) {
    //   try {
    //     let file = this.$refs.file.files[0];
    //     this.imgName = file.name;
    //     let fileUrl = await this.upImgs(file);
    //     console.log(fileUrl.data);
    //     this.$emit("upImg", fileUrl.data.imageUrl);
    //     this.file = file;
    //     this.$refs.file.value = null;
    //   } catch (error) {
    //     this.$refs.file.value = null;
    //     console.log(error);
    //   }
    // },
    // async upImgs(val) {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: 'gaygay正在飞奔中'
    // })
    //   let url = 'https://api.jinqiulive.com/client-assistant/helpers/upload/picture';
    //   // let url = `/dev-api/client-assistant/helpers/upload/picture`
    //   let form = new FormData();
    //   form.append("file", val);
    //   return new Promise((resolve, reject) => {
    //     axios({
    //       url:url,
    //       // url: `https://api.jinqiulive.com/client-admin/aliyun/oss/picture-article?type=picture`,
    //       method: "post",
    //       data: form,
    //       headers: { "Content-Type": "multipart/form-data" }
    //     }).then(res => {
    //       loading.close();
    //       this.$message('上传成功')
    //       resolve(res.data);
    //     });
    //   });
    // }
     // 选择上传图片
		async upImg() {
      // const isINT = this.roles.find(item => item === 'EDITOR_INTERNAL_ARTICLE' || item === 'EDITOR_INTERNAL_VIDEO')
      const loading = this.$loading({
        lock: true,
        text: "gaygay正在飞奔中"
      });
      const file = this.$refs.file.files[0];
			// 获取token
			let res = await getOssToken();
      let data = res.data
			const request = new FormData();
			let name = `${data.dir}${new Date().getTime()}_${file.name}`
			request.append("OSSAccessKeyId", data.accessKeyId); // Bucket 拥有者的Access Key Id。
			request.append("policy", data.policy); // policy规定了请求的表单域的合法性
			request.append("signature", data.signature); // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
			request.append("key", name);
			request.append("expire", data.expire);
			request.append('callback', data.callback)
			request.append("success_action_status", "200"); // 让服务端返回200,不然，默认会返回204
			request.append("file", file);
			upload(data.host, request).then(res => {
				// 上传成功之后的回调
				if (res.code === 0) {
					let url = `${data.host}\/${name}`
          loading.close();
          this.$message("上传成功");
          this.$emit("upImg", url);
				}
			})
		},
  },
  computed: {
    ...mapGetters(['roles'])
  },
  async created() {
  }
};
</script>
