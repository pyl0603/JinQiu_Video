<template>
  <div>
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <div class="department">
      <div class="new-tab tar">
        <!-- <el-button type="dqx-btn" @click="addDepart">角色</el-button> -->
        <el-button type="dqx-btn" @click="addDepart">新增成员</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="mb10 mt10"
        height="calc(100vh - 240px)"
        row-key="id"
      >
        <el-table-column
          prop="occupation"
          label="职位"
          class="el-col-8"
        ></el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
          class="el-col-6"
        ></el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
        <el-table-column
          prop="isSuperAdmin"
          label="超级管理员"
        ></el-table-column>
        <!-- <el-table-column prop="startTime" label="权限" width="200"></el-table-column> -->
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <!-- <el-button @click="set(scope.row.id)" type="text" size="small"
            >信息修改</el-button
          >
          <el-button @click="setRole(scope.row)" type="text" size="small"
            >权限修改</el-button
          > -->
            <el-button
              @click="deleteMember(scope.$index, scope.row)"
              type="text"
              size="small"
              >删除</el-button
            >
            <!-- <el-button
            @click="memberDisable(scope.$index, scope.row)"
            type="text"
            size="small"
            >停用</el-button
          >
           <el-button
            @click="memberEnable(scope.$index, scope.row)"
            type="text"
            size="small"
            >启用</el-button
          > -->
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="
                scope.row.state
                  ? memberEnable($event, scope.row)
                  : memberDisable($event, scope.row)
              "
            >
              <!-- @change="switchChange($event,scope.row)" -->
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="修改权限"
        :visible.sync="dialogVisible"
        :show-close="false"
      >
        <div>主管角色：{{ roleManName }}</div>
        <div class="mt20">
          <el-collapse accordion>
            <el-collapse-item v-for="(item, index) in rolesList" :key="index">
              <template slot="title">{{ item.type }}</template>
              <div>
                <el-checkbox
                  v-model="item.selected"
                  @change="onChangeFather(item)"
                  class="one-role-level"
                  >全选</el-checkbox
                >
              </div>
              <div class="two-role-level mt10">
                <span v-for="role in item.items" :key="role.id" class="mr30">
                  <el-checkbox
                    v-model="role.selected"
                    :label="role.introduction"
                    @change="onChangeSon(role, item)"
                  ></el-checkbox>
                </span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div slot="footer" class="dialog-footer tac">
          <el-button type="dqx-btn" @click="changeRole">修改角色</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="dialogStatus === 'create' ? '新增成员' : '编辑成员'"
        :visible.sync="dialogFormVisible"
        :show-close="false"
      >
        <div class="ml30 ">
          职位：
          <el-input
            v-model="memberAdd.occupation"
            v-inputRule
            maxlength="20"
          ></el-input>
        </div>
        <div class="mt20 ml30">
          姓名：
          <el-input
            v-model="memberAdd.realName"
            v-inputRule
            maxlength="20"
          ></el-input>
        </div>
        <div class="mt20 ml30">
          手机：
          <el-input
            v-model="memberAdd.phoneNumber"
            v-inputRule
            maxlength="20"
          ></el-input>
        </div>
        <div class="mt20 ml30">
          密码：
          <el-input
            v-model="memberAdd.password"
            v-inputRule
            maxlength="20"
          ></el-input>
        </div>
        <div class="mt20 ml30" v-if="!memberAdd.isSuperAdmin">
          角色：
          <el-input
            v-model="memberAdd.roles"
            v-inputRule
            maxlength="20"
          ></el-input>
        </div>
        <div class="mt20 ml30">
          备注：
          <el-input
            v-model="memberAdd.note"
            v-inputRule
            maxlength="20"
          ></el-input>
        </div>
        <div class="mt20 ml30">
          超级管理员：
          <el-switch v-model="memberAdd.isSuperAdmin" @change="changeChild" />
        </div>
        <!-- <div class="mt20" v-if="dialogStatus==='create'">
        角色名称：
        <el-input v-model="roleName" v-inputRule maxlength="20"></el-input>
      </div>
      <div class="mt20">
        分组权限：
        
      </div>
      <div class="mt20">
        部门主管：
        <el-input placeholder="请输入后台管理员账户" v-inputNumber v-model="userPhone" maxlength="11"  @keyup.enter.native="searUsers"></el-input>
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
      </div> -->
        <div slot="footer" class="dialog-footer tac">
          <el-button
            type="dqx-btn"
            @click="dialogStatus === 'create' ? createData() : updateData()"
            >{{ dialogStatus === "create" ? "保存" : "编辑" }}</el-button
          >
          <el-button @click="cancle">取消</el-button>
        </div>
      </el-dialog>
  
    </div>
  </div>
