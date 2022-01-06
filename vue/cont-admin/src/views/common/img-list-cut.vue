<template>
  <div class="img-pop">
    <div class="pop-cont">
      <div class="up-btn">
        <div class="el-col-6">历史记录</div>
        <div class="el-col-18 tar">
          <el-button type="dqx-btn" class="ml20 cut-btn" @click="dialogVisible = true">裁剪上传</el-button>
          <el-button type="dqx-btn" class="mr20">GIF上传</el-button>
          <uploadI ref="uploadI" @upImg="upImg" :isEdit="isEdit"></uploadI>
          <!-- <div class="upload-now">
            <el-button type="dqx-btn">直接上传</el-button>
          <uploadI ref="uploadI" @upImg="upImg" :isEdit="isEdit"></uploadI></div>-->
        </div>
      </div>
      <Item ref="Item" :upDate="upDate" :isPop="true" @chooseItem="chooseItem"></Item>
      <div class="pop-btn tar">
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
    <el-dialog
      title="图片裁剪上传"
      :modal="false"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
    >
      <div class="wrapper">
        <div class="model" v-show="model" @click="model = false">
          <div class="model-show">
            <img :src="modelSrc" alt />
          </div>
        </div>
        <div class="content">
          <div class="show-info">
            <h2>自动生成截图框 固定比例</h2>
            <div class="test">
              <vueCropper
                ref="cropper2"
                :img="example2.img "
                :outputSize="example2.size"
                :outputType="example2.outputType"
                :info="example2.info"
                :canScale="example2.canScale"
                :autoCrop="example2.autoCrop"
                :autoCropWidth="example2.autoCropWidth"
                :autoCropHeight="example2.autoCropHeight"
                :fixed="example2.fixed"
                :fixedNumber="example2.fixedNumber"
                :enlarge="4"
              ></vueCropper>
            </div>
            <label class="btn" for="upload2">上传</label>
            <input
              type="file"
              id="upload2"
              style="position:absolute; clip:rect(0 0 0 0);"
              accept="image/png, image/jpeg, image/gif, image/jpg"
              @change="uploadImg($event,2)"
            />
            <button @click="finish2()" class="btn" v-if="fileNames != ''">裁剪并提交</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Item from "@/views/fileMana/item.vue";
