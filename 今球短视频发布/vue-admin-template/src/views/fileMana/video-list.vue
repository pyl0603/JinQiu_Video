<template>
  <div class="file-mana">
    <el-row>
      <div class="el-col-12 f16 cada">
         <!-- <el-date-picker
          v-model="dayTime"
          type="date"
          placeholder="选择日期"
          @change="changes"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker> -->
        <el-button type="dqx-btn" class="ml20">直接上传</el-button>
        <uploadI class="btn"  ref="uploadI" @upVideo="upImg" :isEdit="true"></uploadI>
      </div>
      <!-- <div class="el-col-12 tar">
        搜索：
        <el-input class="mr20" v-model="keyWorld" v-inputRule></el-input>
        <el-button type="dqx-btn" @click="sear">搜索</el-button>
      </div> -->
    </el-row>
    <!-- 查询结果 -->
    <!-- <el-row v-if="!isList">
      <div class="no-res" v-if="imgList.length === 0">暂无数据</div>
      <el-col :span="4" v-for="(items,index) in imgList" :key="index" class="mr20 mt20 forc">
        <video :src="items.fullVideoPath" class="img-list"></video>
        <span class="img-name">{{items.videoName | formatName}}</span>
      </el-col>
    </el-row>-->
    <!-- 列表 -->
    <Item ref="Item" :page="pages" :upDate="upDate" v-if="isList"></Item>
  </div>
</template>
<script>
import { getVideoDate, getVideoList } from "@/api/edit";
import { getOssVideos } from "@/api/oss";
import { mapGetters } from "vuex";
import uploadI from "@/components/UploadVideo/index";
import Item from './item-video.vue'
export default {
  data() {
    return {
      keyWorld: "",
      activeNames: [0],
      matList: [],
      keys: "",
      isList: true,
      day: "",
      dayTime: "",
      imgList:'',
      pages:1,
      upDate:false
    };
  },
  filters: {
    formatName(name) {
      let str = ''
      const patt = new RegExp(/^\d{13}/)
      if (19 < name.length) {
        str = name.slice(17)
        if (patt.test(str)) {
          str = str.slice(14)
        }
      }
      return str
    }
  },
  components:{
    uploadI,
    Item
  },
  methods: {
    // 图片上传
    upImg(val){
      this.$message("上传成功")
      this.isList = true;
      this.upDate = !this.upDate;
    },
    // 变化
    // async changes(val) {
    //   this.isList = false;
    //    if(val == null || val == ''){
    //     this.isList = true;
    //     return
    //   }
    //   this.day = val;
    //   this.imgList = await this.getVideoLists()
    //   this.$store.commit("setPaging", false);
    // },
    // 搜索
    async sear() {
      this.isList = false;
      this.keys = this.keyWorld;
      // this.imgList = await this.getVideoLists();
      this.$store.commit("setPaging", false);
    },
    // 获取图片列表
    // getImg() {
    //   getVideoLists({ day: this.day, content: this.keys });
    // },
    // 获取图片列表(折叠时)
    async getVideoLists() {
      return new Promise((resolve, reject) => {
        // getVideoList({ day: this.day, content: this.keys }).then(res => {
        //   return resolve(res.data);
        // });
         getOssVideos(this.dayTime).then(res => {
          return resolve(res.data);
        });
      });
    },
    // 列表赋值
    async itemsData(val) {
      let imgItem = await this.getVideoLists();
      let item = this.matList[val];
      item.list = imgItem;
      this.$set(this.matList, val, item);
    }
  },
  async mounted() {
    this.$store.commit("setPaging", true);
  },
  computed: {
    ...mapGetters(["page"]),
    dataList() {
      return [this.keys, this.day];
    }
  },
  watch: {
    page(newVal) {
      this.pages = newVal;
    },
    dataList(newVal) {
      this.getVideoLists();
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.inputFlieV {
  position: absolute;
  margin-top: -40px;
  margin-left: 240px;
  height: 40px;
  width: 100px;
  opacity: 0;
    }
.file-mana {
  .no-res{
    height: 50px;
    line-height: 50px;
    margin-top: 100px;
    text-align: center;
  }
  .file-main {
    border: 1px solid #f5f5f5;
    padding: 0 20px;
  }
  .file-top {
    height: 60px;
    line-height: 60px;
    background: #f5f5f5;
    padding: 0 20px;
  }
  .folder {
    padding: 40px 0;
  }
  .folder div {
    display: inline-block;
    width: 76px;
    text-align: center;
    /deep/.el-checkbox__input {
      position: absolute;
      margin-top: 61px;
      margin-left: 61px;
    }
    span {
      display: block;
      width: 100%;
    }
    img {
      width: 76px;
      height: 76px;
    }
  }
  .img-list {
    width: 100%;
    height: 150px;
  }
  .el-input {
    display: inline-block;
    width: calc(70% - 240px);
  }
  /deep/.hasUp .el-breadcrumb__inner {
    color: #18ce94;
  }
  
.el-date-editor.el-input{
  width: 220px;
}
.img-name{
  word-break: break-all;
  display: block;
  text-align: center;
}
.btn {
    position: absolute;
    left: 0;
    top: 0;
  }
  /deep/.inputFlieV {
    margin: 0;
    left: 20px;
  }
}
</style>

