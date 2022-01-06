<template>
  <div>
    <el-row>
      <el-col :span="12">
        选择查看日期：
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
      </el-col>
      <el-col :span="12" class="tar">
        <el-button
          @click="(dialogVisibleSource = true), (currentTab = 'Custom')"
          >创建比赛</el-button
        >
        <el-button @click="(dialogVisibleSource = true), (currentTab = 'Draw')"
          >抽签直播</el-button
        >
        <el-button
          type="dqx-btn"
          @click="(dialogVisibleSource = true), (currentTab = 'Item')"
          >导入比赛</el-button
        >
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 280px)"
      class="mt20"
    >
      <el-table-column label="开赛时间" width="200">
        <template slot-scope="scope">{{
          scope.row.matchTime | formatTime
        }}</template>
      </el-table-column>
      <el-table-column label="联赛" prop="competition"> </el-table-column>
      <el-table-column label="比赛">
        <template slot-scope="scope">
          <span v-if="scope.row.type.value === 98">{{ scope.row.title }}</span>
          <span v-if="scope.row.type.value != 98"
            >{{ scope.row.home.name }} VS {{ scope.row.away.name }}</span
          >
        </template>
      </el-table-column>
      <!-- <el-table-column label="变更比赛状态" >
        <template slot-scope="scope" v-if="scope.row.type.value != 0">
          <el-select
            v-model="scope.row.status.value"
            placeholder="请选择"
            @change="changes($event,scope.row.id)"
          >
            <el-option
              v-for="item in option"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="关联话题">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.communities" :key="index" v-if="index < 3">{{item.name}}  </span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" danger @click="del(scope.row.id)"
            >移除</el-button
          >
          <el-button type="text" @click="edit(scope.row)" v-if="scope.row.type.value === 99">编辑比分</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增/编辑 -->
    <el-dialog
      title="添加比赛"
      :visible.sync="dialogVisibleSource"
      width="60%"
      :show-close="true"
      :close-on-click-modal="false"
      :before-close="handleClose"
      style="margin-top:-8vh"
    >
      <item
        :is="currentTab"
        ref="Item"
        :dataList="commonData"
        @succeed="succeed"
      ></item>
    </el-dialog>
    <el-dialog
      title="编辑比分"
      :visible.sync="dialogVisibleScore"
      width="60%"
      :show-close="true"
      :close-on-click-modal="false"
      style="margin-top:-8vh"
      class="score-pop"
    >
    <div>主队比分：<el-input placeholder="主队比分" v-model="home"></el-input></div>
    <div>客队比分：<el-input placeholder="客队比分" class="mt20" v-model="away"></el-input></div>
    <div slot="footer" class="dialog-footer tac">
      <el-button @click="confirmScore()" type="dqx-btn">确认修改</el-button>
    </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatTime } from "@/utils/index.js";
import { getCommonMatch, delCommonMatch ,setMatchStatus, setMatchScore} from "@/api/match.js";
import { mapGetters } from "vuex";
import Item from "./add";
import Custom from "./addCustom";
import Draw from "./addDraw";
export default {
  data() {
    let _this = this;
    return {
      currentTab: "Item",
      dialogVisibleScore: false,
      home:0,
      away:0,
      scoreMatchId: null,
      // 自定义比赛数据
      commonData: {
        draw: false,
        self: false,
        status: 0,
        competition: "",
        logo: "",
        title: "",
        subject: "",
        matchTime: 0,
        home: {
          name: "",
          logo: ""
        },
        away: {
          name: "",
          logo: ""
        },
        score: {
          home: 0,
          away: 0
        },
        stage: {
          competition: "", //赛事阶段描述
          match: "" //比赛阶段描述
        }
      },
      option: [{ key: 0, name: "未开始" },{ key: 1, name: "进行中" },{ key: 2, name: "比赛结束" },{ key: 3, name: "异常" }],
      tableData: [],
      dialogVisibleSource: false,
      dataRang: [
        new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24 -
          1000
      ], //  时间选择
      start: new Date(new Date().toLocaleDateString()).getTime(), //开始时间
      end:
        new Date(new Date().toLocaleDateString()).getTime() +
        3600 * 1000 * 24 -
        1000, //结束时间
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
  components: {
    Item,
    Custom,
    Draw
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  mounted() {
    this.$store.commit("setPaging", true);
    this.getIndex();
  },
  methods: {
    succeed(){
      this.getIndex();
      this.dialogVisibleSource = false;
    },
    // 关闭前回调
    handleClose() {
      this.getIndex();
      this.dialogVisibleSource = false;
    },
    // 编辑
    edit(val) {
      this.dialogVisibleScore = true
      this.home = val.score.home
      this.away = val.score.away
      this.scoreMatchId = val.id
    },
    confirmScore () {
      setMatchScore(this.scoreMatchId,{home:this.home,away:this.away}).then(res => {
        this.$message('修改成功')
        this.getIndex()
        this.dialogVisibleScore = false
      })
      console.log()
    },
    // 获取热门比赛
    getIndex() {
      getCommonMatch({
        page: this.page,
        page_size: 10,
        start: this.start,
        end: this.end
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    changes(e,val){
      setMatchStatus(val,e).then(_ => {
        this.$message("操作成功")
      })
    },
    // 日期选择
    change(val) {
      console.log(val);
      this.start = val[0];
      this.end = val[1] + 3600 * 1000 * 24 - 1000;
    },
    pick(val) {
      console.log(val);
    },
    // 移除
    del(val) {
      this.$confirm("确认移除该场比赛？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCommonMatch(val).then(_ => {
            this.$message("操作成功");
            this.getIndex();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  },
  computed: {
    ...mapGetters(["page"]),
    dataList() {
      return [this.start, this.end];
    }
  },
  watch: {
    page() {
      this.getIndex();
    },
    dataList() {
      if (this.page != 1) {
        this.page = 1;
      } else {
        this.getIndex();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-select {
  width: 250px;
}
.score-pop .el-input{
  width: calc(100% - 100px);
}
</style>
