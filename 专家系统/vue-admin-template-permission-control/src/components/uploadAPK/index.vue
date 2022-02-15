<template>
  <div class="upload">
    <input type="file" class="inputFlieA" @click="upRely" @change="upAPK" ref="file" accept=".apk">
  </div>
</template>
<script>
import { upload, getOssToken } from "@/api/oss";
export default {
  data() {
    return {
      videoName: "", //视频名字
      file: "" //视频名文件
    };
  },
  methods: {
    // 上传视频
    // async upAPK(evnt) {
    //   try {
    //     let file = this.$refs.file.files[0];
    //     this.videoName = file.name;
    //     let fileUrl = await this.upAPKs(file);
    //     this.$emit("upAPK", this.file);
    //     this.$refs.file.value = null;
    //   } catch (error) {
    //     this.$refs.file.value = null;
    //     alert(error);
    //   }
    // },
    // async upAPKs(val) {
    //   let url =  "/aliyun/oss/apk";
    //   let form = new FormData();
    //   form.append("file", val);
    //   return new Promise((resolve, reject) => {
    //     upload(url, form).then(res => {
    //       this.$message("上传成功");
    //       resolve(res);
    //     });
    //   });
    // }
    // 重复上传
		upRely() {
			event.target.value = null
		},
    async upAPK() {
        const file = this.$refs.file.files[0];
			// 获取token
			let res = await getOssToken({type: 'apk'});
      let data = res.data
			const request = new FormData();
			let name = `${data.dir}`
			request.append("OSSAccessKeyId", data.accessKeyId); // Bucket 拥有者的Access Key Id。
			request.append("policy", data.policy); // policy规定了请求的表单域的合法性
			request.append("signature", data.signature); // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
			request.append("key", name);
			request.append("expire", data.expire);
			request.append('callback', data.callback)
			request.append("success_action_status", "200"); // 让服务端返回200,不然，默认会返回204
			request.append("file", file);
      console.log('host1', name)
			upload(data.host, request).then(res => {
				// 上传成功之后的回调
				if (res.code === 0) {
					let url = `${data.host}\/${name}`
          this.$message("上传成功");
          this.$emit("upAPK", this.file);
				}
			})
    }
  }
};
</script>
