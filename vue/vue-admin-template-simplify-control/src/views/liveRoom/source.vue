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
              :value="item.id"
            ></el-option>
          </el-select>
        <el-date-picker
          v-model="refreshDate"
          type="date"
          value-format="timestamp"
          placeholder="刷新比赛日期选择"
        ></el-date-picker>
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
      <el-table-column label="直播时间" width="300">
        <template slot-scope="scope">{{ scope.row.startAt | formatTime }}</template>
      </el-table-column>
      <el-table-column label="直播间名称" width="400">
        <template slot-scope="scope">{{scope.row.homeTeamName}}VS{{scope.row.awayTeamName}}</template>
      </el-table-column>
      <el-table-column prop="customStatusDesc" label="直播状态" width="250"></el-table-column>
      <el-table-column prop="liveSourceNum" label="直播源数量"></el-table-column>
      <el-table-column label="功能">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="set(scope.row.id)">直播源设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog title="直播源设置" :visible.sync="dialogVisible" width="30%" :show-close="false"  :close-on-click-modal="false">
      <div class="dialog-cont">
        <div class="list">
          <div class="item mb20" v-for="(item,index) in list" :key="index">
            <div>
              <em>添加链接：</em>
              <el-input v-inputRule v-model="item.url"></el-input>
            </div>
            <div class="search-match mt20">
              <em>直播来源：</em>
              <el-input v-inputRule v-model="item.name"></el-input>
              <el-button
                type="danger"
                v-if="item.url!=''&&item.name!=''"
                icon="el-icon-delete"
                circle
                class="ml20"
                @click="del(item,index)"
              ></el-button>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer mt20 tac">
          <el-button type="primary" @click="addList" :disabled="isNull">添加直播源</el-button>
          <el-button
            type="dqx-btn"
            :disabled="isAdd"
            @click="dialogStatus==='create'?createData():updateData()"
          >保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
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
import { getMatches } from "@/api/public";
import { mapGetters } from "vuex";
import { link } from "fs";
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    let _this = this;
    return {
      dataRang: [
        new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24 * 3 -
          1000
      ], //  时间选择
      tableData: [], //列表
      dialogVisible: false, //弹窗
      list: [{ url: "", name: "" }], //直播源列表
      dialogStatus: "create", //修改|新增
      tabList: [], //频道列表
      itemIndex: 0,
      competition: 0, //频道id
      start: new Date(new Date().toLocaleDateString()).getTime(), //开始时间
      end:
        new Date(new Date().toLocaleDateString()).getTime() +
        3600 * 1000 * 24 * 3 -
        1000, //结束时间
      liveId: 0,
      isNull: true,
      isAdd: true,
      refreshDate: "", //刷新数据
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
              date.setTime(date.getTime() + 3600 * 1000 * 72);
              picker.$emit("pick", date);
              _this.start = new Date(new Date().toLocaleDateString()).getTime();
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime() +
                3600 * 1000 * 24 * 3 -
                1000;
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "一周内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
              _this.start = new Date(new Date().toLocaleDateString()).getTime();
              _this.end =
                new Date(new Date().toLocaleDateString()).getTime() +
                3600 * 1000 * 24 * 7 -
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
  mounted() {
    this.getChannel();
    this.$store.commit("setPaging", true);
  },
  methods: {
    // 日期选择
    change(val) {
      console.log(val);
      this.start = val[0];
      this.end = val[1] + 3600 * 1000 * 24 - 1000;
    },
    pick(val) {
      console.log(val);
    },
    // 直播源设置
    set(val) {
      this.dialogVisible = true;
      this.getSources(val);
      this.liveId = val;
      this.list = [{ name: "", url: "" }];
    },
    // 新增
    createData() {
      addSource(this.liveId, this.urlList).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.list = [{ name: "", url: "" }];
      });
    },
    // 修改
    updateData() {
      addSource(this.liveId, this.urlList).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.list = [{ name: "", url: "" }];
        this.getMatche();
      });
    },
    // 删除数据
    del(val, e) {
      if (val.id) {
        delSource(val.id).then(_ => {
          this.$message("已删除");
        });
      }
      this.list.splice(e, 1);
    },
    // 新增一条数据
    addList() {
      let nullNo = 0;
      this.list.map(res => {
        if (res.name == "" || res.url === "") {
          nullNo++;
        }
      });
      if (nullNo > 0) return;
      this.list.push({ url: "", name: "" });
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
        page: this.page
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 获取直播源
    getSources(val) {
      getSource(val).then(res => {
        if (res.data.length > 0) {
          this.list = res.data;
          this.dialogStatus = "update";
          this.isAdd = false;
        }
      });
    }
  },
  computed: {
    ...mapGetters(["page"]),
    dataList() {
      return [this.competition, this.start, this.end, this.page];
    },
    urlList() {
      return this.list.filter(res => {
        return res.url != "" && res.name != "";
      });
    }
  },
  watch: {
    dataList(newVal) {
      this.getMatche();
    },
    dataRang(newVal) {
      console.log(newVal);
    },
    list: {
      handler(val) {
        // 列表为空时保存按钮置灰
        if (val.length === 1 && (val[0].name === "" || val[0].url === "")) {
          this.isAdd = true;
        } else {
          this.isAdd = false;
        }
        // 列表存在为空项时添加直播源按钮置灰
        let num = 0;
        val.map(res => {
          if (res.url === "" || res.name === "") {
            num++;
          }
        });
        if (num > 0) {
          this.isNull = true;
        } else {
          this.isNull = false;
        }
      },
      deep: true //加上这
    },
    refreshDate(newVal) {
      let times =
        new Date(newVal).getFullYear().toString() +
        (new Date(newVal).getMonth() + 1).toString() +
        new Date(newVal).getDate().toString();
      refreshMatch(times).then(res => {
        this.start = newVal;
        this.end = newVal + 3600 * 1000 * 24 - 1000;
        this.$store.commit('setPage',1)
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
</style>

