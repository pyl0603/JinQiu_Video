<template>
  <div class="permissions">
    <el-row>
      <div class="el-col-16 mt10 mb20 cada f14">
        <span class="show-tab cp" v-for="(item,index) in tabList" :key="index" @click="tabs(item,index)" :class="{c18c : index === itemIndex}">{{item.name}}</span>
      </div>
      <el-col :span="8" class="tar">
        <el-button type="dqx-btn" class="ml20" @click="addNew">新增员工</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%;" class="mt20">
      <!-- <el-table-column prop="time" label="账户" class="el-col-4"></el-table-column> -->
      <el-table-column prop="nickname" label="姓名" class="el-col-4"></el-table-column>
      <el-table-column prop="post" label="职务"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <!-- <el-table-column prop="province" label="允许登录"></el-table-column> -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button> -->
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否超级管理员" width="200">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.admin"
            @change="changeSwitch($event, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <!-- <el-table :data="tableData" border style="width: 100%;" class="mt20">
      <el-table-column prop="mobile" label="账号" class="el-col-4"></el-table-column>
      <el-table-column prop="realName" label="姓名" class="el-col-4"></el-table-column>
      <el-table-column label="是否超级管理员" width="200">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.admin"
            @change="changeSwitch($event, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table> -->
    <!-- 弹窗 -->
    <el-dialog title="新增员工" :visible.sync="dialogFormVisible" :show-close="false">
      <el-form
        ref="temp"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="85px"
        style="width:100%;"
      >
        <el-form-item label="员工头像:" prop="avater">
          <span class="up-img mt60" v-if="temp.avatar == ''">
            <svg-icon icon-class="tupian"></svg-icon>
          </span>
          <div class="upload-after" v-if="temp.avatar != ''">
            <img :src="temp.avatar" alt>
          </div>
          <upload ref="upload" @upImg="upImg"></upload>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="temp.mobile"/>
        </el-form-item>
        <el-form-item label="姓名:" prop="realName">
          <el-input v-model="temp.realName"/>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item label="性别:" prop="gender.value">
          <el-radio-group v-model="temp.gender.value">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限:" prop="temp.admin">
          <el-radio-group v-model="temp.admin">
            <el-radio label="0">超级管理员</el-radio>
            <el-radio label="1">编辑</el-radio>
          </el-radio-group>
          <!-- <el-select v-model="value" placeholder="请选择" @change="changeRole">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="登录密码:" prop="password">
          <el-input v-model="temp.password" type="password"/>
        </el-form-item>
        <el-form-item label="职务:" prop="post">
          <el-input v-model="temp.post"/>
        </el-form-item>
        <el-form-item label="确认密码:" prop="repassword">
          <el-input v-model="temp.repassword" type="password"/>
        </el-form-item>
        <el-form-item label="备注:" prop="introduction">
          <el-input v-model="temp.introduction"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="dqx-btn"
          @click="dialogStatus==='create'?createData('temp'):updateData()"
        >保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addStaff,userList,changeInfo } from "@/api/staff";
