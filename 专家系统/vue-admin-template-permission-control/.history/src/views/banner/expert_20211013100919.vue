<template>
  <div class="banner">
    <el-row>
      <el-col :span="6">
        <div class="banner-show">
          <span>首页</span>
          <el-carousel class="mt10">
            <el-carousel-item v-for="(item, index) in bannerList" :key="index">
              <img :src="item.image" alt />
            </el-carousel-item>
          </el-carousel>
          <div class="home-img">
            <img src="~img/ic_qd_pic.png" alt />
          </div>
        </div>
      </el-col>
      <el-col :span="15" :push="2">
        <div class="f24 c171">banner设置</div>
        <div class="mt20 mb20 cada f16">
          Banner标准尺寸为750*420，以帮助你快速调整Banner展示效果。*可实时预览您上传图片的展示效果*
        </div>
        <!-- banner列表 -->
        <el-row v-for="(item, index) in bannerImg" :key="index" class="mb10">
          <div class="el-col-6" @click="chooseImg(index)">
            <div class="upload-before" v-if="item.image == ''">
              <svg-icon icon-class="tupian"></svg-icon>
              <span class="f14 cada">750*420</span>
            </div>
            <div class="upload-after" v-if="item.image != ''">
              <img :src="item.image" alt />
            </div>
          </div>
          <el-col :span="16" :push="1">
            <div>
              <div class="mb10 banner-top">
                <span class="el-col-4">{{ item.name }}</span>
                <em class="el-col-4">关联内容</em>
                <em
                  class="cp el-col-6 banner-cont f14"
                  @click="getCont(index)"
                  >{{item.category == 0 ? '足球' : ''}}{{item.category == 1 ? '篮球' : ''}}{{ item.type | typeTxt }}</em
                >
                <span class="el-col-6 mb20 cada ml20" v-show="item.isMain"
                  >默认开启</span
                >
                <el-switch
                  class="el-col-4 ml20"
                  v-model="item.on"
                  @change="changeSwitch"
                  v-show="!item.isMain"
                />
                <em
                  class="el-col-3 cp c698"
                  v-if="index === 2 || index === 3 || index === 4"
                  @click="setTop(index)"
                  >置顶</em
                >
              </div>
              <div class="choose-cont">
                <div class="el-col-15">
                  <el-input
                    type="textarea"
                    v-model="item.summary"
                    v-inputRule
                    maxlength="24"
                  ></el-input>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-button @click="confirm" type="dqx-btn">保存</el-button>
    <choose-cont
      ref="chooseCont"
      :showConn="showConn"
      @matchId="matchId"
      :isMain="isMain"
      :isUrl="true"
      @closePop="showConn = false"
    ></choose-cont>
    <!-- 图片选择器 -->
    <imgPop
      ref="imgPop"
      @cancel="cancelPop"
      v-if="isPopImg"
      @chooseItem="chooseItem"
      :isEdit="false"
    ></imgPop>
  </div>
</template>

