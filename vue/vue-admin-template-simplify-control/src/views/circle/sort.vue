<template>
  <div class="sort">
    <div class="new-tab tar">
        <!-- 搜索：<el-input placeholder="请输入关键字" v-model="keyWorlds"></el-input> <el-button type="dqx-btn"  class="mr60">搜索</el-button> -->
      <el-button type="dqx-btn" @click="addSort">新增类别</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 240px)"
    >
      <el-table-column label="序号" class="el-col-8">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="name" label="类别名称" class="el-col-6"></el-table-column>
      <el-table-column label="调整" width="300">
        <template slot-scope="scope">
          <el-button @click="changeItem(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="setUp(scope.row.id)" type="text" size="small">上移</el-button>
          <el-button @click="setDown(scope.row.id)" type="text" size="small">下移</el-button>
          <el-button @click="setTop(scope.row.id)" type="text" size="small">置顶</el-button>
          <el-button @click="setGround(scope.row.id)" type="text" size="small">置底</el-button>
          <el-button @click="set(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加类别" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div class="mt20">
          <em>新增类别：</em>
          <el-input v-inputRule v-model="name"></el-input>
        </div>
        <div slot="footer" class="dialog-footer mt20 tac">
          <el-button type="dqx-btn" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getGroups,addGroups,upGroups,downGroups,topGroups,groundGroups,putSort } from '@/api/circle'
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogStatus:'create',
      name:'',
      keyWorlds:'',
      id:0
    };
  },
  methods: {
    // 上移
    async setUp(val) {
      upGroups(val).then(_ => {
        this.$message('操作成功');
        this.getGroup();
      })
    },
     // 下移
    async setDown(val) {
      downGroups(val).then(_ => {
        this.$message('操作成功');
        this.getGroup();
      })
    },
     // 置顶
    async setTop(val) {
      topGroups(val).then(_ => {
        this.$message('操作成功');
        this.getGroup();
      })
    },
     // 置底
    async setGround(val) {
      groundGroups(val).then(_ => {
        this.$message('操作成功');
        this.getGroup();
      })
    },
    // 新增类别
    async addSort() {
        this.dialogVisible = true;
        this.dialogStatus = 'create'
    },
    // 修改类别
     async changeItem(val){
       this.dialogStatus = 'update'
       this.dialogVisible = true;
       this.name = val.name;
       this.id = val.id;
     },
    // 新增类别
    async createData(){
      addGroups({name:this.name}).then(res => {
        this.$message('添加成功');
        this.getGroup();
        this.dialogVisible = false;
      })
    },
    // 修改类别
    async updateData(){
      putSort({name:this.name,id:this.id}).then(res => {
        this.$message('修改成功');
        this.getGroup();
        this.dialogVisible = false;
      })
    },
    // 获取类别
    async getGroup(){
      getGroups().then(res => {
        this.tableData = res.data;
      })
    },
  },
  mounted() {
    this.getGroup();
    this.$store.commit("setPaging", false);
  }
};
</script>
<style lang="scss" scoped>
.new-tab{
    .el-input{
        display: inline-block;
        width: 200px;
    }
}
</style>