</template>
<script>
import {
  getDep,
  getDepDet,
  putDepDet,
  addDep,
  getAllAut,
  userList,
  getDepAut,
  putRole,
  getSystemDept,
  deleteSystemDept,
  editSystemDept,
  systemDeptAdd,
  getSystemMember,
  memberEnable,
  memberDisable,
  memberDelete,
  memberAdd
} from "@/api/staff";
import TopTab from "@/views/common/top-tab";
export default {
  components: {
    TopTab
  },
  data() {
    return {
      gridData: [],
      dialogTableVisible: false,
      tabList: [{ name: "启用", value: 1 }, { name: "禁用", value: 0 }],
      deptId: null,
      tableData: [],
      dialogVisible: false,
      dialogFormVisible: false,
      rolesList: [],
      isChild: false,
      dtoAddDept: {
        deptName: ""
      },
      roleName: "",
      dialogStatus: "create",
      userPhone: "",
      userId: "",
      depId: 0,
      roleManName: "",
      roleId: 0,
      SystemMemberParmas: {
        pageNum: 1,
        pageSize: 10,
        state: 1
      },
      memberAdd: {
        isSuperAdmin: false,
        note: "",
        occupation: "",
        password: "",
        phoneNumber: "",
        realName: "",
        roles: [],
        state: 1
      }
    };
  },
  methods: {
    switchChange(val, item) {
      console.log(val, item);
    },
    // 取消添加
    async cancle() {
      this.dtoAddDept.deptName = "";
      this.roleName = "";
      this.userPhone = "";
      this.isChild = false;
      this.dialogFormVisible = false;
    },
    // 确认修改角色
    async changeRole() {
      let roleIds = [];
      this.rolesList.map(res => {
        res.items.map(res => {
          if (res.selected) {
            roleIds.push(res.id);
          }
        });
      });
      putRole(this.roleId, roleIds).then(_ => {
        this.$message("修改成功");
        this.dialogVisible = false;
      });
    },
    // 主管角色修改
    async setRole(val) {
      this.dialogVisible = true;
      this.roleId = val.masterRole.id;
      this.roleManName = val.masterRole.name;
      let data = await this.getDepAuts(val.id);
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
    },
    // 部门修改
    async set(val) {
      this.dialogStatus = "update";
      this.depId = val;
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
        this.dtoAddDept.deptName = res.data.name;
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
      if (this.userPhone.length != 11) {
        this.$message("请输入完整用户手机");
        return;
      }
      return new Promise((resolve, reject) => {
        userList({ key: this.userPhone, all: 1 }).then(res => {
          return resolve(res.data);
        });
      });
    },
    // 新增部门
    async addDepart() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    // 获取部门列表
    async getDeps() {
      const res = await getSystemMember(this.SystemMemberParmas);
      const { list, total, pageNum } = res.data;
      this.tableData = list;
      this.tableData.map(item => {
        item.isSuperAdmin === true
          ? (item.isSuperAdmin = "是")
          : (item.isSuperAdmin = "否");
        item.state === 1 ? (item.state = true) : (item.state = false);
      });

      // getDep().then(res => {
      //   this.tableData = res.data;
      // });
    },
    // 设置子部门权限
    async changeChild(val) {
      // this.isChild = !this.isChild;
      if (!memberAdd.isSuperAdmin) this.memberAdd.roles = [];
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
      const res = await memberAdd(this.memberAdd);
      if (res) {
        if (res.code == 200) {
          (this.memberAdd.isSuperAdmin = false),
            (this.memberAdd.note = ""),
            (this.memberAdd.occupation = ""),
            (this.memberAdd.password = ""),
            (this.memberAdd.phoneNumber = ""),
            (this.memberAdd.realName = ""),
            (this.memberAdd.roles = ""),
            this.$message("添加成员成功");
          this.dialogFormVisible = false;
          this.getDeps();
        }
      }
    },
    // 修改事件
    async updateData() {
      const res = await editSystemDept({
        deptName: this.dtoAddDept.deptName,
        deptId: this.deptId
      });
      if (res) {
        if (res.code === 200) {
          this.dtoAddDept.deptName = "";
          this.$message("编辑部门成功");
        }
      }
      this.dialogFormVisible = false;
      this.getDeps();
      // let data = await this.searUser();
      // let userId = "";
      // if (data.length > 0) {
      //   userId = data[0].id;
      // } else {
      //   this.$message("不存在该用户");
      // }
      // putDepDet(this.depId, {
      //   name: this.dtoAddDept.deptName,
      //   manager: userId,
      //   hasChildren: this.isChild
      // }).then(_ => {
      //   this.$message("修改成功");
      //   this.dialogFormVisible = false;
      //   this.getDeps();
      // });
    },
    async deleteMember(i, item) {
      // const res = await deleteSystemDept(item.id);
      const res = await memberDelete(item.adminUserId);
      if (res) {
        if (res.code === 200) {
          this.$message("删除成员成功");
          this.getDeps();
        }
      }
    },
    async memberDisable(val, item) {
      const res = await memberDisable(item.adminUserId);
      if (res) {
        if (res.code === 200) {
          this.$message("停用成员成功");
          this.getDeps();
        }
      }
    },
    async memberEnable(val, item) {
      console.log(item);
      const res = await memberEnable(item.adminUserId);
      if (res) {
        if (res.code === 200) {
          this.$message("启用成员成功");
          this.getDeps();
        }
      }
    },
    chooseTab(val) {
      this.SystemMemberParmas.state = val;
      this.getDeps();
    }
  },
  mounted() {
    this.$store.commit("setPaging", false);
    this.getDeps();

    // getAllAut().then(res => {
    //   this.rolesList = res.data;
    // });
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-input {
  display: inline-block;
  width: calc(100% - 250px);
}
/deep/.el-dialog {
  margin-top: 5vh !important;
}
.show-tab {
  display: inline-block;
  width: 120px;
  text-align: center;
}
.show-tab + .show-tab {
  border-left: 1px solid #f5f5f5;
}
/deep/.inputFlieA {
  position: absolute;
  width: 120px;
  margin-top: -40px;
  height: 40px;
  margin-left: 70px;
  opacity: 0;
}
</style>
