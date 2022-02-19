<template>
  <div style="margin: 2%">
    <el-row type="flex" style="margin: 1.5rem 0">
      <el-col :span="1" ><div style="marginTop:.5rem">标题</div></el-col>
      <el-col :span="20">
        <el-input
          v-model="Information.title"
          placeholder="请输入标题"
        ></el-input>
      </el-col>
    </el-row>

    <el-row type="flex" style="margin: 1.5rem 0">
      <el-col :span="1" >  <div style="marginTop:.5rem">摘要</div></el-col>
      <el-col :span="20">
        <el-input
          v-model="Information.digest"
          placeholder="请输入摘要"
        ></el-input>
      </el-col>
    </el-row>

    <el-row type="flex" style="margin: 1.5rem 0">
      <el-col :span="1" ><div style="marginTop:.5rem">资讯类型</div></el-col>
      <el-col :span="20">
        <el-select
          @change="TypeChange"
          v-model="value"
          placeholder="请选择资讯类型"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row style="margin: 1.5rem 0">
      <el-col>
        <el-row type="flex">
          <el-col :span="1"> 封面图 </el-col>
          <el-col :span="20">
            <el-row>
              <el-col>
                <div class="img" @click="handleShowImg">
                  <i class="el-icon-picture-outline inputicon"></i>
                  <el-image class="showimg" :src="Information.imgUrl">
                    <div slot="error" class="image-slot"></div>
                  </el-image>
                  <!-- <input
                    type="file"
                    class="inputFlie"
                    @change="upvideo"
                    ref="file"
                    accept="image/png, image/gif, image/jpg, image/jpeg, image/bmp;"
                    id="container"
                  /> -->
                </div>
              </el-col>
              <el-col>
                <el-col>
                  <el-row style="margin: 1rem 0">
                    <el-col style="color: #ccc">
                      封面图标准尺寸为（3:2)，以帮助你快速调整封面图展示效果。
                    </el-col>
                    <el-col style="color: #ccc">
                      *可实时预览你上传图片的展示效果*
                    </el-col>
                  </el-row>
                </el-col>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row type="flex" style="margin: 1.5rem 0">
      <el-col :span="1" style="marginTop:.5rem"><div >标签</div>  </el-col>
      <el-col>
        <el-autocomplete
          v-model="state"
          @change="tagsChange"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>
    </el-row>
    <el-tag
      :key="tag"
      v-for="tag in dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <!-- <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button> -->

    <el-row style="margin: 1.5rem 0">
      <el-col :span="21">
        <quill-editor
          ref="text"
          v-model="content"
          class="myQuillEditor"
          :options="editorOption"
          @change="onEditorChange($event)"
        />
      </el-col>
      <el-col>
        <el-button style="margin: 1rem 0" type="primary" @click="newsId===0?submit():ReviseSubmit()"
          >{{newsId===0?'发布文章':'修改文章'}}</el-button
        >
      </el-col>
    </el-row>

    <el-dialog
      title="资源库"
      :visible.sync="outerVisible"
      width="67.5%"
      :destroy-on-close="true"
      style="flexflow: wrap"
    >
      <div class="imgrow">
        <div class="imgcol" v-for="fit in url" :key="fit">
          <el-image
            @click="handleClickImg(fit)"
            style="
              width: 12rem;
              height: 9rem;
              margin: 0.5rem 0.5rem 0 0;
              boxshadow: 1px 1px 10px #888888;
            "
            :src="`http://reserved.oss-cn-shenzhen.aliyuncs.com/${fit}`"
          ></el-image>
        </div>
      </div>
      <div slot="footer" class="loadingk">
        <i class="el-icon-arrow-down loadings" @click="load"></i>
        <el-button type="success" class="upfileImg"
          >上传图片
          <input
            type="file"
            class="inputFlie"
            @change="upvideo"
            ref="file"
            accept="image/png, image/gif, image/jpg, image/jpeg, image/bmp;"
            id="container"
          />
        </el-button>
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// https://v.qq.com/txp/iframe/player.html?vid=o0024m2jiwx&tiny=0&autoplay=false
import axios from "axios";
import Editor from "@/views/tinymce-editor/tinymce-editor.vue";
import {
  getOssCertificate,
  getImage,
  uploadNews,
  getNews,
  getLabel,
  getResourceLibrary,
} from "@/api/oss";
import { getToken } from "@/utils/auth";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    Editor,
    quillEditor,
  },
  data() {
    // http://reserved.oss-cn-shenzhen.aliyuncs.com
    return {
      // 资讯类型
      options: [
        {
          value: 0,
          label: "赛前分析",
        },
        {
          value: 1,
          label: "快讯",
        },
        {
          value: 2,
          label: "战报",
        },
      ],
      outerVisible: false,
      url: [],
      newsId:0,
      nextToken: null,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      restaurants: [], //标签
      state: "",
      timeout: null,
      tagsId: [],
      content: "",
      editorOption: {},
      showImage: "true",
      imgUrlEdit: [], //弹窗选择URL
      editVideoUrl: "", //富文本图片
      isAddImg: false, //判断是否选择图片
      isAddVdo: false, //判断是否选择视频
      contentDet: "", //  详情页赋值给富文本
      value: "",
      // 封面图
      imageUrl: "",
      Information: {
        title: "", //文章标题
        digest: "", //文章摘要
        type: "", //文章类型
        imgUrl: "", //封面url
        RichTextContent: "", //富文本内容
        matchId: 1, //比赛id
      },
      uploadImg: "",
      headers: getToken(),
      ossdata: "",
    };
  },
  methods: {
    onEditorChange(e) {
      this.Information.RichTextContent = e.html;
    },
    TypeChange(type) {
      this.Information.type = type;
    },
    handleAvatarSuccess(res, file, list) {
      console.log(res);
      console.log(file);
      console.log(list);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleClickImg(url) {
      this.outerVisible = false; //点击图片后关闭
      this.Information.imgUrl = `http://reserved.oss-cn-shenzhen.aliyuncs.com/${url}`;
    },
    async load() {
      const { data } = await getResourceLibrary(this.nextToken);
      const { isLast, keys, nextToken } = data;
      this.nextToken = nextToken;
      this.url.push(...keys);
      console.log(keys, "@@@@");
    },
    async handleShowImg() {
      this.outerVisible = true;
      const { data } = await getResourceLibrary(this.nextToken);
      const { isLast, keys, nextToken } = data;
      this.nextToken = nextToken;
      this.url = keys;
    },
    // 上传图片
    async upvideo() {
      const file = this.$refs.file.files[0];
      // 获取token
      const res = await getOssCertificate();
      let data = res.data;
      const request = new FormData();
      let name = `${data.dir}${new Date().getTime()}_${file.name}`;
      console.log(data);
      request.append("name", file.name); // Bucket 拥有者的Access Key Id。
      request.append("OSSAccessKeyId", data.accessid); // Bucket 拥有者的Access Key Id。
      request.append("policy", data.policy); // policy规定了请求的表单域的合法性
      request.append("signature", data.signature); // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
      request.append("key", data.dir);
      request.append("success_action_status", 200); // 让服务端返回200,不然，默认会返回204
      request.append("file", file);

      axios({
        method: "post",
        url: data.host,
        data: request,
      }).then(async (res) => {
        console.log(res);
        // 上传成功之后的回调
        if (res.status === 200) {
          let url = `${data.host}\/${data.dir}`;
          console.log("上传成功之后的回调", url);
          this.$message("资讯上传成功");
          this.Information.imgUrl = url;
          // this.showImage = false;

          const res = await getResourceLibrary(this.nextToken);
          const { isLast, keys, nextToken } = res.data;
          console.log(nextToken);
          this.nextToken = nextToken;
          this.url = [];
          this.url = keys;
        }
      });
    },

    cont(val) {
      this.articleCont.content = val;
    },
    // 富文本选择视频
    chooseVdo() {
      this.isForEdit = true;
      this.isPopVideo = true;
    },

    async submit() {
      // 做非空判断
      if (!this.Information.RichTextContent) {
        this.$message({
          message: "资讯内容不能为",
          type: "error",
        });
      } else if (!this.Information.digest) {
        this.$message({
          message: "摘要不能为空",
          type: "error",
        });
      } else if (!this.Information.title) {
        this.$message({
          message: "文章标题不能空",
          type: "error",
        });
      } else if (this.value === "") {
        this.$message({
          message: "资讯类型不能为空",
          type: "error",
        });
      } else if (!this.Information.imgUrl) {
        this.$message({
          message: "封面图不能为空",
          type: "error",
        });
      } else {
        const dtoAddNews = {
          content: this.Information.RichTextContent,
          digest: this.Information.digest,
          matchId: this.Information.matchId,
          tagsId:this.tagsId,
          // tagsId:{
          //   tagId:this.tagsId.tagId,
          //   tagIsTeam:this.tagsId.tagIsTeam,
          //   tagTeamType:this.tagsId.tagTeamType
          // },
          title: this.Information.title,
          type: this.Information.type,
          mainImageUrl: this.Information.imgUrl,
        };
        axios({
          method: "post",
          // baseURL: 'http://192.168.1.201:8080', // url = base url + request url
          // baseURL: 'http://192.168.1.31:8080', // url = base url + request url
          // baseURL: 'http://192.168.1.33:8080', // url = base url + request url
          // url: "http://192.168.1.201:8080/cloud-news-publish/news/publish",
          url: "http://192.168.1.33:8080/cloud-news-publish/news/publish",
          data: dtoAddNews,
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }).then((res) => {
            this.value = "";
          this.content = "";
          this.Information.digest = "";
          this.Information.matchId = "";
          this.Information.title = "";
          this.Information.imgUrl = "";
          this.dynamicTags = "";
          this.state = "";
          this.$message({
            message: "资讯发布成功",
            type: "success",
          });
         
        });
        // const res = await uploadNews(dtoAddNews);
        // console.log(res);
      }
    },
        async ReviseSubmit() {
          console.log('修改文章');
      // 做非空判断
      if (!this.Information.RichTextContent) {
        this.$message({
          message: "资讯内容不能为",
          type: "error",
        });
      } else if (!this.Information.digest) {
        this.$message({
          message: "摘要不能为空",
          type: "error",
        });
      } else if (!this.Information.title) {
        this.$message({
          message: "文章标题不能空",
          type: "error",
        });
      } else if (this.value === "") {
        this.$message({
          message: "资讯类型不能为空",
          type: "error",
        });
      } else if (!this.Information.imgUrl) {
        this.$message({
          message: "封面图不能为空",
          type: "error",
        });
      } else {
        const dtoAddNews = {
          content: this.Information.RichTextContent,
          digest: this.Information.digest,
          matchId: this.Information.matchId,
          tagsId:this.tagsId,
          newsId:this.newsId,
          // tagsId:{
          //   tagId:this.tagsId.tagId,
          //   tagIsTeam:this.tagsId.tagIsTeam,
          //   tagTeamType:this.tagsId.tagTeamType
          // },
          title: this.Information.title,
          type: this.Information.type,
          mainImageUrl: this.Information.imgUrl,
        };
        axios({
          method: "put",
          // baseURL: 'http://192.168.1.201:8080', // url = base url + request url
          // baseURL: 'http://192.168.1.31:8080', // url = base url + request url
          // baseURL: 'http://192.168.1.33:8080', // url = base url + request url
          // url: "http://192.168.1.201:8080/cloud-news-publish/news/publish",
          url: "http://192.168.1.33:8080/cloud-news-publish/news/edit",
          data: dtoAddNews,
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }).then((res) => {
            this.value = "";
          this.content = "";
          this.Information.digest = "";
          this.Information.matchId = "";
          this.Information.title = "";
          this.Information.imgUrl = "";
          this.dynamicTags = "";
          this.state = "";
          this.$message({
            message: "编辑资讯发布成功",
            type: "success",
          });
      
        })
        // const res = await uploadNews(dtoAddNews);
        // console.log(res);
      }
    },
    // editorOption里是放图片上传配置参数用的，例如：
    // action:  '/api/product/richtext_img_upload.do',  // 必填参数 图片上传地址
    // methods: 'post',  // 必填参数 图片上传方式
    // token: '',  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
    // name: 'upload_file',  // 必填参数 文件的参数名
    // size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
    // accept: 'multipart/form-data, image/png, image/gif, image/jpeg, image/bmp, image/x-icon,image/jpg'  // 可选 可上传的图片格式

    //删除标签
    handleClose(tag) {
     const tagsId = this.tagsId.filter(item=>{
        return item.name !== tag
      })
      this.tagsId = tagsId
      console.log(this.tagsId);
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // 控制input框输入
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(data) {
      
      let add = true;
        this.tagsId.map((item) => {
        if (item.tagId === data.address) {
          this.$message({
            message: "请勿重复添加标签",
            type: "error",
          });
          add = false;
        }
      })
      
      if (add) {
        this.tagsId.push({
          tagId: data.address,
      tagIsTeam: data.tagIsTeam,
      tagTeamType: data.tagTeamType,
      name:data.value
        })
        let inputValue = this.inputValue; //input输入的内容
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        if (data) {
          //如果有输入触发了这个函数,添加
          this.dynamicTags.push(data.value);
        }
        this.inputVisible = false;
        this.inputValue = "";
      }
    },

    // 标签
    loadAll() {
      let datalist = [];
       if(this.state!==''){
        getLabel(this.state).then(({ data }) => {
          data.map((item) => {
            data.length===0?'':datalist.push({ value: item.name, address: item.tagId,tagIsTeam:item.tagIsTeam,tagTeamType:item.tagTeamType })
          });
      })
   }
      // debugger
      return datalist;
    },
    // 搜索标签
    async tagsChange(e) {
      
      // const {data} = await getLabel(e);
      // this.loadAll(data)
      // this.restaurants = this.loadAll()
      // console.log(this.restaurants);
    },

     querySearchAsync(queryString, cb) {
       this.loadAll()
      this.restaurants = this.loadAll();
      console.log(this.restaurants);
      var restaurants = this.restaurants; //标签
      // var results = queryString? restaurants.filter(this.createStateFilter(queryString)): restaurants;
      var results = restaurants;
      cb(results);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 2000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(data) {
      //标签 标签id
      this.handleInputConfirm(data);
    },
  },

  // mounted() {
  //   this.restaurants = this.loadAll(); //初始化获取标签
  // },
  async created() {
    // 如果这个参数存在的话
    if (this.$route.query.id) {
      const res = await getNews(this.$route.query.id);
      const { title, digest, type, content, tags,  mainImageUrl,id } =
        res.data;
      console.log(res.data);
      if (res.code === 200) {
        this.Information.title = title;
        this.Information.digest = digest;
        this.value = type;
        this.content = content;
        this.Information.type = type;
        this.tagsId = tags
        this.Information.imgUrl = mainImageUrl;
        this.newsId = id
        tags.map((item) => {
          // this.restaurants.push(item);
          this.dynamicTags.push(item.name);
        });
        this.$route.query.id = "";
      }
    }
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.title {
  line-height: 250%;
}
.input {
  background: #eee;
  width: 12rem;
  height: 8 rem;
  position: relative;
}
/* .el-icon-picture-outline {
  position: absolute;
  font-size: 50px;
  color: #ccc;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
} */
.inputicon {
  position: absolute;
  font-size: 2rem;
  color: #ccc;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 98;
}
.upfileImg {
  position: relative;
  width: 6rem;
  height: 2.5rem;
}
.inputFlie {
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.inputimg {
  position: absolute;
  width: 12rem;
  height: 8rem;
  z-index: 98;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.img {
  width: 12rem;
  height: 8rem;
  background-color: #eee;
  position: relative;
}
.showimg {
  position: absolute;
  width: 12rem;
  height: 8rem;
  z-index: 99;
}
.imgrow {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.loadingk {
  position: relative;
}
.loadings {
  position: absolute;
  left: 50%;
  font-size: 2rem;
  color: #ccc;
  transform: translateX(-50%);
}
.loadings:hover {
  color: #409eff;
}
</style>
