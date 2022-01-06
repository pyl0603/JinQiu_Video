<template>
  <div class="rec">
    <el-row class="mt20">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 240px)"
      >
        <el-table-column prop="itemName" label="关注内容"></el-table-column>
        <el-table-column label="类别" width="200">
          <template slot-scope="scope">{{scope.row.category.display}}</template>
        </el-table-column>
        <el-table-column label="分类" width="200">
          <template slot-scope="scope">{{scope.row.itemType.itemDesc}}</template>
        </el-table-column>
        <el-table-column label="调整" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="movePos(scope.row.id, 'up')">上移</el-button>
            <el-button size="mini" type="text" @click="movePos(scope.row.id, 'down')">下移</el-button>
            <el-button size="mini" type="text" @click="movePos(scope.row.id,'top')">置顶</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { getRecList,putRecPos,putRec } from "@/api/follow";
export default {
  props: {
    tabName: {
      type: Array,
      default: () => []
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabList: [{ name: "管理文章", value: 1 }, { name: "管理视频", value: 2 }],
      tableData: [],
      multipleSelection: [],
      posList: [],
      id: ""
    };
  },
  mounted() {
    this.$store.commit("setPaging", false);
    this.getLists()
  },
  methods: {
    //   顶部tab,切换数据源
    chooseTab(val) {},
    // 移动
    movePos(val,e){
      putRecPos(val,e).then(res => {
        this.$message("操作成功");
        this.getLists()
      })
    },
    // 删除
    del(val) {
      putRec(val,'cancel-recommend').then(_ => {
        this.$message("操作成功");
        this.getLists()
      })
    },
    handleSelectionChange() {},
    // 获取列表
    getLists() {
      getRecList().then(res => {
        this.tableData = res.data;
        this.posList = [];
        if (res.data.length > 0) {
          res.data.map(res => {
            this.posList.push(res.id);
          });
        }
        console.log(this.posList);
      });
    },
  }
};
</script>
