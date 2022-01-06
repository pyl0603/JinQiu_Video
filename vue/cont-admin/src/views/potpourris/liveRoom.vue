<template>
  <div class="source">
    <div class="el-col-24">
      <div class="el-col-24 cada f14 tar">
        频道选择：
        <el-select v-model="competition" placeholder="请选择" class="mr20">
          <el-option
            v-for="item in tabList"
            :key="item.id"
            :label="item.name"
            :value="item.competitionId"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="refreshDate"
          type="date"
          value-format="timestamp"
          placeholder="刷新比赛日期选择"
        >
        </el-date-picker>
        <el-date-picker
          v-model="dataRang"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="change"
          @pick="pick"
          align="right"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 280px)"
    >
      <el-table-column label="比赛日期" width="200">
        <template slot-scope="scope">{{
          scope.row.startAt | formatTime
        }}</template>
      </el-table-column>
      <el-table-column prop="competitionName" label="联赛"></el-table-column>
      <el-table-column label="比赛" width="400">
        <template slot-scope="scope"
          >{{ scope.row.homeTeamName }}VS{{ scope.row.awayTeamName }}</template
        >
      </el-table-column>
      <el-table-column
        prop="customStatusDesc"
        label="直播状态"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="liveSourceNum"
        label="直播源数量"
      ></el-table-column>
      <el-table-column prop="potpourriNum" label="集锦数量"></el-table-column>
      <el-table-column prop="reportsNum" label="战报数量"></el-table-column>
      <el-table-column label="功能" width="400">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="advUrl(scope.row.id)"
            >广告链接</el-button
          >
          <el-button size="mini" type="text" @click="setSource(scope.row.id)"
            >直播源设置</el-button
          >
          <el-button size="mini" type="text" @click="set(scope.row.id)"
            >集锦设置</el-button
          >
          <el-button size="mini" type="text" @click="addReport(scope.row)">{{
            scope.row.reportsNum == 0 ? "添加战报" : "战报详情"
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog
      width="70%"
      title="集锦设置"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <Potp ref="Potp" :liveId="liveId"></Potp>
      <div slot="footer" class="dialog-footer tac">
        <el-button @click="cancel()" type="dqx-btn">关闭弹窗</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog
      title="直播源设置"
      :visible.sync="dialogVisibleSource"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
    >
    <Sources ref="Source" :liveId="liveId" :isAddSour="isAddSour" @cancel="cancel"></Sources>
    </el-dialog>
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
import {
  getPotp,
  addPotp,
  putPotp,
  delPotp,
  sortPotp,
  fixPop,
  movePop
} from "@/api/potpourris";
import { setMatchScore } from "@/api/match";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
import Cookies from "js-cookie";
import imgPop from "@/views/common/img-list-cut.vue";
import { getCategory } from "@/utils/auth";
import uploadI from "@/components/UploadVideo/index";
import Potp from "./potp.vue";
import Sources from "./source.vue"
export default {
  data() {
    let _this = this;
    return {
      dataRang: [
        new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24 -
          1000
      ], //  时间选择
      tableData: [], //列表
      dialogVisible: false, //弹窗
      dialogVisibleSource: false, //弹窗
      tabList: [], //频道列表
      itemIndex: 0,
      competition: 0, //频道id
      start: new Date(new Date().toLocaleDateString()).getTime(), //开始时间
      end:
        new Date(new Date().toLocaleDateString()).getTime() +
        3600 * 1000 * 24 -
        1000, //结束时间
      liveId: 0,
      potpId: 0,
      isNull: true,
      isAdd: true,
      isAddSour:true,
      refreshDate: "", //刷新数据
      isPopImg: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
              _this.start = new Date(new Date().toLocaleDateString()).getTime();
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime() +
                3600 * 1000 * 24 -
                1000;
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "三天内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 72);
              picker.$emit("pick", date);
              _this.start =
                new Date(new Date().toLocaleDateString()).getTime() -
                3600 * 1000 * 24 * 3;
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime() +
                3600 * 1000 * 24 -
                1000;
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "一周内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
              _this.start =
                new Date(new Date().toLocaleDateString()).getTime() -
                3600 * 1000 * 24 * 7;
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime() +
                3600 * 1000 * 24 -
                1000;
              _this.dataRang = [_this.start, _this.end];
            }
          }
        ]
      }
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components: {
    uploadI,
    Potp,
    Sources,
    imgPop
  },
  created() {
    // setInterval(() => {
    //   debugger
    // },0)
  },
  mounted() {
    this.getChannel();
    this.$store.commit("setPaging", true);
  },
  methods: {
    // 生成分享链接
    advUrl(val) {
      if (Cookies.get("Category") == 0) {
        this.copy("https://m.jinqiulive.com/fball.html?id=" + val);
      } else {
        this.copy("https://m.jinqiulive.com/bball.html?id=" + val);
      }
    },
    copy(data) {
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "复制成功",
        type: "success"
      });
      oInput.remove();
    },
    // 集锦设置
    set(val) {
      this.liveId = val;
      console.log(this.liveId);
      this.dialogVisible = true;
      // this.getpotp(val);
    },
    // 直播源设置
    setSource(val) {
      this.liveId = val;
      this.isAddSour = !this.isAddSour
      this.dialogVisibleSource = true;
      // this.getSources(val);
    },
    
    // 取消
    cancel() {
      this.dialogVisible = false;
      this.dialogVisibleSource = false;
      this.getMatche();
    },
    // 新增战报
    async addReport(val) {
      let name = `${val.homeTeamName}VS${val.awayTeamName}`;
      if (val.reportsNum == 1) {
        let { data } = await getMatchesReport(val.id);
        this.$router.push({
          path: "/addCont/index",
          query: {
            matchId: val.id,
            name: name,
            times: val.startAt,
            id: data.id
          }
        });
        return;
      }
      this.$router.push({
        path: "/addCont/index",
        query: { matchId: val.id, name: name, times: val.startAt }
      });
    },
    // 历史记录的缓存(暂无)
    // 日期选择
    change(val) {
      console.log(val);
      this.start = val[0];
      this.end = val[1] + 3600 * 1000 * 24 - 1000;
    },
    pick(val) {
      console.log(val);
    },

    // 频道切换
    tabChoose(val, e) {
      this.itemIndex = val;
      this.competition = e.competitionId;
      this.$store.commit("setPage", 1);
    },
    // 获取频道列表
    getChannel() {
      getSimple().then(res => {
        let all = [{ competitionId: "", name: "全部", id: "" }];
        this.tabList = all.concat(res.data);
        this.competition = this.tabList[0].competitionId;
        console.log(this.competition);
      });
    },
    // 获取精选赛事
    getMatche() {
      getMatches({
        competition: this.competition,
        start: this.start,
        end: this.end,
        page: this.page,
        asc: 1
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    }
  },
  computed: {
    ...mapGetters(["page"]),
    dataList() {
      return [this.competition, this.start, this.end];
    },
  },
  watch: {
    dataList(newVal) {
      this.$store.commit("setPage", 1);
      this.getMatche();
    },
    page(newVal) {
      this.getMatche();
    },
    dataRang(newVal) {
      console.log(newVal);
    },
    refreshDate(newVal) {
      let month,
        date = "";
      if (new Date(newVal).getMonth() + 1 < 10) {
        month = 0 + (new Date(newVal).getMonth() + 1).toString();
      } else {
        month = (new Date(newVal).getMonth() + 1).toString();
      }
      if (new Date(newVal).getDate() < 10) {
        date = 0 + new Date(newVal).getDate().toString();
      } else {
        date = new Date(newVal).getDate().toString();
      }
      let times = new Date(newVal).getFullYear().toString() + month + date;
      refreshMatch(times).then(res => {
        this.start = newVal;
        this.end = newVal + 3600 * 1000 * 24 - 1000;
        this.$store.commit("setPage", 1);
      });
    }
  }
};
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
