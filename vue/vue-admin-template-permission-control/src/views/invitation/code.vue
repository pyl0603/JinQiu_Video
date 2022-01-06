<template>
  <div class="banner-his">
    <el-row class="search-bar tar">
      <el-input
        class="mr10"
        placeholder="输入完整兑换码查询"
        v-model="keyWorlds"
      ></el-input>
      <el-button type="dqx-btn" @click="code = keyWorlds" class="ml20"
        >查询</el-button
      >
    </el-row>
    <div class="history mt20">
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
        height="calc(100vh - 300px)"
      >
        <el-table-column label="兑换码生成时间" width="200">
          <template slot-scope="scope">{{
            scope.row.createTime | formatTime
          }}</template>
        </el-table-column>
        <el-table-column prop="code" label="兑换码"></el-table-column>
        <!-- <el-table-column prop="province" label="手机"></el-table-column> -->
        <el-table-column label="状态">
          <template slot-scope="scope">{{
            scope.row.expired
              ? "过期失效"
              : scope.row.done
              ? "已使用"
              : "未使用"
          }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="礼品描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="use(scope.row.id)"
              :disabled="scope.row.expired || scope.row.done"
              >{{
                scope.row.expired
                  ? "过期失效"
                  : scope.row.done
                  ? "已使用"
                  : "使用"
              }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getCodelist, useCode } from "@/api/active.js";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    return {
      dataRang: "",
      tableData: [],
      keyWorlds: "",
      code: ""
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  methods: {
    getList() {
      getCodelist({ page: this.page, code: this.code }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    use(val) {
      useCode(val).then(_ => {
        this.$message("操作成功");
        this.getList();
      });
    },
    change(val) {
      console.log(val[0], val[1]);
    },
    handleClick(val) {
      this.$emit("chooseItem", val);
    }
  },
  mounted() {
    this.getList();
    this.$store.commit("setPaging", true);
  },
  computed: {
    ...mapGetters(["page"])
  },
  watch: {
    code(newVal) {
      if (this.page != 1) {
        this.page = 1;
      } else {
        this.getList();
      }
    },
    page(newVal) {
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 300px;
}
</style>
