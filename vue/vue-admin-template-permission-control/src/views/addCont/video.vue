<template>
  <div class="article mt10">
    <el-row>
      <!-- <el-col :span="5" class="tac">
        <img src="~img/ic_phone.png" alt class="phone-icon">
        <div v-html="editCont" class="edit-page"></div>
      </el-col>-->
      <el-col :span="24">
        <el-col :span="10">
          <el-col>
            <em>头部标题</em>：
            <el-input v-model="articleCont.title" ></el-input>
          </el-col>
          <el-col class="mt50">
            <em>文章来源</em>：
            <el-input v-model="articleCont.source"></el-input>
          </el-col>
          <el-col class="mt50">
            <em>网址</em>：
            <el-input v-model="articleCont.sourceLink"></el-input>
          </el-col>
          <el-col class="mt50">
            <em>本文作者</em>：
            <el-input v-model="articleCont.author"></el-input>
          </el-col>
        </el-col>
        <el-col :span="14">
          <el-row class="up-img mb20">
            <el-row class="mb20">封面图：</el-row>
            <el-col :span="6">
              <div class="upload-before" v-if="articleCont.imageUrl == ''" @click="chooseBook">
                <svg-icon icon-class="tupian"></svg-icon>
                <span class="f14 cada">690*390</span>
              </div>
              <div class="upload-after" v-if="articleCont.imageUrl != ''" @click="chooseBook">
                <img :src="articleCont.imageUrl" alt />
              </div>
            </el-col>

            <div class="mb10 cada f16">封面图标准尺寸为690*390（3:2)，以帮助你快速调整封面图展示效果。</div>
            <div class="mb10 cada f16">*可实时预览你上传图片的展示效果*</div>
          </el-row>
          <el-row class="up-video mt60">
            <el-row class="mb20">视频：</el-row>
            <el-col :span="7">
              <div class="upload-before" v-if="articleCont.videoUrl == ''" @click="getVideo">
                <svg-icon icon-class="video"></svg-icon>
              </div>
              <div class="upload-after" v-if="articleCont.videoUrl != ''" @click="getVideo">
                <video :src="articleCont.videoUrl"></video>
              </div>
            </el-col>
            <div class="mb10 cada f16">视频标准尺寸为3:2，以帮助你快速调整封面图展示效果。</div>
            <div class="mb10 cada f16">*可实时预览你上传图片的展示效果*</div>
          </el-row>
        </el-col>
        <div class="el-col-24 mt20">
          关联频道：
          <el-select v-model="value" placeholder="请选择" @change="change">
            <el-option v-for="item in option" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-button type="text" @click="editC" class="ml20">编辑</el-button>
          <i class="f14 cada">(至少1个关联赛事)</i>
          <div class="el-col-24 mt20 show-list">
            <span v-for="(item,index) in matList" :key="index" class="mr20">
              <el-button size="mini">{{item}}</el-button>
              <svg-icon icon-class="delete" @click="delMac(index)" v-if="isEditC"></svg-icon>
            </span>
          </div>
        </div>
        <div class="el-col-24 mt20">
          <el-col :span="5">
          文章标签：
          <el-input placeholder="请输入关键字" v-model="tagsName"></el-input>
          <div class="tab-list" v-if="tagsName != ''">
            <span class="cp f14" v-for="item in tagsList" :key="item.id" @click="chooseTag(item.name)">{{item.name}}</span>
          </div>
          </el-col>
          <!-- 文章标签：
          <el-select v-model="values" placeholder="请选择" @change="changes">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select> -->
          <el-button type="text" @click="editT">编辑</el-button>
          <i class="f14 cada">(至少添加1个标签，标签最多添加10个)</i>
          <div class="el-col-24 mt20 show-list">
            <span v-for="(item,index) in artList" :key="index" class="mr20">
              <el-button size="mini">{{item}}</el-button>
              <svg-icon icon-class="delete" @click="delTag(index)" v-if="isEditT"></svg-icon>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 新增标签 -->
    <new-tag
      ref="NewTag"
      @cancel="cancel"
      :dialogVisible="dialogVisible"
      :dialogStatus="dialogStatus"
      :id="id"
    ></new-tag>
    <!-- 图片选择器 -->
    <imgPop
      ref="imgPop"
      @cancel="cancelPop"
      v-if="isPopImg"
      @chooseItem="chooseItem"
      :isEdit="true"
    ></imgPop>
    <videoPop
      ref="videoPop"
      @cancel="cancelPopVideo"
      v-if="isPopVideo"
      @chooseItem="chooseItemVideo"
    ></videoPop>
    <!-- <el-col class="mt50" :push="3" :span="16">
      <div class="el-col-12 mt10">
        <el-switch :value="articleCont.autoPublish" @change="changeAuto" class="mr20" />通过审核后自动发布
      </div>
      <div class="el-col-12 tar">
        <el-button @click="artAtatus === 'add' ? addVideos(3) : putVideos(3)" class="mr30">保存</el-button>
        <el-button
          type="dqx-btn"
          @click="artAtatus === 'add' ? addVideos(0) : putVideos(0)"
          class="ml30"
        >保存并提审</el-button>
      </div>
    </el-col> -->
    <!-- 未提审前状态 -->
    <div class="mt20" v-if="contStatus === 3 || contStatus === 2">
      <div class="el-col-12 mt10">
        <el-switch :value="articleCont.autoPublish" @change="changeAuto" class="mr20" />通过审核后自动发布
      </div>
      <div class="el-col-12 tar">
        <el-button @click="artAtatus === 'add' ? addVideos(3) : putVideosGo(3)" class="mr30">保存</el-button>
        <el-button
          type="dqx-btn"
          @click="artAtatus === 'add' ? addVideos(0) : putVideosGo(0)"
          class="ml30"
        >保存并提审</el-button>
      </div>
    </div>
    <!-- 提审中状态 -->
    <div class="mt20" v-if="contStatus != 3 && contStatus != 2 && !articleCont.isPublish">
      <div class="el-col-12 tar">
        <el-button @click="refuseCheck" class="mr30">驳回</el-button>
        <el-button
          type="dqx-btn"
          @click="checked"
          class="ml30"
        >{{articleCont.autoPublish ? '审核通过并发布' : '审核通过'}}</el-button>
      </div>
    </div>
     <!-- 已发布状态 -->
    <div class="mt20" v-if="articleCont.isPublish&&contStatus == 1">
      <div class="el-col-12 tar">
        <el-button
          type="dqx-btn"
          @click="publishPut"
          class="ml30"
        >修改并发布</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getMainIndex } from "@/api/channel";