import { VueCropper } from "vue-cropper";
import uploadI from "@/components/UploadImg/index";
import { upload, getOssToken } from "@/api/oss";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      upDate: false,
      dialogVisible: false,
      model: false,
      modelSrc: "",
      crap: false,
      previews: {},
      fileNames: "",
      form: {
        head: ""
      },
      example2: {
        //img的路径自行修改
        img: "$oss.url + '/' + form.head ",
        info: true,
        size: 1,
        outputType: "jpeg",
        canScale: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 300,
        autoCropHeight: 250,
        fixed: true,
        // 真实的输出宽高
        infoTrue: true,
        fixedNumber: [this.widthNum, this.heightNum]
      },
      downImg: "#"
    };
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    widthNum: {
      type: Number,
      default: 3
    },
    heightNum: {
      type: Number,
      default: 2
    }
  },
  components: {
    Item,
    VueCropper,
    uploadI
  },
  methods: {
    // 图片地址传递
    chooseItem(val) {
      this.$emit("chooseItem", val);
    },
    //   图片上传成功回调(暂未完成)
    upImg(val) {
      // console.log(val);
      this.$emit("chooseItem", val);
      this.upDate = !this.upDate;
    },
    // 关闭弹窗
    cancel() {
      this.$emit("cancel");
    },
    async finish2() {
      const isINT = this.roles.find(item => item === 'EDITOR_INTERNAL_ARTICLE'|| item === 'EDITOR_INTERNAL_VIDEO')
     	// 获取token
      let res = await getOssToken({from: isINT == null?1:0});
      this.$refs.cropper2.getCropData(data => {
        this.modelSrc = data;
        this.model = false;
        //裁剪后的图片显示
        this.example2.img = this.modelSrc;
        // 上传到oss的文件名必须带后缀！！！！
        let files = this.dataURLtoFile(data, this.fileNames);

        // let url = "/client-publish/upload/picture";
        // let form = new FormData();
        // form.append("file", files);
        // return new Promise((resolve, reject) => {
        //   upload(url, form).then(res => {
        //     this.$message("上传成功");
        //     this.dialogVisible = false;
        //     this.$emit("chooseItem", res.data.fullImgPath);
        //   });
        // });
         // 获取token
        const request = new FormData();
        let name = `${res.data.dir}${new Date().getTime()}_${files.name}`
        request.append("OSSAccessKeyId", res.data.accessKeyId); // Bucket 拥有者的Access Key Id。
        request.append("policy", res.data.policy); // policy规定了请求的表单域的合法性
        request.append("signature", res.data.signature); // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
        request.append("key", name);
        request.append("expire", res.data.expire);
        request.append('callback', res.data.callback)
        request.append("success_action_status", "200"); // 让服务端返回200,不然，默认会返回204
        request.append("file", files);
        request.append("dir", res.data.dir);
        upload(res.data.host, request).then(res => {
          // 上传成功之后的回调
          if (res.code === 0) {
            this.$message("上传成功");
            this.dialogVisible = false;
            this.$emit("chooseItem", `${res.data.url}`);
          }
        })
      });
    },

    uploadImg(e, num) {
      //上传图片
      this.example2.img = "";
      var file = e.target.files[0];
      this.fileNames = file.name;
      // console.log(file);
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        data = e.target.result;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blobcs
      reader.readAsArrayBuffer(file);
    },
    // base64转blob
    toBlob(ndata) {
      //ndata为base64格式地址
      // console.log(ndata)
      let arr = ndata.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    },
    // base64转file
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  },
  computed: {
    ...mapGetters(['roles'])
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
  // background: rgba(0, 0, 0, 0);
  z-index: 10;
  .pop-btn {
    margin-top: -40px;
    margin-right: 10px;
    padding-bottom: 10px;
  }
  // .up-btn .el-button {
  //   position: absolute;
  //   right: 20px;
  // }
  /deep/.inputFlie {
    position: absolute;
    margin-left: -120px;
    margin-top: -40px;
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

  .upload-now .el-button {
    margin-left: -150px;
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
}
.content {
  margin: auto;
  max-width: 585px;
  margin-bottom: 100px;
}

.test-button {
  display: flex;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c0ccda;
  color: #1f2d3d;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 20px 10px 0px 0px;
  padding: 9px 15px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #50bfff;
  border-color: #50bfff;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.des {
  line-height: 30px;
}

code.language-html {
  padding: 10px 20px;
  margin: 10px 0px;
  display: block;
  background-color: #333;
  color: #fff;
  overflow-x: auto;
  font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo,
    Lucida, Sans, Type, Writer, Ubuntu, Mono;
  border-radius: 5px;
  white-space: pre;
}

.show-info {
  margin-bottom: 50px;
}

.show-info h2 {
  line-height: 50px;
}

/*.title, .title:hover, .title-focus, .title:visited {
        color: black;
    }*/

.title {
  display: block;
  text-decoration: none;
  text-align: center;
  line-height: 1.5;
  margin: 20px 0px;
  background-image: -webkit-linear-gradient(
    left,
    #3498db,
    #f47920 10%,
    #d71345 20%,
    #f7acbc 30%,
    #ffd400 40%,
    #3498db 50%,
    #f47920 60%,
    #d71345 70%,
    #f7acbc 80%,
    #ffd400 90%,
    #3498db
  );
  color: transparent;
  -webkit-background-clip: text;
  background-size: 200% 100%;
  animation: slide 5s infinite linear;
  font-size: 40px;
}

.test {
  height: 285px;
}

.model {
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}

.model-show {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.model img {
  display: block;
  margin: auto;
  max-width: 80%;
  user-select: none;
  background-position: 0px 0px, 10px 10px;
  background-size: 20px 20px;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
}

.c-item {
  display: block;
  padding: 10px 0;
  user-select: none;
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -100% 0;
  }
}

@media screen and (max-width: 1000px) {
  .content {
    max-width: 90%;
    margin: auto;
  }

  .test {
    height: 400px;
  }
}
</style>

