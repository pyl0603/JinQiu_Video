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
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
    <Sources ref="Source" :liveId="liveId" @cancel="cancel"></Sources>
    </el-dialog>
  </div>
</template>
<script>
import { formatTime } from "@/utils/index.js";
import { getCommonMatch, delHotMatch } from "@/api/match.js";
import { getMatchesReport } from '@/api/public.js'
import Cookies from "js-cookie";
import { mapGetters } from "vuex";
import Potp from "./potp.vue";
import Sources from "./source.vue"
export default {
  data() {
    let _this = this;
    return {
      tableData: [],
      liveId: 0,
      dialogVisible: false, //弹窗
      dialogVisibleSource: false, //弹窗
      dataRang: [
        new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24 -
          1000
      ], //  时间选择
      start: new Date(new Date().toLocaleDateString()).getTime(), //开始时间
      end:
        new Date(new Date().toLocaleDateString()).getTime() -
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
    Potp,
    Sources,
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
    // 关闭前回调
    handleClose() {
      this.getIndex();
      this.dialogVisibleSource = false;
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
      this.dialogVisibleSource = true;
      // this.getSources(val);
    },
    
    // 取消
    cancel() {
      this.dialogVisible = false;
      this.dialogVisibleSource = false;
      this.getIndex();
    },
    // 新增战报
    async addReport(val) {
      let name = `${val.title}` ||`${val.home.name}VS${val.away.name}`;
      if (val.reportsNum == 1) {
        let { data } = await getMatchesReport(val.id);
        this.$router.push({
          path: "/addCont/index",
          query: {
            matchId: val.id,
            name: name,
            times: val.matchTime,
            id: data.id
          }
        });
        return;
      }
      this.$router.push({
        path: "/addCont/index",
        query: { matchId: val.id, name: name, times: val.startAt||val.matchTime }
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
</style>