<script>
import upload from "@/components/UploadImg/index";
import chooseCont from "@/components/Dialog/anchor";
import { getBanner, putBanner } from "@/api/live";
import imgPop from "@/views/common/img-list-cut.vue";
export default {
  data() {
    return {
      showConn: false, //显示关联弹窗
      chooseIndex: 0,
      tabList: ["上传图片", "历史记录"],
      bannerImg: [], //轮播预览
      isOpen: false,
      isPopImg: false,
      imgIndex: 0,
      isMain: true
    };
  },
  filters: {
    // 类型
    typeTxt(type) {
      let typeT = {
        "": "请选择",
        0: "文章",
        1: "比赛",
        2: "视频",
        3: "外链",
        4: "专家",
        6: "直播间"
      };
      return typeT[type];
    }
  },
  components: {
    upload,
    chooseCont,
    imgPop
  },
  methods: {
    // 关闭
    closePop() {
      this.showConn = false;
    },
    // 点击上传图片
    chooseImg(val) {
      this.imgIndex = val;
      this.isPopImg = true;
    },
    // 图片选择回调
    chooseItem(val) {
      console.log(val);
      this.bannerImg[this.imgIndex].image = val;
      this.isPopImg = false;
    },
    // 图片选择框取消
    cancelPop() {
      this.isPopImg = false;
    },
    // 更新banner信息
    confirm() {
      console.log(this.bannerImg)
      const isAll = this.bannerImg.find(item => item.image == "")
      if (isAll) {
        this.$message("请上传图片");
        return;
      }
      // this.bannerListInfo[0].isMain = true;
      // this.bannerListInfo[0].on = true;
      putBanner(this.bannerImg).then(_ => {
        this.$message("操作成功");
      });
    },
    // banner置顶
    setTop(val) {
      let topBanner = this.bannerImg[val];
      this.bannerImg.splice(val, 1);
      this.bannerImg.splice(1, 0, topBanner);
      console.log(this.bannerImg);
    },
    //   顶部tab
    chooseTab(val) {
      console.log(val);
    },
    // banner开关
    changeSwitch(val) {
      console.log(val);
    },
    // 图片上传
    upImg(e, val) {
      console.log(e, val);
      this.bannerImg[val].image = e;
      // console.log(val[0], val[1]);
    },
    // 选择关联内容
    getCont(val) {
      this.chooseIndex = val;
      this.isMain = val === 0 ? true : false;
      this.showConn = true;
    },
    //确定关联内容
    matchId(val) {
      console.log(3,val, this.bannerImg)
      this.bannerImg[this.chooseIndex].type = 6;
      this.bannerImg[this.chooseIndex].summary = val.topic;
      this.bannerImg[this.chooseIndex].url = null;
      this.bannerImg[this.chooseIndex].target = val.roomNumber;
      this.bannerImg[this.chooseIndex].image = val.logo || '';
      this.showConn = false;
    },
    // 获取banner列表
    getList() {
      getBanner().then(res => {
        this.bannerImg = [];
        res.data.map(e => {
          this.bannerImg.push({
            name: "banner",
            type: e.type,
            image: e.image,
            summary: e.summary,
            on: e.on,
            isMain: e.isMain,
            target: e.target,
            url: e.url,
            category: e.category
          });
        });
        let pushNull = 5 - res.data.length;
        for (let i = 0; i < pushNull; i++) {
          this.bannerImg.push({
            name: "banner",
            type: "",
            image: "",
            summary: "",
            on: false,
            isMain: false,
            target: "",
            url: "",
            category: null
          });
        }
        this.bannerImg[0].isMain = true;
        this.bannerImg[0].on = true;
      });
    }
  },
  mounted() {
    this.$store.commit("setPaging", false);
    this.getList();
  },
  computed: {
    bannerList() {
      return this.bannerImg.filter(res => {
        return res.on && res.image != "";
      });
    },
    bannerListInfo() {
      return this.bannerImg.filter(res => {
        return res.image != "";
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog__header {
  display: none;
}
.el-button {
  position: absolute;
  bottom: 50px;
  right: 100px;
}
.el-switch {
  display: inline-block;
  line-height: 40px;
}
// banner图关联内容
.banner-cont {
  height: 40px;
  line-height: 40px;
  width: 80px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 9px;
}
.banner-top {
  height: 40px;
  line-height: 40px;
}
// 测试
.banner {
  padding-left: 11vw;
  padding-top: 3vh;
  .choose-cont {
    display: block;
    div {
      em {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #eee;
      }
      span {
        display: block;
      }
    }
  }
  // /deep/.inputFlie {
  //   width: 11vw;
  //   height: 5.5vw;
  //   position: absolute;
  //   margin-left: -0vw;
  //   margin-top: -5.5vw;
  //   opacity: 0;
  //   z-index: 1;
  // }
  .upload-after {
    img {
      width: 11vw;
      height: 5.5vw;
    }
  }
  .upload-before {
    width: 11vw;
    height: 5.5vw;
    background: #f5f5f5;
    text-align: center;
    span {
      display: block;
    }
    .svg-icon {
      font-size: 39px;
      color: #adadad;
      margin-top: 1.3vw;
    }
  }
  .banner-show {
    width: 17vw;
    height: 35vw;
    padding-top: 3vw;
    padding-bottom: 5vw;
    background: url("~img/ic_phone.png") no-repeat center;
    background-size: 100%;
    text-align: center;
    overflow: hidden;
    .home-img {
      height: 18vw;
      overflow: hidden;
      img {
        width: 14.75vw;
        margin-top: -4vw;
      }
    }
    /deep/.el-carousel {
      width: 14.75vw;
      height: 8.7vw;
      margin-left: 1.1vw;
      .el-carousel__container {
        width: 14.75vw;
        height: 8.7vw;
        img {
          width: 14.75vw;
          height: 8.7vw;
        }
      }
      .el-carousel__button {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        padding: 0;
      }
    }
  }
}
</style>
