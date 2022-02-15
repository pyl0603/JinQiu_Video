<template>
  <div class="department">
    <div class="new-tab tar mb20">
      <el-button type="dqx-btn" @click="addDeps">新增成员</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 240px)"
    >
      <el-table-column prop="nickname" label="昵称" class="el-col-6"></el-table-column>
      <el-table-column prop="workName" label="姓名" class="el-col-6"></el-table-column>
      <el-table-column prop="department.name" label="部门" width="200"></el-table-column>
      <el-table-column prop="roles[0].name" label="角色" width="200"></el-table-column>
       <el-table-column label="助手权限" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.hasHelper"
            @change="changeSwitchHelp($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="权限管理" width="220">
        <template slot-scope="scope">
          <el-button @click="set(scope.row)" type="text" size="small">设置角色</el-button>
          <el-button @click="setWorkname(scope.row)" type="text" size="small">设置姓名</el-button>
        </template>
      </el-table-column>
      <el-table-column label="退出部门" width="120">
        <template slot-scope="scope">
          <el-button @click="outDep(scope.row.id)" type="text" size="small">退出部门</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置用户workname -->
    <el-dialog title="设置用户姓名" :visible.sync="dialogVisible" :show-close="false">
      <div>用户昵称：{{userInfo.nickname}}</div>
      <div class="mt20">
        用户姓名：
        <el-input v-model="userInfo.workName" v-inputRule placeholder="请输入用户姓名"></el-input>
      </div>
      <div slot="footer" class="dialog-footer tac">
        <el-button type="dqx-btn" @click="saveWorkname">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增成员 -->
    <el-dialog
      :title="dialogStatus==='create' ? '新增成员' : '修改成员'"
      :visible.sync="dialogFormVisible"
      :show-close="false"
    >
      <div class="mt20">
        成员账号：
        <el-input v-inputRule v-model="userPhone" :disabled="dialogStatus != 'create'"></el-input>
      </div>
      <div class="mt20" v-if="dialogStatus != 'create'">
        选择角色：
        <span v-for="role in userRoles" :key="role.id" class="mr30">
          <el-checkbox v-model="role.selected" :label="role.name"></el-checkbox>
        </span>
        <!-- <el-select v-model="value" placeholder="请选择" class="mr30">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>-->
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
import {
  getMyDep,
  getDepUser,
  getDepAut,
  getDepRole,
  addRole,
  addUser,
  putUser,
  userList,
  delUser,
  putUserWorkname,
  setHelp
} from "@/api/staff";
export default {
  data() {
    return {
      tableData: [],
      itemIndex: 0,
      tabList: [],
      depId: 0,
      dialogFormVisible: false,
      userPhone: "",
      rolesList: [],
      dialogStatus: "create",
      options: [], //角色列表
      userRoles: [],
      value: "",
      userId: 0,
      isFresh: true,
      dialogVisible: false,
      userInfo: { nickname: "", workName: "", id: "" }
    };
  },
  components: {
    TopTab
  },
  methods: {
    // 设置助手权限
    async changeSwitchHelp(val, row) {
      if(row.hasHelper){
        setHelp(row.id,{value:false}).then(_ => {
          this.$message('助手权限已关闭');
          row.hasHelper = val;
        })
      }else{
        setHelp(row.id,{value:true}).then(_ => {
          this.$message('助手权限已打开');
          row.hasHelper = val;
        })
      }
    },
    // 设置workname
    async setWorkname(val) {
      this.userInfo = val;
      this.dialogVisible = true;
    },
    // 修改workname
    async saveWorkname() {
      if (this.userInfo.workName === "") {
        this.$message("请输入workname");
        return;
      }
      putUserWorkname(this.depId, this.userInfo.id, {
        value: this.userInfo.workName
      }).then(_ => {
        this.$message("修改成功");
        this.dialogVisible = false;
        this.userInfo = { nickname: "", workName: "", id: "" };
        this.getDepRoles();
      });
    },
    // 设置角色 userRoles数组重组
    async set(val) {
      if (val.roleIds.length > 0) {
        this.userRoles.map(res => {
          if (val.roleIds.includes(res.id)) {
            res.selected = true;
          }
        });
      }
      this.userId = val.id;
      this.userPhone = val.mobile;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    async chooseTab(val) {
      console.log(1);
    },
    // 新增角色
    async addDeps() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    // 退出部门
    async outDep(val) {
      delUser(this.depId, val).then(_ => {
        this.$message("移除成功");
        this.isFresh = !this.isFresh;
      });
    },
    // 切换部门
    async tabs(val, e) {
      this.itemIndex = e;
      this.depId = val.id;
    },
    // 获取部门成员
    async getDepRoles() {
      getDepUser(this.depId).then(res => {
        this.tableData = res.data;
      });
    },
    // 获取部门角色列表
    async getDepRoleList() {
      getDepRole(this.depId).then(res => {
        this.options = [];
        this.userRoles = [];
        res.data.map(res => {
          if (!res.isMain) {
            this.userRoles.push({
              id: res.id,
              name: res.name,
              selected: false
            });
            console.log(this.userRoles, "");
            this.options.push(res);
          }
        });
        this.value = this.options[0].id;
      });
    },
    // 检测是否存在用户
    async searUser() {
      return new Promise((resolve, reject) => {
        userList({ key: this.userPhone, all: 1 }).then(res => {
          return resolve(res.data);
        });
      });
    },
    // 新增角色
    async createData() {
      let data = await this.searUser();
      let userId = "";
      if (data.length > 0) {
        userId = data[0].id;
      } else {
        this.$message("不存在该用户");
      }
      addUser(this.depId, userId).then(res => {
        this.$message("添加成功");
        this.dialogFormVisible = false;
        this.isFresh = !this.isFresh;
      });
    },
    // 修改角色
    async updateData() {
      let aut = [];
      this.userRoles.map(res => {
        if (res.selected) {
          aut.push(res.id);
        }
      });
      putUser(this.userId, aut).then(_ => {
        this.$message("更新成功");
        this.isFresh = !this.isFresh;
        this.dialogFormVisible = false;
        this.userRoles.map(res => {
          res.selected = false;
        })
      });
    }
  },
  mounted() {
    this.depId = this.$route.query.id;
    this.getDepRoleList();
    this.$store.commit("setPaging", false);
  },
  computed: {
    dataList() {
      return [this.depId, this.isFresh];
    }
  },
  watch: {
    dataList(newVal) {
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
/deep/.el-select .el-input {
  width: 100%;
}
</style>
