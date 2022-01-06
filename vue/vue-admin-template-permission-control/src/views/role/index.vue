<template>
  <div class="department">
    <div class="new-tab mb20 tar">
      <el-button type="dqx-btn" @click="addDeps">新增角色</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt20"
      height="calc(100vh - 240px)"
    >
      <el-table-column prop="name" label="角色"  width="200"></el-table-column>
      <el-table-column label="权限">
         <template slot-scope="scope">
          <span v-for="item in scope.row.authorities" :key="item.id">{{item.introduction}},</span>
        </template>
      </el-table-column>
      <el-table-column label="权限管理" width="240">
        <template slot-scope="scope">
          <el-button @click="set(scope.row)" type="text" size="small">修改信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog  :title="dialogStatus==='create' ? '新增角色' : '修改角色'" :visible.sync="dialogFormVisible" :show-close="false">
      <div class="mt20">
        角色名称：
        <el-input placeholder="请输入角色名" v-model="roleName" v-inputRule></el-input>
      </div>
      <div class="mt20">
        <el-collapse accordion>
          <el-collapse-item v-for="(item,index) in rolesList" :key="index">
            <template slot="title">{{item.type}}</template>
            <div>
              <el-checkbox
                v-model="item.selected"
                @change="onChangeFather(item)"
                class="one-role-level"
              >全选</el-checkbox>
            </div>
            <div class="two-role-level mt10">
              <span v-for="role in item.items" :key="role.id" class="mr30">
                <el-checkbox
                  v-model="role.selected"
                  :label="role.introduction"
                  @change="onChangeSon(role,item)"
                ></el-checkbox>
              </span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div slot="footer" class="dialog-footer tac">
        <el-button type="dqx-btn" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import { getMyDep,getDepRole,getDepAut,addRole,putRoleAll } from '@/api/staff'
export default {
  data() {
    return {
      tableData: [],
      itemIndex:0,
      tabList: [],
      depId:0,
      dialogFormVisible:false,
      roleName:'',
      rolesList:[],
      dialogStatus:"create",
      roleId:0,
      isFresh:true,
    };
  },
  components:{
      TopTab
  },
  methods: {
    async set(val) {
      this.dialogStatus = 'update'
      this.roleId = val.id;
      this.rolesList = await this.getDepAuts();
      let roleAut = [];
      val.authorities.map(res => {
        roleAut.push(res.id)
      });
      this.rolesList.map(res => {
        res.items.map(obj => {
          if(roleAut.includes(obj.id)){
            obj.selected = true;
          }
        })
      })
      this.roleName  = val.name;
      this.dialogFormVisible = true;
    },
    async chooseTab(val){
        console.log(1)
    },
    // 获取部门主管权限列表
    async getDepAuts(){
      return new Promise((resolve,reject) => {
        getDepAut(this.depId).then(res => {
          return resolve(res.data)
        })
      })
    },
    // 新增角色
    async addDeps(){
      this.dialogStatus = 'create'
      this.rolesList = await this.getDepAuts();
      this.dialogFormVisible = true;
    },
    // 修改部门信息
    async putRoleAlls(){
      let roleIds = [];
      this.rolesList.map(res => {
        res.items.map(res => {
          if (res.selected) {
            roleIds.push(res.id);
          }
        });
      });
      putRoleAll(this.depId,this.roleId,{name:this.roleName,authorities:roleIds}).then(_ => {
        this.$message('更新成功');
         this.dialogFormVisible = false;
        this.isFresh = !this.isFresh;
      })
    },
    // 切换部门
    async tabs(val,e){
      this.itemIndex = e;
      this.depId = val.id;
    },
    // 获取部门角色列表
    async getDepRoles(){
      getDepRole(this.depId).then(res => {
        this.tableData = res.data;
      })
    },
     // 父选项点击选中事件
    async onChangeFather(parObj) {
      if (parObj.selected === true) {
        parObj.items.map(res => (res.selected = true));
      } else {
        parObj.items.map(res => (res.selected = false));
      }
    },
    // 子选项点击选中事件
    async onChangeSon(obj, parObj) {
      // 子选项部分选中
      if (parObj.items.findIndex(res => res.selected === true) > -1) {
        parObj.selected = false;
      }
      //子选项全部取消选中
      if (parObj.items.findIndex(res => res.selected === false) <= -1) {
        parObj.selected = true;
      }
      //子选项全部选中
      if (parObj.items.findIndex(res => res.selected === true) <= -1) {
        parObj.selected = false;
      }
    },
    // 新增角色
    async createData(){
      let roleIds = [];
      this.rolesList.map(res => {
        res.items.map(res => {
          if (res.selected) {
            roleIds.push(res.id);
          }
        });
      });
      addRole(this.depId,{name:this.roleName,authorities:roleIds}).then(res => {
        this.$message('添加成功')
        this.dialogFormVisible = false;
        this.isFresh = !this.isFresh;
      })
    },
    // 修改角色
    async updateData(){
       let roleIds = [];
      this.rolesList.map(res => {
        res.items.map(res => {
          if (res.selected) {
            roleIds.push(res.id);
          }
        });
      });
      putRoleAll(this.depId,this.roleId,{name:this.roleName,authorities:roleIds}).then(_ => {
         this.$message('更新成功');
         this.dialogFormVisible = false;
         this.isFresh = !this.isFresh;
      })
    },
  },
  mounted() {
     this.depId = this.$route.query.id;
    this.$store.commit("setPaging", false);
  },
  computed:{
      dataList(){
          return [this.depId,this.isFresh]
      }
  },
  watch:{
    dataList(newVal){
      this.getDepRoles();
    }
  }
};
</script>
<style lang="scss" scoped>
.show-tab {
  display: inline-block;
  width: 120px;
  text-align: center;
}
.show-tab + .show-tab {
  border-left: 1px solid #f5f5f5;
}
/deep/.el-input {
  display: inline-block;
  width: calc(100% - 250px);
}
</style>
