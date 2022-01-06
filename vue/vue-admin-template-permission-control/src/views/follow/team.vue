<template>
  <div class="team">
    <el-row class="tab-list cada">
      <span
        class="team-sort f16 cp"
        v-for="(item,index) in tabList[0].list"
        :key="index"
        :class="{c18c : itemIndex == index}"
        @click="sortTab(index,item)"
      >{{item.name}}</span>
    </el-row>
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
        <el-table-column label="调整" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="movePos(scope.$index, scope.$index - 1)">上移</el-button>
            <el-button size="mini" type="text" @click="movePos(scope.$index, scope.$index + 1)">下移</el-button>
            <el-button size="mini" type="text" @click="moveTop(scope.row.id)">置顶</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="关注推荐" width="200">
          <template slot-scope="scope">
           <el-switch
            :key="scope.$index"
            :value="scope.row.isRecommend"
            @change="changeRec($event, scope.row)"
          />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { putRec,getList, batchConts } from "@/api/follow";
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
      sortList: [
        { name: "中超", value: 1 },
        { name: "英超", value: 2 },
        { name: "法甲", value: 3 },
        { name: "西甲", value: 4 },
        { name: "意甲", value: 5 },
        { name: "德甲", value: 6 },
        { name: "日职队", value: 7 },
        { name: "国家队", value: 8 }
      ],
      id: "",
      itemIndex: 0,
      tabList: [{list:[]}],
      tableData: [],
      multipleSelection: [],
      posList: []
    };
  },
  created() {
    this.$store.commit("setPaging", false);
    if(this.tabName.length){
      this.id = this.tabName[0].list[0].id;
      this.tabList = this.tabName
    }
  },
  methods: {
     // 推荐
    changeRec(val, row) {
      row.isRecommend = val;
      let lockType = val ? 'recommend' : 'cancel-recommend'
      putRec(row.id, lockType).then(_ => {
        this.$message("操作成功");
      });
    },
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
      console.log(this.posList);
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
      console.log(this.posList);
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
    },
    //   分类
    sortTab(val, e) {
      this.itemIndex = val;
      this.id = e.id;
      this.$emit("arrId", [e.id, e.competitionId]);
    },
    // 获取列表
    getLists() {
      getList(this.id).then(res => {
        this.tableData = res.data;
        this.posList = [];
        res.data.map(res => {
          this.posList.push(res.id);
        });
      });
    },
    // 排序
    setPos() {
      batchConts(this.id, this.posList).then(res => {
        this.tableData = res.data;
        this.posList = [];
        res.data.map(res => {
          this.posList.push(res.id);
        });
      });
    },
    handleSelectionChange() {}
  },
  watch: {
    id(newVal) {
      this.getLists();
    },
    isAdd(newVal) {
      this.getLists();
    },
    tabName(newVal){
      this.tabList = newVal
      this.id = newVal[0].list[0].id
    }
  }
};
</script>
<style lang="scss" scoped>
.team {
  .tab-list {
    position: absolute;
    margin-top: -50px;
  }
  .team-sort + .team-sort {
    border-left: 2px solid #f5f5f5;
  }
  .team-sort {
    display: inline-block;
    width: 90px;
    text-align: center;
  }
}
</style>

