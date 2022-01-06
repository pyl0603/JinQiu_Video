<template>
  <div>
    <el-table :data="tableData" border style="width: 100%;">
      <el-table-column type="index" label="排序" class="el-col-4" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="导航名称" class="el-col-4"></el-table-column>
      <el-table-column label="调整" width="200">
        <template slot-scope="scope">
          <el-button @click="updata(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="setUp(scope.row.id)" type="text" size="small" :disabled="scope.$index == 0" :class="{highLight : scope.$index != 0}">上移</el-button>
          <el-button @click="setDown(scope.row.id)" type="text" size="small"  :disabled="scope.$index == tableData.length - 1"  :class="{highLight : scope.$index != tableData.length - 1}">下移</el-button>
          <el-button @click="setTop(scope.row.id)" type="text" size="small" :disabled="scope.$index == 0" :class="{highLight : scope.$index != 0}" >置顶</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否展示" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.isShow"
            @change="changeSwitch($event, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog title="修改导航名称" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <em>导航名称：</em>
          <el-input v-inputRule v-model="menuName"></el-input>
        </div>
        <div slot="footer" class="dialog-footer mt20 tac">
          <el-button type="dqx-btn" @click="createData">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getRoom,upRoom,downRoom,topRoom,nameRoom,showRoom} from '@/api/setting'
export default {
    data(){
        return{
            tableData:[{name:'聊天'}],
            dialogVisible:false,
            menuName:'',
            id:0
        }
    },
     mounted() {
       this.getIndex();
    this.$store.commit("setPaging", false);
  },
    methods:{
        changeSwitch(val,e){
          e.isShow = !e.isShow;
          showRoom(e.id).then(_ => {
            this.$message('操作成功')
          })
        },
        // 修改
        updata(val){
            this.dialogVisible = true;
            this.menuName = val.name;
            this.id = val.id
        },
        // 上移
        setUp(val){
          upRoom(val).then(_ => {
            this.$message('操作成功');
            this.getIndex();
          })
        },
         // 下移
        setDown(val){
          downRoom(val).then(_ => {
            this.$message('操作成功');
            this.getIndex();
          })
        },
         // 置顶
        setTop(val){
          topRoom(val).then(_ => {
            this.$message('操作成功');
            this.getIndex();
          })
        },
        // 保存修改
        createData(){
          if(this.menuName == ''){
            this.$message("内容不能为空")
            return
          }
          nameRoom(this.id,{name:this.menuName}).then(_ => {
            this.$message('修改成功');
            this.dialogVisible = false;
            this.getIndex();
          })
        },
        // 获取列表
        getIndex(){
          getRoom().then(res => {
            this.tableData = res.data
          })
        }
    }
}
</script>
<style lang="scss" scoped>
.highLight{
  color: #333;
}
</style>
