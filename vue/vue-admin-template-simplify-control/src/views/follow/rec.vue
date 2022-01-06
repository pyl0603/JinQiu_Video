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
        <el-table-column prop="ordinal" label="排序"></el-table-column>
        <el-table-column prop="itemName" label="关注内容"></el-table-column>
        <el-table-column label="类别" width="200">
          <template slot-scope="scope">{{scope.row.itemType === 2 ? '球员' : '球队'}}</template>
        </el-table-column>
        <!-- <el-table-column prop="url" label="相关文章" width="200"></el-table-column>
          <el-table-column prop="cont" label="今日被搜索" width="180"></el-table-column>
        <el-table-column prop="cont" label="被提到" width="180"></el-table-column>-->
        <el-table-column label="调整" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="movePos(scope.$index, scope.$index - 1)">上移</el-button>
            <el-button size="mini" type="text" @click="movePos(scope.$index, scope.$index + 1)">下移</el-button>
            <el-button size="mini" type="text" @click="moveTop(scope.row.id)">置顶</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { getList, batchConts } from "@/api/follow";
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
  },
  methods: {
    //   顶部tab,切换数据源
    chooseTab(val) {},
    // 移动
    movePos(val, vals) {
      if (val > vals && val == 0) {
        this.$message("该记录已经是第一条数据了");
        return;
      }
      if (val < vals && vals == this.posList.length) {
        this.$message("该记录已经是最后一条数据了");
        return;
      }
      let item = this.posList[val];
      let items = this.posList[vals];
      this.posList[val] = items;
      this.posList[vals] = item;
      this.setPos();
    },
    // 置顶
    moveTop(val) {
      for (let i = 0; i < this.posList.length; i++) {
        if (this.posList[i] === val) {
          this.posList.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
          this.posList.unshift(val); // 再添加到第一个位置
        }
      }
      this.setPos();
    },
    // 删除
    del(val) {
      for (let i = 0; i < this.posList.length; i++) {
        if (this.posList[i] === val) {
          this.posList.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
        }
      }
      this.setPos();
      this.id = this.tabName[0].list[0].id;
      this.getLists();
      console.log(1)
    },
    handleSelectionChange() {},
    // 获取列表
    getLists() {
      getList(this.id).then(res => {
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
    // 排序
    setPos() {
      batchConts(1, this.posList).then(res => {
        this.tableData = res.data;
        this.posList = [];
        res.data.map(res => {
          this.posList.push(res.id);
        });
      });
    }
  },
  watch: {
    isAdd(newVal) {
      this.id = this.tabName[0].list[0].id;
      this.getLists();
    },
    tabName(newVal){
      this.id = this.tabName[0].list[0].id;
      this.getLists();
    }
  }
};
</script>