import { getMyDep,getDepUser } from '@/api/staff'
import { mapGetters } from 'vuex'
import upload from "@/components/UploadImg/index";
export default {
  data() {
    // 确认密码校验
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error("密码长度为6 - 18个字符"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.temp.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      startImg: "",
      tabList:[],
      depId:0,
      itemIndex:0,
      dataRang: "",
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: "create",
       options: [
        {
          value: 0,
          label: "编辑"
        },
        {
          value: 1,
          label: "审核"
        },
        {
          value: true,
          label: "主编"
        },
        {
          value: 3,
          label: "副主编"
        },
        {
          value: 2,
          label: "修改"
        }
      ],
      value:'',
      temp: {
        id:'',
        avatar: "",
        mobile: "",
        email: "",
        realName: "",
        gender: {value:'1'},
        post: "",
        password: "",
        repassword: "",
        introduction: "",
        admin: '0'
      },
      rules: {
        avatar: [
          { required: true, message: "请上传用户头像", trigger: "change" }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        post: [{ required: true, message: "请输入职务", trigger: "blur" }],
        introduction: [
          { required: true, message: "请输入介绍", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        repassword: [
          { required: true, validator: validatePass2, trigger: "change" }
        ]
      },
      statusOptions: ["published", "draft", "deleted"]
    };
  },
  components: {
    upload
  },
  methods: {
    // 更新信息
    updateData(){
      changeInfo(this.temp.id,{
        avatar:this.temp.avatar,
        mobile:this.temp.mobile,
        email: this.temp.email,
        realName: this.temp.realName,
        gender: this.temp.gender.value == '1' ? 1 : 0,
        post: this.temp.post,
        password: this.temp.password,
        introduction: this.temp.introduction,
        admin: this.temp.admin == '1' ? true : false
        }).then(_ => {
          this.$message("操作成功");
          this.dialogFormVisible = false;
      })
    },
    // 选择角色
    changeRole(val){
      console.log(val)
    },
    // 编辑
    edit(val){
      this.dialogStatus = 'update'
      this.temp = val
      this.temp.admin == this.temp.admin ? '1' : '0'
      console.log(this.temp.enabled)
      this.dialogFormVisible = true;
    },
    // 是否展示
    changeSwitch(val, row) {
      row.admin = val;
      changeInfo(row.id, {admin:row.admin} ).then(_ => {
        this.$message("操作成功");
      })
      // changeShow(row.id, { value: row.admin }).then(_ => {
      //   this.$message("操作成功");
      // });
    },
    addNew() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    // 图片上传
    upImg(val) {
      this.temp.avatar = val;
    },
    // 新增员工
    createData(temp) {
      this.$refs[temp].validate(valid => {
        if (valid) {
          let data = {
            avatar: this.temp.avatar,
            mobile: this.temp.mobile,
            email: this.temp.email,
            realName: this.temp.realName,
            gender: this.temp.gender.value == '1' ? 1 : 0,
            post: this.temp.post,
            password: this.temp.password,
            introduction: this.temp.introduction,
            admin: this.temp.admin == '1' ? true : false
            // enabled:this.temp.enabled
            // admin:true
          };
          addStaff(data).then(_ => {
            this.$message("操作成功");
            this.dialogFormVisible  = false;
          });
        }
      });
    },
    // 切换部门
    async tabs(val,e){
      this.itemIndex = e;
      this.depId = val.id;
    },
     // 获取当前用户的部门列表
    async getDeps(){
      getMyDep().then(res => {
        this.tabList = res.data;
        this.depId = res.data[0].id
      })
    },
    // 获取员工列表
    getList(){
      getDepUser(this.depId).then(res => {
        this.tableData = res.data;
      })
    }
  },
  mounted() {
    this.$store.commit("setPaging", false);
    this.getDeps();
  },
  computed: {
    dataList() {
      let val = [this.page];
      return val;
    },
    ...mapGetters(['page'])
  },
  watch: {
    dataList(newVal) {
      this.getList();
    },
    depId(newVal){
      this.getList();
    },
    page(newVal){
        console.log(newVal)
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item {
  display: inline-block;
  width: 40%;
  &:nth-child(2n) {
    margin-left: 10%;
  }
}
.up-img {
  display: inline-block;
  position: absolute;
  margin-top: -20px;
  width: 80px;
  height: 80px;
  line-height: 0px;
  font-size: 45px;
  background: #f0f0f0;
  text-align: center;
  .svg-icon {
    margin-top: 15px;
  }
}
/deep/.inputFlie {
  width: 80px;
  height: 80px;
  position: absolute;
  margin-top: -20px;
  // margin-left: 0;
  opacity: 0;
  z-index: 1;
}
.upload-after {
  position: absolute;
  margin-top: -20px;
  img {
    width: 80px;
    height: 80px;
  }
}
.show-tab {
  display: inline-block;
  width: 120px;
  text-align: center;
}
.show-tab + .show-tab {
  border-left: 1px solid #f5f5f5;
}
</style>

