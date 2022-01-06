<template>
  <div class="video">
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList" v-if="isPublish === 0"></top-tab>
    <el-row class="tar">
      <el-input placeholder="请输入内容" v-model="keyworlds" v-inputRule maxlength="50" class="input-with-select"  @keyup.enter.native="setTitle">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="搜标题" value="1"></el-option>
          <el-option label="搜作者" value="2"></el-option>
        </el-select>
      </el-input>
      <el-button type="dqx-btn" @click="setTitle">搜索</el-button>
      <el-button @click="reSet" class="ml10">重置</el-button>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 310px)"
    >
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="isMaster ? del(scope.row.id) : back(scope.row.id)"
            v-if="isPublish === 1"
          >{{ isMaster ? '删除' : '撤回' }}</el-button>
          <el-button
            size="mini"
            type="text"
            @click="top(scope.row)"
            v-if="isPublish === 1"
          >{{scope.row.isTop ? '取消置顶' : '置顶'}}</el-button>
          <el-button size="mini" type="text" @click="handleEdit(scope.row.id)">查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="seeHistory(scope.row.id)"
            v-if="isPublish === 1 && isMaster"
          >查看记录</el-button>
        </template>
      </el-table-column>
       <el-table-column label="视频名称">
            <template slot-scope="scope"><em v-if="scope.row.isTop">置顶</em>{{ scope.row.title }}</template>
          </el-table-column>
      <el-table-column prop="author" label="视频作者" width="120"></el-table-column>
      <el-table-column prop="sourceLink" label="视频来源"></el-table-column>
      <el-table-column
        prop="countView"
        label="阅读量"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="countLike"
        label="点赞数"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="countComment"
        label="评论数"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column label="更新时间" width="200">
        <template slot-scope="scope">{{ (scope.row.updateTime || scope.row.createTime) | formatTime }}</template>
      </el-table-column>
      <el-table-column label="类型标签" width="200" v-if="isPublish">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.label.value"
            placeholder="请选择"
            class="mr30"
            @change="setTag($event,scope.row.id)"
          >
            <el-option
              v-for="item in optiontag"
              :key="item.value"
              :label="item.display"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="发布预览" :visible.sync="dialogVisible" :show-close="true">
      <div class="his-list" v-if="isHis">
        <div v-for="item in hisList" :key="item.id" @click="setDetail(item)" class="his-item cp">
          <span>
            <em>时间：{{item.actionTime | formatTime}}</em>
            <em class="ml20">
              状态：
              <em class="c84a">{{item.action.display}}</em>
            </em>
          </span>
          <span class="mt10">操作人员：{{item.actionUser.workName || item.actionUser.nickname}}</span>
        </div>
        <paging ref="paging" @changePage="changePage" :total="total" class="page-info"></paging>
      </div>
      <div class="cont-all" :class="{half:isHis}">
        <div class="c171 f18">
          频道：
          <span v-for="(item,index) in contInfo.channels" :key="index">{{item.channelName}} <i v-if="index != contInfo.channels.length - 1">,</i> </span>
        </div>
        <div class="c171 f20 mt20">{{contInfo.title}}</div>
        <div class="cada f16 mt10">{{contInfo.publishTime | formatTime}}</div>
        <div class="mt20" v-if="contInfo.cover">
          <img :src="contInfo.cover" alt="">
        </div>
        <video :src="contInfo.video" controls="controls" class="mt10" ></video>
      </div>

      <div slot="footer" class="dialog-footer tac" v-if="isPublish === 0&&status === 0">
        <el-button type="dqx-btn" @click="confirm(contInfo.id)">审核通过</el-button>
        <el-button @click="cancel(contInfo.id)">审核驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMedia,
  getMediaDet,
  delMedia,
  setMediaTop,
  delMediaTop,
  getLabels,
  setLabels,
  mediaPass,
  mediaDeny,
  getRecond,
  getRecovery
} from "@/api/newEdit";
import TopTab from "@/views/common/top-tab";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
import paging from "@/components/Paging/pop-index";
export default {
  data() {
    return {
      tabList: [{ name: "待审核", value: 0 }, { name: "驳回记录", value: 2 }],
      keyworlds: "",
      select: "1",
      title: "",
      name: "",
      isPublish: 0,
      status: 0,
      tableData: [],
      optiontag: [],
      dialogVisible: false,
      contInfo: "",
      hisList: [],
      isHis: false,
      pageHis: 1,
      total: 0,
      nid: 0,
      isLeader: true,
      isMaster: true
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  async created() {
    this.isPublish = this.$route.path.indexOf("check") > -1 ? 0 : 1;
    if (this.isPublish === 1) {
      this.status = 1;
    }
  },
  async mounted() {
    this.isMaster = this.roles.includes("COMMON_SETTING") ? true : false;
    this.isLeader = this.roles.includes(
      "APPLICATION_FOOTBALL",
      "APPLICATION_BASKETBALL"
    )
      ? true
      : false;
    this.getMedias();
    getLabels().then(res => {
      this.optiontag = res.data;
    });
    this.$store.commit("setPaging", true);
  },
  methods: {
    // 撤回
    async back(val) {
      this.$confirm("确认撤回？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getRecovery(val).then(_ => {
            this.$message("操作成功");
            this.getMedias();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },
    // 记录详情
    async setDetail(val) {
      this.contInfo = val;
    },
    // 记录页面切换
    async changePage(val) {
      this.pageHis = val;
    },
    // 查看记录
    async seeHistory(val) {
      this.isHis = true;
      this.nid = val;
      this.pageHis = 1;
      this.getReconds();
    },
    // 获取记录
    async getReconds() {
      getRecond({ nid: this.nid, page: this.pageHis }).then(res => {
        if (res.data.length > 0) {
          this.dialogVisible = true;
          this.hisList = res.data;
          this.contInfo = res.data[0];
          this.total = res.meta.pagination.total;
        } else {
          this.$message("暂无记录");
          return;
        }
      });
    },
    //   头部切换
    async chooseTab(val) {
      this.status = val;
      this.name = "";
      this.title = "";
    },
    // 获取列表数据
    async getMedias() {
      getMedia({
        category: 0,
        type: 2,
        title: this.title,
        name: this.name,
        status: this.status,
        isPublish: this.isPublish,
        page: this.page
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 关键字搜索
    async setTitle() {
      if (this.select === "1") {
        this.name = "";
        this.title = this.keyworlds;
      } else {
        this.title = "";
        this.name = this.keyworlds;
      }
    },
    // 详情
    async handleEdit(val) {
      this.isHis = false;
      getMediaDet(val).then(res => {
        this.contInfo = res.data;
        this.dialogVisible = true;
      });
    },
    // 置顶/取消置顶
    async top(val) {
      if (val.isTop) {
        delMediaTop(val.id).then(_ => {
          this.$message("操作成功");
          this.getMedias();
        });
      } else {
        setMediaTop(val.id).then(_ => {
          this.$message("操作成功");
          this.getMedias();
        });
      }
    },
    // 删除
    async del(val) {
      this.$confirm("确认解封该账户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delMedia(val).then(_ => {
            this.$message("操作成功");
            this.getMedias();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 标签
    async setTag(val, e) {
      setLabels(e, val).then(res => {
        this.$message("操作成功");
      });
    },
    // 审核通过
    async confirm(val) {
      mediaPass(val).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMedias();
      });
    },
    // 审核驳回
    async cancel(val) {
      mediaDeny(val).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getMedias();
      });
    },
    // 重置条件
    async reSet() {
     this.name = '',
     this.title = '',
     this.keyworlds = ''
    }
  },
  components: {
    TopTab,
    paging
  },
  computed: {
    ...mapGetters(["page", "roles"]),
    dataList() {
      return [this.name, this.title, this.status];
    },
    hisData() {
      return [this.nid, this.pageHis];
    }
  },
  watch: {
    dataList(newVal) {
      this.$store.commit("setPage", 1);
      this.getMedias();
    },
    page(newVal) {
      //   重新获取列表
      this.getMedias();
    },
    hisData(newVal) {
      this.getReconds();
    }
  }
};
</script>
<style lang="scss" scoped>
 em{
    color: #18CE94;
    display: inline-block;
    margin-right: 5px;;
  }
/deep/.el-input-group__prepend {
  position: absolute;
  margin-top: 0px;
  line-height: 40px;
  width: 100px;
  height: 40px;
  z-index: 9;
  border-radius: 0;
}
.el-input {
  display: inline-block;
  width: calc(40% - 100px);
  margin-right: 100px;
}
/deep/.el-input-group > .el-input__inner {
  margin-left: 100px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/deep/.el-dialog {
  margin-top: 5vh !important;
  height: 90vh;
}
.cont-all {
  height: calc(80vh - 80px);
  overflow-y: scroll;
  width: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
}
.cont-det {
  line-height: 25px;
}
video {
  width: 100%;
}
.cover-img {
  img {
    height: 100px;
  }
}
/deep/.el-dialog__body {
  display: flex;
}
.his-list {
  display: inline-block;
  width: 48%;
  margin-right: 2%;
}
.half {
  display: inline-block;
  width: 50%;
}
.his-list span {
  display: block;
}
.his-item {
  padding: 10px 0;
}
.his-item + .his-item {
  border-top: 1px solid #f2f2f2;
}
.page-info {
  position: absolute;
  width: 70%;
  bottom: 10px;
  margin-left: -5%;
}
</style>