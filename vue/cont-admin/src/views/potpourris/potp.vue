<template>
      <!-- 内容模块 -->
      <div class="cont">
        <!-- 左侧编辑区域 -->
        <div class="left">
          <div>
            标题：<el-input
              placeholder="请输入50字以内的标题"
              maxlength="50"
              v-model="itemInfo.title"
            ></el-input>
          </div>
          <div class="mt20">
            标签：<el-input
              v-model="itemInfo.tag"
              maxlength="8"
              placeholder="请输入4字以内的标签"
            ></el-input>
          </div>
          <div class="history mt20">
            历史：<em
              class="mr20 cp"
              @click="itemInfo.tag = item"
              v-for="(item, index) in hisList"
              :key="index"
              >{{ item }}</em
            >
          </div>
          <div class="mt20">
            封面图：
            <span
              class="upload-before"
              v-if="itemInfo.cover == ''"
              @click="isPopImg = true"
            >
              <svg-icon icon-class="tupian"></svg-icon>
              <span class="f14 cada">320*200</span>
            </span>
            <span
              class="upload-after"
              v-if="itemInfo.cover != ''"
              @click="isPopImg = true"
            >
              <img :src="itemInfo.cover" alt />
            </span>
          </div>

          <div class="mt20">
            来源：<el-radio v-model="type" label="0">外链</el-radio>
            <el-radio v-model="type" label="1">本地上传</el-radio>
          </div>
          <div class="mt20">
            链接：<el-input v-model="itemInfo.url"></el-input>
            <div class="ml20">
              <el-button type="text" class="ml20">本地上传</el-button>
              <uploadI ref="uploadI" @finishUp="upVideo"></uploadI>
            </div>
          </div>
          <div class="tac mt20">
            <el-button @click="getLive">获取三方集锦</el-button>
            <el-button
              type="dqx-btn"
              @click="dialogStatus === 'create' ? createData() : updateData()"
              >{{ dialogStatus === "create" ? "添加" : "修改" }}</el-button
            >
          </div>
        </div>
        <!-- 右侧列表 -->
        <div class="right ml20">
          <div class="mb20">集锦列表</div>
          <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%"
            height="calc(70vh - 200px)"
          >
            <el-table-column
              prop="title"
              label="标题"
              width="250"
            ></el-table-column>
            <el-table-column label="添加时间" width="150"
              ><template slot-scope="scope">{{
                scope.row.createdAt | formatTime
              }}</template></el-table-column
            >
            <el-table-column prop="tag" label="标签"></el-table-column>
            <el-table-column prop="views" label="观看人数" width="200"></el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <div v-if="scope.row.id">
                <el-button size="mini" type="text" @click="edit(scope.row)"
                   >编辑</el-button
                >
                <el-button
                  @click="move(scope.row.id, 'up')"
                  type="text"
                  size="small"
                  >上移</el-button
                >
                <el-button
                  @click="move(scope.row.id, 'down')"
                  type="text"
                  size="small"
                  >下移</el-button
                >
                <el-button
                  @click="move(scope.row.id, 'top')"
                  type="text"
                  size="small"
                  >置顶</el-button
                >
                <el-button size="mini" type="text" @click="del(scope.row.id)"
                 
                  >删除</el-button
                >
                </div>
                <div v-if="!scope.row.id">
                  <el-button size="mini" type="text" @click="editNew(scope.$index,scope.row)"
                  >编辑</el-button
                >
                <em class="tips">未保存源，退出后将清空</em></div>
              </template>
               <!-- <template slot-scope="scope" v-if="!scope.row.id">
                 <el-button size="mini" type="text" @click="editNew(scope.row)"
                  >编辑</el-button
                >
                <em class="tips">未保存源，退出后将清空</em>
                
               </template> -->
            </el-table-column>
          </el-table>
        </div>
    <!-- 图片选择器 -->
    <imgPop
      ref="imgPop"
      @cancel="isPopImg = false"
      v-if="isPopImg"
      @chooseItem="chooseItem"
      :isEdit="true"
      :widthNum="16"
      :heightNum="10"
      style="z-index:9999"
    ></imgPop>
      </div>
