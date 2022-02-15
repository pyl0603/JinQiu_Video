<template>
  <div class="player">
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
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { getList , batchConts} from '@/api/follow'
export default {
  props:{
    isAdd:{
      type:Boolean,
      default:false,
    },
   tabName: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      posList: []
    };
  },
  mounted() {
    this.$store.commit("setPaging", false);
    this.getLists()
  },
  methods: {
     // 移动
    movePos(val,vals){
      if(val > vals && val == 0){
        this.$message('该记录已经是第一条数据了')
        return
      }
      if(val < vals && vals == this.posList.length){
        this.$message('该记录已经是最后一条数据了')
        return
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
    del(val){
       for (let i = 0; i < this.posList.length; i++) {
        if (this.posList[i] === val) {
          this.posList.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
        }
      }
      this.setPos();
    },
    handleSelectionChange() {},
    // 获取列表
    getLists() {
      getList(this.tabName[2].list[0].id).then(res => {
        this.tableData = res.data;
        this.posList = [];
        res.data.map(res => {
          this.posList.push(res.id);
        });
      });
    },
    // 排序
    setPos() {
      batchConts(this.tabName[2].list[0].id, this.posList).then(res => {
        this.tableData = res.data;
        this.posList = [];
        res.data.map(res => {
          this.posList.push(res.id);
        });
      });
    }
  },
   watch:{
    isAdd(newVal){
      this.getLists()
    }
  }
};
</script>
