<template>
  <div class="article mt10">
    <el-row class="push-area mb30" v-if="isPush && artAtatus == 'add'">
      推送专用：<el-input
        placeholder="请输入内容"
        v-model="summary"
        class="summary-input"
      ></el-input>
      <el-button @click="push" type="dqx-btn" :disabled="disabledPush"
        >发布并推送</el-button
      >
    </el-row>
    <el-row class="mb30" v-if="matchTime">
      <el-col :span="12">战报关联比赛：{{ matchName }}</el-col>
      <el-col :span="12">开赛时间：{{ matchTime | formatTime }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-col :span="10">
          <el-col>
            <em> <i>*</i>头部标题 </em>：
            <el-input
              v-model="articleCont.title"
              placeholder="推送文章标题不超过15个字"
            ></el-input>
          </el-col>
          <el-col class="mt30">
            <em>文章来源</em>：
            <el-input
              v-model="articleCont.source"
              placeholder="请输入来源名称(最多输入16个字)"
              maxlength="16"
            ></el-input>
          </el-col>
          <el-col class="mt30">
            <em>网址</em>：
            <el-input
              v-model="articleCont.sourceLink"
              placeholder="请输入来源地址"
            ></el-input>
          </el-col>
          <el-col class="mt30">
            <em> <i>*</i>本文作者 </em>：
            <el-input
              v-model="articleCont.author"
              placeholder="请输入作者(最多输入16个字)"
              maxlength="16"
            ></el-input>
          </el-col>
          <el-col class="mt30">
            <em>文章摘要</em>：
            <el-input
              v-model="articleCont.subhead"
              type="textarea"
              placeholder="推送时必填"
            ></el-input>
          </el-col>
        </el-col>
        <el-col :span="14">
          <el-row class="up-img mb20">
            <el-row class="mb20"> <i>*</i>封面图： </el-row>
            <el-col :span="8">
              <div
                class="upload-before"
                v-if="articleCont.cover == ''"
                @click="isPopImg = true"
              >
                <svg-icon icon-class="tupian"></svg-icon>
                <span class="f14 cada">690*390</span>
              </div>
              <div
                class="upload-after"
                v-if="articleCont.cover != ''"
                @click="isPopImg = true"
              >
                <img :src="articleCont.cover" alt />
              </div>
              <!-- <uploadI ref="uploadI" @upImg="upImg" :isEdit="true"></uploadI> -->
            </el-col>
          </el-row>
          <div class="mb10 cada f16">
            封面图标准尺寸为690*390（3:2)，以帮助你快速调整封面图展示效果。
          </div>
          <div class="mb10 cada f16">*可实时预览你上传图片的展示效果*</div>
          <!-- <el-row class="up-video mt30">
            <el-row class="mb20">
              视频：
             
            </el-row>
            <el-col :span="8">
              <div class="upload-before" v-if="articleCont.video == ''" @click="getVideo">
                <svg-icon icon-class="video"></svg-icon>
                <span class="f14 cada mt10">690*390</span>
              </div>
              <div class="upload-after" v-if="articleCont.video != ''" @click="getVideo">
                <video :src="articleCont.video"></video>
              </div>
            </el-col>
          </el-row> -->
        </el-col>
        <div class="el-col-24 mt20">
          <i>*</i>关联频道：
          <el-select v-model="value" placeholder="请选择" @change="change">
            <el-option
              v-for="item in option"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="text" @click="editC" class="ml20">{{
            isEditC ? "完成" : "编辑"
          }}</el-button>
          <i class="f14 cada">(至少1个关联赛事)</i>
          <div class="el-col-24 mt20 show-list">
            <span v-for="(item, index) in matList" :key="index" class="mr20">
              <el-button size="mini">{{ item }}</el-button>
              <svg-icon
                icon-class="delete"
                @click="delMac(index)"
                v-if="isEditC"
              ></svg-icon>
            </span>
          </div>
        </div>
        <div class="el-col-24 mt20">
          <el-col :span="5">
            <i>*</i>文章标签：
            <el-input placeholder="请输入关键字" v-model="tagsName"></el-input>
            <div class="tab-list" v-if="tagsName != '' && tagsList.length > 0">
              <span
                class="cp f14"
                v-for="item in tagsList"
                :key="item.id"
                @click="chooseTag(item)"
                >{{ item.name }}</span
              >
            </div>
          </el-col>
          <!-- <el-select v-model="values" placeholder="请选择" @change="changes">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>-->
          <el-button type="text" @click="editT">{{
            isEditT ? "完成" : "编辑"
          }}</el-button>
          <i class="f14 cada">(至少添加1个标签，标签最多添加10个)</i>
          <div class="el-col-24 mt20 show-list">
            <span v-for="(item, index) in artList" :key="index" class="mr20">
              <el-button size="mini">{{ item }}</el-button>
              <svg-icon
                icon-class="delete"
                @click="delTag(index)"
                v-if="isEditT"
              ></svg-icon>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 富文本 -->
    <el-row class="mt20">
      <editor
        ref="Editor"
        @chooseImg="isPopImgMany = true"
        @chooseVdo="chooseVdo"
        @cont="cont"
        :imgUrl="imgUrlEdit"
        :videoUrl="editVideoUrl"
        :isAddImg="isAddImg"
        :isAddVdo="isAddVdo"
        :contentDet="contentDet"
      ></editor>
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
    <!-- 富文本图片选择 -->
    <imgManyPop
      ref="imgManyPop"
      @cancel="isPopImgMany = false"
      v-if="isPopImgMany"
      @chooseItem="chooseItemMany"
    ></imgManyPop>
    <videoPop
      ref="videoPop"
      @cancel="cancelPopVideo"
      v-if="isPopVideo"
      @chooseItem="chooseItemVideo"
    ></videoPop>
    <!-- 自媒体 -->
    <div
      class="mt20"
      v-if="
        isPerson &&
          !this.articleCont.isPublish &&
          this.articleCont.status.value != 0 &&
          (user_id === this.articleCont.authorId ||
            this.articleCont.authorId === '')
      "
    >
      <div class="el-col-24 tar">
        <el-button
          @click="artAtatus === 'add' ? addConfirm(0) : putConfirm()"
          class="mr30"
          :disabled="disabled"
          >保存</el-button
        >
        <el-button
          type="dqx-btn"
          @click="artAtatus === 'add' ? checked() : saveChecked()"
          class="ml30"
          :disabled="disabled"
          >提审</el-button
        >
      </div>
    </div>
    <!-- 内部编辑 -->
    <!-- <div class="mt20" v-if="!isPerson && (user_id === this.articleCont.authorId || this.articleCont.authorId === '')"> -->
    <div class="mt20" v-if="!isPerson">
      <div class="el-col-24 tar">
        <el-button
          @click="artAtatus === 'add' ? addConfirm(0) : putConfirm()"
          :type="artAtatus === 'add' ? '' : 'dqx-btn'"
          class="mr30"
          :disabled="disabled"
          >{{ artAtatus === "add" ? "保存" : "更新" }}</el-button
        >
        <el-button
          type="dqx-btn"
          @click="artAtatus === 'add' ? addConfirm(1) : putConfirmPublish()"
          v-if="!this.articleCont.isPublish"
          :disabled="disabled"
          class="ml30"
          >发布</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import Editor from "@/views/tinymce-editor/tinymce-editor.vue";