</template>
<script>
import {
  getSimple,
  getSource,
  addSource,
  putSource,
  delSource,
  refreshMatch
} from "@/api/setting";
import { getMatches, getMatchesReport } from "@/api/public";
import { formatTime } from "@/utils/index.js";
import {
  getPotp,
  addPotp,
  putPotp,
  delPotp,
  sortPotp,
  fixPop,
  movePop,
  getThirdPop
} from "@/api/potpourris";
import imgPop from "@/views/common/img-list-cut.vue";
import uploadI from "@/components/UploadVideo/index";
export default {
  props:{
    liveId:{
      type: Number
    }
  },
  data(){
    return{
      dialogStatus: "create", //修改|新增
      type: "0",
      list: [], //集锦列表
      hisList: [],
      isPopImg: false,
      itemInfo: { tag: "", title: "", url: "", cover: "" },
      showList:[],
      addList:[]
    }
  },
  components:{
    uploadI,
    imgPop
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  mounted(){
    this.getpotp(this.liveId)
    if (localStorage.getItem("his")) {
      this.hisList = JSON.parse(localStorage.getItem("his"));
    }
  },
  methods:{
    // 获取三方直播源
    getLive(){
      // 
      this.showList = []
      this.list = []
      getThirdPop(this.liveId).then(res => {
        res.data.map(e => {
          let tags = e.type == 2 ? '录像' : '集锦';
          this.list.unshift({ tag: tags, title: e.title, url: e.mobile_link, cover: e.cover,createdAt:e.created_at*1000,views: 0,type:{
            display:'外链',
            value:0
          } })
        })
      })
      this.list =  this.list.concat(this.addList)
    },
    // 图片选择回调
    chooseItem(val) {
      console.log(val);
      this.itemInfo.cover = val;
      this.isPopImg = false;
    },
    // 视频上传
    async upVideo(val) {
      this.type = "1";
      this.itemInfo.url = val;
    },
    // 获取集锦列表
    async getpotp(val) {
      getPotp(val).then(res => {
        this.addList = res.data;
        this.list = this.addList
      });
    },
    // 集锦编辑
    async edit(val) {
      console.log(val)
      this.dialogStatus = "update";
      this.potpId = val.id;
      this.itemInfo.title = val.title;
      this.itemInfo.tag = val.tag;
      this.itemInfo.url = val.url;
      this.itemInfo.cover = val.cover;
      this.type = val.type.value === 0 ? "0" : "1";
    },
    async editNew(e,val){
      console.log(val)
      this.dialogStatus = "create";
      this.itemInfo.title = val.title;
      this.itemInfo.tag = val.tag;
      this.itemInfo.url = val.url;
      this.itemInfo.cover = val.cover;
      this.type = val.type.value === 0 ? "0" : "1";
       this.list.splice(e, 1);
    },
    // 新增
    createData() {
      const isSame = this.list.filter(
        item =>
          item.title === this.itemInfo.title || item.url === this.itemInfo.url
      );
      if (isSame.length > 0) {
        this.$message("已经存在相同标题或链接");
        return;
      }
      if (
        !this.hisList.includes(this.itemInfo.tag) &&
        this.itemInfo.tag != ""
      ) {
        this.hisList.unshift(this.itemInfo.tag);
      }
      let hisList = [];
      if (this.hisList.length > 5) {
        hisList = this.hisList.splice(0, 5);
      } else {
        hisList = this.hisList;
      }
      localStorage.setItem("his", JSON.stringify(hisList));
      let type = this.type === "0" ? 0 : 1;
      addPotp(this.liveId, {
        title: this.itemInfo.title,
        url: this.itemInfo.url,
        tag: this.itemInfo.tag,
        type: type,
        cover: this.itemInfo.cover
      }).then(_ => {
        this.$message("操作成功");
        this.itemInfo.title = "";
        this.itemInfo.tag = "";
        this.itemInfo.url = "";
        this.itemInfo.cover = "";
        this.type = "0";
        this.getpotp(this.liveId);
      });
    },
    // 修改
    updateData() {
      if (
        !this.hisList.includes(this.itemInfo.tag) &&
        this.itemInfo.tag != ""
      ) {
        this.hisList.unshift(this.itemInfo.tag);
      }
      let hisList = [];
      if (this.hisList.length > 5) {
        hisList = this.hisList.splice(0, 5);
      } else {
        hisList = this.hisList;
      }
      localStorage.setItem("his", JSON.stringify(hisList));
      let type = this.type === "0" ? 0 : 1;
      putPotp(this.potpId, {
        title: this.itemInfo.title,
        url: this.itemInfo.url,
        tag: this.itemInfo.tag,
        type: type,
        cover: this.itemInfo.cover
      }).then(_ => {
        this.$message("操作成功");
        this.itemInfo.title = "";
        this.itemInfo.tag = "";
        this.itemInfo.url = "";
        this.itemInfo.cover = "";
        this.type = "0";
        this.getpotp(this.liveId);
        this.dialogStatus = "create";
      });
    },
    // 删除数据
    del(val) {
      delPotp(val).then(_ => {
        this.$message("已删除");
        this.getpotp(this.liveId);
      });
    },
    // 移动频道
    move(e, val) {
      console.log(e, val);
      movePop(e, val).then(_ => {
        this.$message("操作成功");
        this.getpotp(this.liveId);
      });
    },
    // 修复集锦排序
    getNewPop() {
      fixPop().then(res => {
        this.list = res.data;
      });
    }
  },
  computed:{
    urlList() {
      return this.list.filter(res => {
        return res.url != "" && res.name != "";
      });
    },
  },
  watch:{
    liveId(newVal){
      this.list = []
      this.addList = []
      this.showList = []
      this.getpotp(newVal)
    }
  }
}
</script>
<style lang="scss" scoped>
.cont {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.tab-name {
  display: inline-block;
  padding: 0 20px;
}
.tips{
  color: #adadad;
  font-size: 12px;
}
.list {
  max-height: 500px;
  overflow-y: scroll;
}
.tab-name + .tab-name {
  border-left: 1px solid #d0d0d0;
}
.left {
  width: 45vw;
}
.right {
  width: calc(55vw - 40px);
}
.el-input {
  width: calc(100% - 150px);
}
.el-date-editor {
  width: 250px;
}
/deep/.inputFlieV {
  position: absolute;
  margin-top: -35px;
  width: 80px;
  // margin-left: 80px;
  z-index: 9;
  opacity: 0;
}
.history em {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.upload-after {
  display: inline-block;
  img {
    width: 8vw;
    height: 5vw;
  }
}
.upload-before {
  display: inline-block;
  width: 8vw;
  height: 5vw;
  background: #f5f5f5;
  text-align: center;
  span {
    display: block;
  }
  .svg-icon {
    font-size: 39px;
    color: #adadad;
    margin-top: 1.2vw;
  }
}
</style>