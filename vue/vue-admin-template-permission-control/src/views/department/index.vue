<template>
  <div class="department">
    <div class="new-tab tar">
      <el-button type="dqx-btn" @click="permissionList">权限</el-button>
      <el-button type="dqx-btn" @click="roleList">角色</el-button>
      <el-button type="dqx-btn" @click="addDepart">新增部门</el-button>
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
        prop="deptName"
        label="部门"
        class="el-col-8"
      ></el-table-column>
      <!-- <el-table-column
        prop="masterRole.name"
        label="主管角色"
        class="el-col-6"
      ></el-table-column>
      <el-table-column
        prop="manager.nickname"
        label="主管人员"
        width="200"
      ></el-table-column> -->
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
            @click="deleteDept(scope.$index, scope.row)"
            type="text"
            size="small"
            >删除</el-button
          >
          <el-button
            @click="editDept(scope.$index, scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            @click="createdRole(scope.$index, scope.row)"
            type="text"
            size="small"
            >添加角色</el-button
          >
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
      :title="dialogStatus === 'create' ? '新增部门' : '编辑部门'"
      :visible.sync="dialogFormVisible"
      :show-close="false"
    >
      <div>
        部门名称：
        <el-input
          v-model="dtoAddDept.deptName"
          v-inputRule
          maxlength="20"
        ></el-input>
      </div>
      <!-- <div class="mt20" v-if="dialogStatus==='create'">
        角色名称：
        <el-input v-model="roleName" v-inputRule maxlength="20"></el-input>
      </div>
      <div class="mt20">
        分组权限：
        <el-switch :value="isChild" @change="changeChild" />
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
    <el-dialog
      :title="Edit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisibleRoles"
    >
      <el-row>
        <el-col>
          <el-row type="flex">
            <el-col :span="2" style="lineHeight:250%">角色名称：</el-col>
            <el-col>
              <el-input
                v-model="roleAddParmas.roleName"
                placeholder="请输入内容"
              ></el-input
            ></el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" class="mt20">
            <el-col :span="2" style="lineHeight:250%">角色权限：</el-col>
            <el-col>
              <el-select
                v-model="roleAddParmas.permissionIds"
                multiple
                collapse-tags
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRoles = false">取 消</el-button>
        <el-button type="dqx-btn" @click="handleClickRole">{{
          Edit ? "编 辑" : "添 加"
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="角色列表" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column
          property="roleName"
          label="角色"
          width="150"
        ></el-table-column>
        <el-table-column
          property="dept.deptName"
          label="部门"
          width="200"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRole(scope.$index, scope.row)"
              type="text"
              size="small"
            >
              删除
            </el-button>
            <el-button
              @click.native.prevent="editRole(scope.$index, scope.row)"
              type="text"
              size="small"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="权限" :visible.sync="dialogTableVisibleSystem">
      <el-table :data="gridDataSystem">
        <el-table-column
          property="id"
          label="ID"
          width="150"
        ></el-table-column>
        <el-table-column
          property="name"
          label="权限"
          width="200"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="permissionDlete(scope.$index, scope.row)"
              type="text"
              size="small"
            >
              删除
            </el-button>
            <el-button
              @click.native.prevent="permissionEdit(scope.$index, scope.row)"
              type="text"
              size="small"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDepDet,
  userList,
  getDepAut,
  putRole,
  getSystemDept,
  deleteSystemDept,
  editSystemDept,
  systemDeptAdd,
  roleAdd,
  getSystemRole,
  deleteRole,
  editRole,
  systemPermission,
  deletesystemPermission,
  editSystemPermission
} from "@/api/staff";
export default {
  data() {
    return {
      dialogTableVisibleSystem: false,
      gridDataSystem: [],
      Edit: false,
      dialogTableVisible: false,
      gridData: [],
      roleAddParmas: {
        deptId: null,
        permissionIds: [],
        roleName: ""
      },
      roleParmas: {
        pageNum: 1,
        pageSize: 10
      },
      options: [],
      rolesValue: [],
      dialogVisibleRoles: false,
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
      getSystemDeptParmas: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    permissionEdit(){

    },
    async permissionDlete (i,item){
      console.log(i,item);
      const res = await deletesystemPermission(item.id)
      if(res){
        if(res.code===200){
          this.$message("权限已删除");
               const res = await systemPermission({ pageNum: 1, pageSize: 100 });
      if (res) {
        const { list } = res.data;
        if (res.code === 200) {
          this.gridDataSystem = list;
        }
      }

        }
      }
    },
    async permissionList() {
      this.dialogTableVisibleSystem = true
      const res = await systemPermission({ pageNum: 1, pageSize: 100 });
      if (res) {
        const { list } = res.data;
        if (res.code === 200) {
          this.gridDataSystem = list;
        }
      }
    },
    async editRole(i, item) {
      let id = [];
      item.permissions.map(item => {
        id.push(item.id);
      });
      this.dialogVisibleRoles = true;
      this.Edit = true;
      this.roleAddParmas.deptId = item.dept.id;
      this.roleAddParmas.permissionIds = id;
      this.roleAddParmas.roleName = item.roleName;
      this.roleId = item.id;
      this.getRolesList();
    },
    async deleteRole(i, item) {
      console.log(i, item);
      const res = await deleteRole(item.id);
      if (res) {
        if (res.code === 200) {
          this.$message("角色已删除");
          this.roleList();
        }
      }
    },
    async roleList() {
      this.dialogTableVisible = true;
      const res = await getSystemRole(this.roleParmas);
      if (res) {
        if (res.code === 200) {
          console.log(res);
          const { list } = res.data;
          this.gridData = list;
        }
      }
    },
    async handleClickRole() {
      if (this.Edit) {
        const res = await editRole({
          deptId: this.roleAddParmas.deptId,
          permissionIds: this.roleAddParmas.permissionIds,
          roleId: this.roleId,
          roleName: this.roleAddParmas.roleName
        });
        if (res) {
          if (res.code === 200) {
            this.roleAddParmas.deptId = null;
            this.roleAddParmas.permissionIds = [];
            this.roleAddParmas.roleName = "";
            this.roleId = "";
            this.$message("角色编辑完成");
            this.dialogVisibleRoles = false;
            this.roleList();
          }
        }
      } else {
        const res = await roleAdd(this.roleAddParmas);
        if (res) {
          if (res.code === 200) {
            this.roleAddParmas.deptId = null;
            this.roleAddParmas.permissionIds = [];
            this.roleAddParmas.roleName = "";
            this.$message("角色添加完成");
            this.dialogVisibleRoles = false;
          }
        }
      }
    },
    async createdRole(val, item) {
      this.Edit = false;
      this.roleAddParmas.permissionIds = [];
      this.roleAddParmas.roleName = "";
      this.roleAddParmas.deptId = item.id;
      this.dialogVisibleRoles = true;
      this.getRolesList();
    },
    async getRolesList() {
      let options = []
      const res = await systemPermission({ pageNum: 1, pageSize: 100 });
      if (res) {
        const { list } = res.data;
        if (res.code === 200) {
          this.options = list;
        console.log(list);
        }
      }
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
      const res = await getSystemDept(this.getSystemDeptParmas);
      const { list, total, pageNum } = res.data;
      this.tableData = list;

      // getDep().then(res => {
      //   this.tableData = res.data;
      // });
    },
    // 设置子部门权限
    async changeChild(val) {
      this.isChild = !this.isChild;
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
      const res = await systemDeptAdd(this.dtoAddDept);
      if (res) {
        if (res.code == 200) {
          this.dtoAddDept.deptName = "";
          this.$message("添加部门成功");
          this.dialogFormVisible = false;
          this.getDeps();
        }
      }
      // let roleIds = [];
      // this.rolesList.map(res => {
      //   res.items.map(res => {
      //     if (res.selected) {
      //       roleIds.push(res.id);
      //     }
      //   });
      // });
      // let data = await this.searUser();
      // let userId=''
      // if(data.length>0){
      //   userId = data[0].id
      // }else{
      //   this.$message('不存在该用户')
      // }
      // addDep({
      //   name: this.dtoAddDept.deptName,
      //   roleName: this.roleName,
      //   authorities: roleIds,
      //   hasChildren: this.isChild,
      //   manager: userId
      // }).then(_ => {
      //   this.$message("添加成功");
      //   this.dialogFormVisible = false;
      //   this.getDeps();
      // });
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
    async deleteDept(i, item) {
      const res = await deleteSystemDept(item.id);
      if (res) {
        if (res.code === 200) {
          this.$message("删除部门成功");
          this.getDeps();
        }
      }
    },
    async editDept(i, item) {
      console.log(item);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.dtoAddDept.deptName = item.deptName;
      this.deptId = item.id;
      // const res = await editSystemDept();
      // this.getDeps();
    }
  },
  mounted() {
    this.$store.commit("setPaging", false);
    this.getDeps();
    // getSystemRole({pageNum:1,pageSize:100})
    // getAllAut().then(res => {
    //   this.rolesList = res.data;
    // });
  }
};
</script>
