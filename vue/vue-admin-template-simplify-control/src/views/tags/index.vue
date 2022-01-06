<template>
  <div class="tags">
    <el-row>
      <el-col :span="24" class="tar">
        <!-- <el-button type="dqx-btn" @click="addNew">新增标签</el-button> -->
        <el-input v-inputRule class="ml20" v-model="keyWorlds"></el-input>
        <el-button type="dqx-btn" class="ml20" @click="sear">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 290px)"
    >
      <el-table-column prop="name" label="标签名称"></el-table-column>
      <el-table-column prop="subhead" label="简介" width="200"></el-table-column>

      <el-table-column label="调整" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="change(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <new-tag ref="NewTag" @cancel="cancel" :tagsNameVal="tagsNameVal" :dialogVisible="dialogVisible" :dialogStatus="dialogStatus" :id="id"></new-tag>
  </div>
</template>
<script>
import { getTagsList } from "@/api/edit";
import { mapGetters } from "vuex";
import NewTag from '@/views/common/new-tag'
export default {
  data() {
    return {
      tableData: [],
      keyWorlds: "",
      keyVal: "", //搜索关键字
      dialogVisible:false,
      dialogStatus:"create",
      id:0,
      tagsNameVal:''
    };
  },
  components:{
    NewTag
  },
  methods: {
    // 获取标签列表
    getIndex() {
      getTagsList({ page: this.page, name: this.keyVal }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 查询
    sear() {
      this.keyVal = this.keyWorlds;
    },
    // 新增
    addNew() {
      this.dialogStatus = "create"
      this.dialogVisible = true
    },
    // 修改
    change(val) {
      this.id = val.id;
      this.tagsNameVal = val.name;
      this.dialogStatus = "update"
      this.dialogVisible = true
    },
    // 删除
    del() {},
    // 取消
    cancel(){
      // this.page = 1;
      this.getIndex();
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.getIndex();
    this.$store.commit("setPaging", true);
  },
  computed: {
    dataList() {
      let val = [this.keyVal, this.page];
      return val;
    },
    ...mapGetters(["page"])
  },
  watch: {
    dataList(newVal) {
      this.getIndex();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 300px;
}

</style>