import { getTags, addVideo, getVideoDet, putVideo,contChecks,
  contPublish } from "@/api/edit";
import NewTag from "@/views/common/new-tag";
import imgPop from "@/views/common/img-list.vue";
import videoPop from "@/views/common/video-list.vue";
export default {
  data() {
    return {
      matList: [], //关联频道标签
      matListId: [], //关联频道ID
      artList: [], //文章标签列表
      isEditC: false,
      isEditT: false,
      option: [],
      value: "",
      options: [],
      values: "",
      dialogVisible: false,
      dialogStatus: "create",
      id: 0,
      isPopImg: false,
      imgUrlEdit: "", //弹窗选择URL
      isAddImg: false, //判断是否选择图片
      isPopVideo: false, //是否选择视频
      isTop: true,
      artAtatus: "add",
      articleCont: {
        author: "",
        title: "",
        subhead: "",
        imageUrl: "",
        videoUrl: "",
        sourceLink: "",
        source: "",
        autoPublish: true,
        checkStatus: 0
      },
      contStatus: 3, //  文章状态(编辑情况下)
      tagsName:"",
      tagsList:[]
    };
  },
  components: {
    NewTag,
    imgPop,
    videoPop
  },
  methods: {
    // 保存修改并发布
    async publishPut(){
      let res = await this.putVideos(this.contStatus);
      if(res === 0){
        this.$message("修改成功");
        this.$router.push({
          path: "/edit/contMana",
          query: { type: "video" }
        });
      }
    },
    // 审核通过
    async checked() {
      let res = await this.putVideos(this.contStatus);
      if(res === 0){
      contChecks(this.$route.query.id, 1, "video").then(_ => {
        this.$message("审核通过");
        this.$router.push({
          path: "/edit/contMana",
          query: { type: "video" }
        });
      });

      }
    },
    // 驳回
    refuseCheck() {
      contChecks(this.$route.query.id, 2, "video").then(_ => {
        this.$message("操作成功");
        this.$router.push({
          path: "/edit/contMana",
          query: { type: "video" }
        });
      });
    },
    // 图片选择回调
    chooseItem(val) {
      this.articleCont.imageUrl = val;
      this.isPopImg = false;
    },
    // 图片选择框取消
    cancelPop() {
      this.isPopImg = false;
    },
    // 封面图选择
    chooseBook() {
      this.isPopImg = true;
    },
    // 视频选择
    getVideo() {
      this.isPopVideo = true;
    },
    // 视频取消选择回调
    cancelPopVideo() {
      this.isPopVideo = false;
    },
    // 视频选择回调
    chooseItemVideo(val) {
      this.articleCont.videoUrl = val;
      this.isPopVideo = false;
    },
    // 是否自动发布
    changeAuto(val) {
      this.articleCont.autoPublish = !this.articleCont.autoPublish;
    },
    // 标签回调
    cancel(val) {
      if (this.artList.includes(val)) {
        return;
      }
      this.artList.push(val);
      this.dialogVisible = false;
    },
    // 下拉选择标签
    changes(val) {
      if (this.artList.includes(val)) {
        return;
      }
      this.artList.push(val);
    },
    // 新增标签
    addTag() {
      this.dialogVisible = true;
    },
    // 下拉选择频道
    change(val) {
      if (this.matListId.includes(val)) {
        return;
      }
      this.option.map(res => {
        if (res.id === val) {
          this.matList.push(res.name);
        }
      });
      this.matListId.push(val);
    },
   // 标签选择
    chooseTag(val){
      if (this.artList.includes(val)) {
        this.$message('该标签已选择，请勿重复添加')
        return;
      }
      this.artList.push(val);
      this.tagsName = '';
    },
    // 获取频道列表
    getChannel() {
      getMainIndex().then(res => {
        this.option = res.data;
        this.value = this.option[0].name;
      });
    },
    // 获取标签列表
    getTag() {
      getTags({name:this.tagsName}).then(res => {
        this.tagsList = res.data;
      });
    },
    // 频道编辑
    editC() {
      this.isEditC = !this.isEditC;
    },
    // 标签编辑
    editT() {
      this.isEditT = !this.isEditT;
    },
    // 删除标签
    delTag(val) {
      this.artList.splice(val, 1);
    },
    // 删除频道
    delMac(val) {
      this.matList.splice(val, 1);
      this.matListId.splice(val, 1);
      console.log(this.matList, this.matListId);
    },
    // 添加文章
    addVideos(val) {
      let tags = "";
      this.artList.map(res => {
        tags += res + ",";
      });
      addVideo({
        author: this.articleCont.author,
        title: this.articleCont.title,
        subhead: this.articleCont.subhead,
        imageUrl: this.articleCont.imageUrl,
        videoUrl: this.articleCont.videoUrl,
        sourceLink: this.articleCont.sourceLink,
        source: this.articleCont.source,
        channelIds: this.matListId,
        autoPublish: this.articleCont.autoPublish,
        tags: tags.substring(0, tags.length - 1),
        checkStatus: val
      }).then(res => {
        this.$message("修改成功");
        this.$router.push({
          path: "/edit/contMana",
          query: { type: "video" }
        });
      });
    },
    // 修改文章调用方法
    async putVideosGo(val){
      let res = await this.putVideos(val);
      if(res === 0){
          this.$message("修改成功");
          this.$router.push({
          path: "/edit/contMana",
          query: { type: "video" }
        });
      }
    },
    // 修改文章
    async putVideos(val) {
      let tags = "";
      this.artList.map(res => {
        tags += res + ",";
      });
       return new Promise((resolve, reject) => {
      putVideo({
        id: this.$route.query.id,
        author: this.articleCont.author,
        title: this.articleCont.title,
        subhead: this.articleCont.subhead,
        imageUrl: this.articleCont.imageUrl,
        videoUrl: this.articleCont.videoUrl,
        sourceLink: this.articleCont.sourceLink,
        source: this.articleCont.source,
        channelIds: this.matListId,
        autoPublish: this.articleCont.autoPublish,
        tags: tags.substring(0, tags.length - 1),
        checkStatus: this.contStatus
      }).then(res => {
         return resolve(res.code);
      });
      })
    }
  },
  async created() {
    this.getChannel();
    this.getTag();
    if (this.$route.query.id) {
      // 判断是新增还是修改
      this.artAtatus = "update";
      getVideoDet(this.$route.query.id).then(res => {
        this.articleCont = res.data;
        res.data.channel.map(res => {
          this.matList.push(res.name);
          this.matListId.push(res.id);
        });
        this.artList = res.data.tags.split(",");
        this.contStatus = res.data.checkStatus;
      });
    }
  },
  watch:{
    tagsName(newVal){
      if(newVal != ''){
        this.getTag();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tab-list{
  position: absolute;
  width: 200px;
  max-height: 200px;
  overflow-y: scroll;
  border: 1px solid #eee;
  padding: 10px;
  margin-left: 290px;
  border-radius: 5px;
  margin-top: -40px;
  z-index: 9;
  background: #fff;
  
    span+span{
      margin-top: 10px;
    }
  span{
    display: block;
  }
}
.article {
  overflow-y: scroll;
  height: calc(100vh - 200px);
  &::-webkit-scrollbar {
    display: none;
  }
  .show-list {
    margin-left: 85px;
    .svg-icon {
      color: red;
      font-size: 16px;
      position: absolute;
      margin-left: -8px;
      margin-top: -8px;
    }
  }
  .up-video {
    position: relative;
    .upload-after {
      video {
        width: 12vw;
        height: 6vw;
      }
    }
    .upload-before {
      width: 12vw;
      height: 6vw;
      background: #f5f5f5;
      text-align: center;
      span {
        display: block;
      }
      .svg-icon {
        font-size: 39px;
        color: #adadad;
        margin-top: 2vw;
      }
    }
  }
  .up-img {
    height: 7vw;
    position: relative;
    video {
      width: 100%;
    }
    .upload-after {
      img {
        width: 8.5vw;
        height: 6vw;
      }
    }
    .upload-before {
      width: 8.5vw;
      height: 6vw;
      background: #f5f5f5;
      text-align: center;
      span {
        display: block;
      }
      .svg-icon {
        font-size: 39px;
        color: #adadad;
        margin-top: 1.5vw;
      }
    }
  }
  em {
    position: relative;
    display: inline-block;
    width: 64px;
    text-align: justify;
    top: 18px;
    &::after {
      display: inline-block;
      content: "";
      width: 100%;
    }
  }
  .el-input {
    width: calc(100% - 150px);
  }
}
</style>