import uploadI from "@/components/UploadImg/index";
import uploadV from "@/components/UploadVideo/index";
import { getMainIndex } from "@/api/channel";
import {
  getTagsList,
  addMedia,
  getArticleDet,
  putMedia,
  contCheck,
  contPublish,
  pushNow
} from "@/api/edit";
import NewTag from "@/views/common/new-tag";
import imgPop from "@/views/common/img-list-cut.vue";
import imgManyPop from "@/views/common/img-list-editor.vue";
import videoPop from "@/views/common/video-list.vue";
import { formatTime } from "@/utils/index.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      matList: [], //关联频道标签
      matListId: [], //关联频道ID
      artList: [], //文章标签列表
      artListId: [], //文章标签ID
      isEditC: false,
      isEditT: false,
      option: [],
      value: "",
      options: [],
      values: "",
      dialogVisible: false,
      dialogStatus: "create",
      id: 0,
      isPopImg: false, //单图上传
      isPopImgMany: false, //多图上传
      imgUrlEdit: [], //弹窗选择URL
      isAddImg: false, //判断是否选择图片
      isAddVdo: false, //判断是否选择视频
      editVideoUrl: "", //富文本图片
      isPopVideo: false, //是否选择视频
      isForEdit: false, //判断是否富文本
      isTop: true,
      contentDet: "", //  详情页赋值给富文本
      artAtatus: "add",
      summary: "",
      matchName: "",
      matchTime: null,
      articleCont: {
        author: "",
        authorId: "",
        title: "",
        subhead: "",
        cover: "",
        video: "",
        sourceLink: "",
        source: "",
        content: "",
        status: { value: 5 },
        isPublish: false,
        videoLocation: true,
        autoPublish: true,
        checkStatus: 0,
        matchId: null
      },
      contStatus: 3, //  文章状态(编辑情况下)
      tagsName: "", //标签搜索关键字
      tagsList: "",
      category: 0, //0是足球、1是篮球
      isPerson: true, //是否是自媒体
      isPublishNow: true, //是否立即发布
      disabled: false,
      isPush: false,
      disabledPush: false
    };
  },
  inject: ["reload"],
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  async created() {
    if (this.$route.query.matchId) {
      this.matchName = this.$route.query.name;
      this.matchTime = parseInt(this.$route.query.times);
    }
    this.category = localStorage.getItem("type") == "zq" ? 0 : 1;
    this.isPerson = this.roles.includes("EDITOR_INTERNAL_ARTICLE")
      ? false
      : true;
    if (this.category == 0) {
      this.isPush = this.roles.includes("APPLICATION_FOOTBALL") ? true : false;
    }
    if (this.category == 1) {
      this.isPush = this.roles.includes("APPLICATION_BASKETBALL")
        ? true
        : false;
    }
    this.isPublishNow = !this.isPerson;
    this.$store.commit("setPaging", false);
    this.getChannel();
    this.getTag();
    if (this.$route.query.matchId) {
      this.articleCont.matchId = this.$route.query.matchId;
    }
    if (this.$route.query.id) {
      // 判断是新增还是修改
      this.artAtatus = "update";
      getArticleDet(this.$route.query.id).then(res => {
        this.articleCont = res.data;
        this.contentDet = res.data.content;
        this.articleCont.videoLocation =
          res.data.videoLocation === 2 ? false : true;
          res.data.channels.map(res => {
          this.matList.push(res.channelName);
          this.matListId.push({ id: res.channelId, name: res.channelName });
        });
        res.data.tags.map(res => {
          this.artList.push(res.name);
          this.artListId.push(res.id);
        });
        this.contStatus = res.data.checkStatus;
        if(res.data.matchId){
          this.matchTime = res.data.matchTime;
          this.matchName = res.data.tips;
        }
      });
    }
  },
  computed: {
    ...mapGetters(["roles", "user_id", "name"])
  },
  components: {
    Editor,
    uploadI,
    uploadV,
    NewTag,
    imgPop,
    imgManyPop,
    videoPop
  },
  methods: {
    // 推送
    async push() {
      this.disabledPush = true;
      if (this.category == 0) {
        // 足球
        this.matListId = [{ id: 2, name: "头条" }];
        this.artListId = [3080];
      }
      if (this.category == 1) {
        // 篮球
        this.matListId = [{ id: 1000, name: "头条" }];
        this.artListId = [4048];
      }
      this.articleCont.title = this.summary;
      this.articleCont.cover =
        "https://cdn.jinqiulive.com/static/common/jinqiu_big_boom.jpg";
      this.articleCont.author = this.name;
      console.log(this.name);
      this.articleCont.content = `<p>${this.summary} 详情稍后...</p>`;
      let data = await this.addArticles(1);
      pushNow({ id: data.id, content: this.summary,matchId:data.matchId })
        .then(res => {
          this.disabledPush = false;
          this.$message("推送成功");
          this.$router.push({
            path: "/addCont/index",
            query: { id: data.id }
          });
          this.reload();
        })
        .catch(_ => {
          this.disabledPush = false;
        });
    },
    //  为空校验
    async isNull() {
      return new Promise((resolve, reject) => {
        let msg = "";
        if (this.articleCont.content.length < 10) {
          msg = "内容最少要十个字";
        }
        if (this.matListId.length === 0) {
          msg = "请选择频道";
        }
        if (this.artListId.length === 0) {
          msg = "请选择标签";
        }
        if (this.articleCont.title === "") {
          msg = "请输入标题";
        }
        if (this.articleCont.author === "") {
          msg = "请输入作者";
        }
        return resolve(msg);
      });
    },
    // 富文本内容
    cont(val) {
      this.articleCont.content = val;
    },
    // 富文本选择视频
    chooseVdo() {
      this.isForEdit = true;
      this.isPopVideo = true;
    },
    // 富文本图片选择回调
    chooseItemMany(val) {
      this.imgUrlEdit = val;
      this.isPopImgMany = false;
      this.isAddImg = !this.isAddImg;
    },
    // 图片选择回调
    chooseItem(val) {
      console.log(val);
      this.articleCont.cover = val;
      this.isPopImg = false;
    },
    // 图片选择框取消
    cancelPop() {
      this.isPopImg = false;
    },
    // 视频选择
    getVideo() {
      this.isForEdit = false;
      this.isPopVideo = true;
    },
    // 视频取消选择回调
    cancelPopVideo() {
      this.isPopVideo = false;
    },
    // 视频选择回调
    chooseItemVideo(val) {
      if (this.isForEdit) {
        this.editVideoUrl = val;
        this.isAddVdo = !this.isAddVdo;
      } else {
        this.articleCont.video = val;
      }
      this.isPopVideo = false;
    },
    // 标签回调
    cancel(val) {
      if (this.artList.includes(val)) {
        return;
      }
      this.artList.push(val);
      this.dialogVisible = false;
    },
    // 标签选择
    chooseTag(val) {
      if (this.artList.length === 10) {
        this.$message("标签最多选择十个");
        return;
      }
      if (this.artListId.includes(val.id)) {
        this.$message("该标签已选择，请勿重复添加");
        return;
      }
      this.artList.push(val.name);
      this.artListId.push(val.id);
      this.tagsName = "";
    },
    // 新增标签
    addTag() {
      this.dialogVisible = true;
    },
    // 下拉选择频道
    change(val) {
      let ids = [];
      this.matListId.map(res => {
        ids.push(res.id);
      });
      if (ids.includes(val)) {
        return;
      }
      let name;
      this.option.map(res => {
        if (res.id === val) {
          name = res.name;
          this.matList.push(res.name);
        }
      });
      this.matListId.push({ id: val, name: name });
      console.log(this.matListId);
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
      getTagsList({ name: this.tagsName }).then(res => {
        this.tagsList = res.data;
      });
    },
    // 频道编辑
    editC() {
      if (this.matList.length == 0) {
        this.$message("您还没有添加频道");
        return;
      }
      this.isEditC = !this.isEditC;
    },
    // 标签编辑
    editT() {
      if (this.artList.length == 0) {
        this.$message("您还没有添加标签");
        return;
      }

      this.isEditT = !this.isEditT;
    },
    // 删除标签
    delTag(val) {
      this.artList.splice(val, 1);
      this.artListId.splice(val, 1);
    },
    // 删除频道
    delMac(val) {
      this.matList.splice(val, 1);
      this.matListId.splice(val, 1);
      console.log(this.matList, this.matListId);
    },
    // 视频上传
    upVideo(val) {
      this.video = val;
      // console.log(val)
    },
    // 图片上传
    upImg(val) {
      // this.bannerImg[val].imgUrl = e;
      this.imgUrl = val;
    },
    // 直接发布/保存
    async addConfirm(val) {
      this.disabled = true;
      let msg = await this.isNull();
      if (msg != "") {
        this.$message(msg);
        this.disabled = false;
        return;
      }
      let data = await this.addArticles(val);
      if (data.id) {
        this.disabled = false;
        this.$message("操作成功");
        this.$router.push({
          path: "/addCont/contMana"
        });
      }
    },
    // 文章修改并发布
    async putConfirm() {
      this.disabled = true;
      let msg = await this.isNull();
      if (msg != "") {
        this.$message(msg);
        this.disabled = false;
        return;
      }
      let data = await this.putArticles();
      if (data.id) {
        this.disabled = false;
        this.$message("操作成功");
        this.$router.push({
          path: "/addCont/contMana"
        });
      }
    },
    // 文章修改保存
    async putConfirmPublish() {
      this.disabled = true;
      let msg = await this.isNull();
      if (msg != "") {
        this.$message(msg);
        this.disabled = false;
        return;
      }
      let data = await this.putArticles();
      await this.pubArticle(data.id);
    },

    // 新增提交审核
    async checked() {
      this.disabled = true;
      let msg = await this.isNull();
      if (msg != "") {
        this.disabled = false;
        this.$message(msg);
        return;
      }
      let data = await this.addArticles(0);
      await this.checkArticle(data.id);
    },
    // 保存提审
    async saveChecked() {
      this.disabled = true;
      let msg = await this.isNull();
      if (msg != "") {
        this.disabled = false;
        this.$message(msg);
        return;
      }
      let data = await this.putArticles();
      await this.checkArticle(data.id);
    },
    // 新闻审核
    async checkArticle(val) {
      return new Promise((resolve, reject) => {
        contCheck(val).then(_ => {
          this.$message("发布成功");
          this.$router.push({
            path: "/addCont/contMana"
          });
        });
      });
    },
    //  发布新闻
    async pubArticle(val) {
      return new Promise((resolve, reject) => {
        contPublish(val).then(_ => {
          this.$message("发布成功");
          this.$router.push({
            path: "/addCont/contMana"
          });
        });
      });
    },
    // 添加文章
    async addArticles(val) {
      let isPublishNow = false;
      if (!this.isPerson) {
        if (val === 1) isPublishNow = true;
      }
      let videoLocation = 0;
      if (this.articleCont.video != "") {
        videoLocation = this.articleCont.videoLocation ? 1 : 2;
      }
      this.articleCont.content =
        this.articleCont.content +
        "<p><strong>本文若有抄袭、侵权、违规等情况，请与今球官方联系。转载请注明本文转自今球</strong></p>";
      return new Promise((resolve, reject) => {
        addMedia({
          category: this.category,
          isPerson: this.isPerson,
          isPublishNow: isPublishNow,
          type: 1,
          author: this.articleCont.author,
          title: this.articleCont.title,
          subhead: this.articleCont.subhead,
          cover: this.articleCont.cover,
          video: this.articleCont.video,
          sourceLink: this.articleCont.sourceLink,
          source: this.articleCont.source,
          content: this.articleCont.content,
          channels: this.matListId,
          videoLocation: videoLocation,
          tags: this.artListId,
          matchId: parseInt(this.articleCont.matchId),
          matchTime: parseInt(this.matchTime),
          tips: this.matchName
        })
          .then(res => {
            return resolve(res.data);
          })
          .catch(_ => {
            this.disabled = false;
            this.disabledPush = false;
          });
      });
    },
    // 修改文章
    async putArticles() {
      if (this.matListId.length === 0) {
        this.$message("请选择频道");
        return;
      }
      if (this.artListId.length === 0) {
        this.$message("请选择标签");
        return;
      }
      if (this.articleCont.title === "") {
        this.$message("请输入标题");
        return;
      }
      if (this.articleCont.author === "") {
        this.$message("请输入作者");
        return;
      }
      return new Promise((resolve, reject) => {
        putMedia(this.$route.query.id, {
          author: this.articleCont.author,
          title: this.articleCont.title,
          subhead: this.articleCont.subhead,
          cover: this.articleCont.cover,
          video: this.articleCont.video,
          sourceLink: this.articleCont.sourceLink,
          source: this.articleCont.source,
          content: this.articleCont.content,
          channels: this.matListId,
          tags: this.artListId,
          matchId: parseInt(this.articleCont.matchId)
        })
          .then(res => {
            return resolve(res.data);
          })
          .catch(_ => {
            this.disabled = false;
          });
      });
    }
  },
  watch: {
    tagsName(newVal) {
      if (newVal != "") {
        this.getTag();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tab-list {
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

  span + span {
    margin-top: 10px;
  }
  span {
    display: block;
  }
}
.article {
  overflow-y: scroll;
  height: calc(100vh - 200px);
  // &::-webkit-scrollbar {
  //   display: none;
  // }
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
        margin-top: 1vw;
      }
    }
  }

  i {
    color: #f56c6c;
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
    width: 80px;
    text-align: justify;
    top: 18px;
    &::after {
      display: inline-block;
      content: "";
      width: 100%;
    }
  }
  .el-input {
    width: calc(100% - 160px);
  }
  .el-textarea {
    width: calc(100% - 160px);
  }
  /deep/.el-textarea .el-textarea__inner {
    height: 100px;
  }
  .push-area {
    padding-bottom: 30px;
    border-bottom: 3px solid #eeeeee;
  }
  .summary-input {
    display: inline-block;
    width: calc(100% - 200px);
  }
}
</style>
