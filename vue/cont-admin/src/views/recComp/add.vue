<template>
  <div>
    <el-row>
      <el-col :span="24" class="for-flex tar">
        搜索联赛：
        <el-select
          class="mr20"
          v-model="value"
          filterable
          remote
          reserve-keyword
          placeholder="请输入联赛名称，限10字"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        开赛日期：
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
        <el-button class="ml10 mr30" type="dqx-btn" @click="search">搜索</el-button>
        <el-date-picker
          v-model="refreshDate"
          type="date"
          value-format="timestamp"
          placeholder="刷新比赛日期选择"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 400px)"
      class="mt20"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="开赛时间">
        <template slot-scope="scope">{{
          (scope.row.match_time || scope.row.matchTime) | formatTime
        }}</template>
      </el-table-column>
      <el-table-column label="主队">
        <template slot-scope="scope">{{
          scope.row.homeTeamName || scope.row.home.name_zh
        }}</template>
      </el-table-column>
      <el-table-column label="客队">
        <template slot-scope="scope">{{
          scope.row.awayTeamName || scope.row.away.name_zh
        }}</template>
      </el-table-column>
      <!-- <el-table-column
      label="对阵球队"
      >
      <template slot-scope="scope">{{ scope.row.homeTeamName }}VS{{ scope.row.awayTeamName }}</template>
    </el-table-column> -->
    </el-table>
    <paging
      ref="paging"
      @changePage="changePage"
      :total="total"
      :pageSize="20"
      :currentPage="currentPage"
      style="margin-top:10px"
    ></paging>
    <div class="tar mt20">
      <el-button type="dqx-btn" style="width:140px" @click="add"
        >添加</el-button
      >
    </div>
    <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button> -->
  </div>
</template>

<script>
import { getCompetitions, getMatch, addExistMatch } from "@/api/match.js";
import { refreshMatch } from "@/api/setting";
import { formatTime } from "@/utils/index.js";
import paging from "@/components/Paging/pop-index";
export default {
  data() {
    let _this = this;
    return {
      refreshDate: "", //刷新数据
      dataRang: [
        new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24 -
          1000
      ], //  时间选择
      start: new Date(new Date().toLocaleDateString()).getTime(), //开始时间
      end:
        new Date(new Date().toLocaleDateString()).getTime() +
        3600 * 1000 * 24 +
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
      },
      tableData: [],
      multipleSelection: [],
      options: [],
      value: "",
      list: [],
      loading: false,
      page: 1,
      total: 0,
      currentPage: 1
    };
  },
  filters: {
    formatTime(time) {
      let times;
      if ((time + "").length === 10) {
        times = time * 1000;
      } else {
        times = time;
      }
      var date = new Date(times);
      return formatTime(date);
    }
  },
  methods: {
    toggleSelection(rows) {
      console.log(rows);
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    getList() {
      getMatch({
        competition: this.value,
        start: this.start,
        end: this.end,
        page: this.page,
        page_size: 20
      }).then(res => {
        this.tableData = res.data;
        this.total = res.meta.pagination.total;
      });
    },
    // 搜索
    search() {
      if (this.page != 1) {
        this.page = 1;
        this.currentPage = 1;
      } else {
        this.getList();
      }
    },
    // 下拉框筛选
    async remoteMethod(query) {
      console.log(query);
      if (query !== "") {
        this.loading = true;
        let { data } = await getCompetitions({
          key: query,
          page_size: 20,
          page: 1
        });
        this.loading = false;
        let items = [];
        data.map(res => {
          items.push({
            value: res.id,
            label: `${res.name_zh}(${res.short_name_zh})`
          });
        });
        this.options = items;
      } else {
        this.options = [];
      }
    },
    // 切换分页
    changePage(val) {
      this.page = val;
    },
    // 添加比赛
    add() {
      if (this.multipleSelection.length == 0) {
        this.$message("请先选择比赛");
        return;
      }
      let data = [];
      this.multipleSelection.map(res => {
        data.push(res.id);
      });
      addExistMatch(data).then(_ => {
        this.$message("添加成功");
      });
    }
  },
  components: {
    paging
  },
  computed: {
    dataList() {
      return [this.value, this.end, this.start];
    }
  },
  watch: {
    page() {
      this.getList();
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
        if (this.value != "") {
          this.start = newVal;
          this.end = newVal + 3600 * 1000 * 24 - 1000;
          this.getList();
        }
        this.$message("刷新成功");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 250px;
}
.el-range-editor.el-input__inner {
  width: 250px;
}
</style>
