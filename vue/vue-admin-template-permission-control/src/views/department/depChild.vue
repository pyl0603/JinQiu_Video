<template>
  <div class="department">
    <div class="new-tab tar">
        <el-button type="dqx-btn" @click="addDepart">{{addTxt}}</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 240px)"
      row-key="id"
    >
      <el-table-column prop="name" label="子部门" class="el-col-8"></el-table-column>
      <el-table-column prop="masterRole.name" label="主部门" class="el-col-6"></el-table-column>
      <el-table-column prop="manager.realName" label="子部门主管" width="200"></el-table-column>
      <!-- <el-table-column prop="startTime" label="权限" width="200"></el-table-column> -->
      <el-table-column label="权限管理" width="120">
        <template slot-scope="scope">
          <el-button @click="set(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="setAct(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogStatus==='create' ? '新增子部门' : '修改子部门'"
      :visible.sync="dialogFormVisible"
      :show-close="false"
    >
      <div>
        部门名称：
        <el-input v-inputRule v-model="depName" ></el-input>
      </div>
      <div class="mt20" v-if="dialogStatus==='create'">
        角色名称：
        <el-input v-inputRule v-model="roleName"></el-input>
      </div>
      <div class="mt20">
        部门主管：
        <el-input v-inputRule v-model="userPhone"  @keyup.enter.native="searUsers"></el-input>
        <el-button type="dqx-btn" class="ml10" @click="searUsers">查询</el-button>
      </div>
      <div class="mt20" v-if="dialogStatus==='create'">
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
import {
  getDep,
  getDepDet,
  getMyDep,
  putDepDet,
  addDep,
  getAllAut,
  userList,
  getDepAut,
  delDep
} from "@/api/staff";
export default {
  data() {
    return {
      tableData: [],
      tabList: [{name:'子部门管理'}],
      addTxt:'新增子部门',
      dialogFormVisible: false,
      rolesList: [],
      isChild: false,
      depName: "",
      roleName: "",
      dialogStatus: "create",
      userPhone: "",
      userId: "",
      depId: 0,
      itemIndex: 0,
      isFresh:true,
    };
  },
  methods: {
    // 切换状态
    async setAct(val) {
      this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          delDep(val).then(_ => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getDeps();
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 切换部门
    async tabs(val, e) {
      this.itemIndex = e;
      this.depId = val.id;
      this.hasChild = val.hasChildren;
    },
    // 部门修改
    async set(val) {
      this.dialogStatus = "update";
      let data = await this.getDepAuts(val);
      let depAut = [];
      data.map(res => {
        res.items.map(obj => {
          depAut.push(obj.id);
        });
      });
      this.rolesList.map(res => {
        res.items.map(obj => {
          if (depAut.includes(obj.id)) {
            obj.selected = true;
          }
        });
      });
      this.dialogFormVisible = true;
      getDepDet(val).then(res => {
        this.depName = res.data.name;
        this.roleName = res.data.masterRole.name;
        this.userPhone = res.data.manager.mobile;
        this.isChild = res.data.hasChildren;
      });
    },
    // 获取部门主管权限列表
    async getDepAuts(val) {
      return new Promise((resolve, reject) => {
        getDepAut(val).then(res => {
          return resolve(res.data);
        });
      });
    },
    // 搜索用户
    async searUsers() {
      let data = await this.searUser();
      if (data.length > 0) {
        this.$message("该用户已存在");
      } else {
        this.$message("不存在该用户");
      }
    },
    // 检测是否存在用户
    async searUser() {
      if(this.userPhone == ''){
        this.$message("请输入用户手机");
        return
      }
      return new Promise((resolve, reject) => {
        userList({ key: this.userPhone }).then(res => {
          return resolve(res.data);
        });
      });
    },
    // 新增部门
    async addDepart() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      let depAut = await this.getDepAuts(this.depId);
      this.rolesList = depAut;
    },
    // 获取部门列表
    async getDeps() {
      getDep({parent:this.depId}).then(res => {
        this.tableData = res.data;
      });
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
    // 新增事件
    async createData() {
      let roleIds = [];
      this.rolesList.map(res => {
        res.items.map(res => {
          if (res.selected) {
            roleIds.push(res.id);
          }
        });
      });
      let data = await this.searUser();
      let userId = "";
      if (data.length > 0) {
        userId = data[0].id;
      } else {
        this.$message("不存在该用户");
      }
      addDep({
        name: this.depName,
        roleName: this.roleName,
        authorities: roleIds,
        hasChildren: this.isChild,
        manager: userId,
        parent: this.depId
      }).then(_ => {
        this.$message("添加成功");
        this.dialogFormVisible = false;
        this.isFresh = !this.isFresh;
      });
    },
    // 修改事件
    async updateData() {
      let data = await this.searUser();
      let userId = "";
      if (data.length > 0) {
        userId = data[0].id;
      } else {
        this.$message("不存在该用户");
      }
      putDepDet(this.depId, {
        name: this.depName,
        manager: userId,
        hasChildren: this.isChild
      }).then(_ => {
        this.$message("修改成功");
        this.dialogFormVisible = false;
        this.isFresh = !this.isFresh;
      });
    }
  },
  async mounted() {
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
          console.log(newVal)
          this.getDeps();
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
/deep/.el-dialog {
  margin-top: 5vh !important;
}
</style>
