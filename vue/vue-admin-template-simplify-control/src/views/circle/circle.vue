<template>
  <div class="circle">
    <div class="new-tab tar">
      <el-select v-model="value" placeholder="请选择" class="mr30">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>搜索：
      <!-- <input type="text"  v-model="searchKey" class="el-input" v-inputRule> -->
      <el-input  v-model="searchKey" v-inputRule></el-input>
      <el-button type="dqx-btn" @click="sear">搜索</el-button>
      <el-button @click="reSet">重置</el-button>
      <el-button type="dqx-btn" @click="addDepart">新增圈子</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 240px)"
    >
      <el-table-column prop="id" label="序号" class="el-col-8"></el-table-column>
      <el-table-column prop="name" label="圈子名称" class="el-col-6"></el-table-column>
      <el-table-column prop="manaMobile" label="管理员" width="200"></el-table-column>
      <!-- <el-table-column prop="startTime" label="帖子数量" width="200"></el-table-column>
      <el-table-column prop="startTime" label="关注数量" width="200"></el-table-column>-->
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="changeItem(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="del(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog :title="dialogStatus==='create' ? '添加圈子' : '修改圈子'" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div class="dialog-upload">
          <em>上传icon：</em>
          <div class="dialog-upload-right">
            <div class="upload-before" v-if="image == ''">
              <svg-icon icon-class="tupian"></svg-icon>
            </div>
            <div class="upload-after" v-if="image != ''">
              <img :src="image" alt />
            </div>
            <upload ref="upload" @upImg="upImg"></upload>
          </div>
        </div>
        <div class="mt20">
          <em>新增圈子：</em>
          <el-input v-inputRule v-model="name"></el-input>
        </div>
        <div class="mt20">
          <em>圈子描述：</em>
          <el-input v-inputRule v-model="desc"></el-input>
        </div>
        <div class="dialog-upload mb20 mt20">
          <em>背景图：</em>
          <div class="dialog-upload-right">
            <div class="upload-before" v-if="bg == ''">
              <svg-icon icon-class="tupian"></svg-icon>
            </div>
            <div class="upload-after" v-if="bg != ''">
              <img :src="bg" alt />
            </div>
            <upload ref="upload" @upImg="upImgBg"></upload>
          </div>
        </div>
        <div class="mt20">
          <em>圈子类别：</em>
          <el-select v-model="values" placeholder="请选择" class="mr30">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="mt20">
          <em>管理员：</em>
          <el-input v-inputNumber v-model="mobile"></el-input>
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
import { mapGetters } from "vuex";
import paging from "@/components/Paging/pop-index";
import upload from "@/components/UploadImg/index";
import { getCircle, getGroups, delCircle, addCircle,putCircle } from "@/api/circle";
export default {
  data() {
    return {
      tableData: [],  //列表数据
      image: "",    //icon
      bg: "",   //背景图
      dialogVisible: false, //  是否显示弹窗
      dialogStatus: "create", //  判断是新增还是修改
      name: "", //圈子名称
      desc: "", //  描述
      mobile: "", //  手机号
      sort: "", //  分类
      options: [],  //  类别列表
      value: "",  //  圈子筛选值
      values:'',  //圈子类别选择
      keyWorlds:'', //  圈子关键字
      searchKey:'',  //  搜索关键字
      id:'',    //圈子id
    };
  },
  methods: {
    // 重置弹窗
    resetModal() {
      this.name = '';
      this.bg = '';
      this.image = '';
      this.desc = '';
      this.values = '';
      this.mobile = '';
      this.id = '';
    },
    // 重置
    async reSet(){
      this.keyWorlds = '';
      this.searchKey = '';
    },
    // 搜索
    async sear(){
      this.keyWorlds = this.searchKey;
    },
    // 圈子类别筛选
    async changeSort(val) {
      // this.value = val;

    },
    // 修改圈子
    async changeItem(val) {
      this.dialogStatus = "update";
      this.name = val.name;
      this.bg = val.bg;
      this.image = val.logo;
      this.desc = val.introduction;
      this.values = val.group.id;
      this.mobile = val.manaMobile;
      this.id = val.id;
      this.dialogVisible = true;
    },
    // 删除圈子
    async del(val) {
      delCircle(val).then(res => {
        this.$message("删除成功");
        this.getCircles();
      });
    },
    // 新增部门
    async addDepart() {
      this.dialogStatus = "create";
      this.resetModal();
      this.dialogVisible = true;
    },
    // 圈子icon
    async upImg(val) {
      this.image = val;
    },
    // 新增
    async createData() {
      addCircle({ name: this.name,group:this.values,bg:this.bg,logo:this.image,introduction:this.desc,mobile:this.mobile }).then(_ => {
        this.$message("添加成功");
        this.dialogVisible = false;
        this.getCircles();
      });
    },
    // 修改
    async updateData() {
      putCircle({ id:this.id,name: this.name,group:this.values,bg:this.bg,logo:this.image,introduction:this.desc,mobile:this.mobile }).then(_ => {
        this.$message("修改成功");
        this.dialogVisible = false;
        this.getCircles();
      });
    },
    // 上传背景图
    async upImgBg(val) {
      this.bg = val;
    },
    // 上传icon
    async upImg(val) {
      this.image = val;
    },
    // 获取圈子列表
    async getCircles() {
      getCircle({ group: this.value,name:this.keyWorlds, page: this.page }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 获取圈子分类
    async getGroup() {
      return new Promise((resolve, reject) => {
        getGroups().then(res => {
          return resolve(res.data);
        });
      });
    }
  },
  components: {
    upload
  },
  async mounted() {
    // this.getCircles();
    let res = await this.getGroup();
    this.options = res;
    this.value = res[0].id;
    this.$store.commit("setPaging", true);
  },
  computed:{
    ...mapGetters(["page"]),
    dataList(){
      return[this.value,this.keyWorlds]
    }
  },
  watch: {
    dataList(newVal) {
      this.$store.commit("setPage", 1);
      this.getCircles();
    },
    page(newVal) {
      //   重新获取列表
      this.getCircles();
    },
  }
};
</script>
<style lang="scss" scoped>
.new-tab {
  .el-input {
    display: inline-block;
    width: 200px;
  }
}
.dialog-upload em {
  display: inline-block;
  width: 80px;
}
.dialog-upload-right {
  display: inline-block;
}
/deep/.inputFlie {
  width: 50px;
  height: 50px;
  position: absolute;
  margin-top: -50px;
  opacity: 0;
  z-index: 1;
  border-radius: 50%;
}
.upload-after {
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
.upload-before {
  width: 50px;
  height: 50px;
  background: #f5f5f5;
  text-align: center;
  border-radius: 50%;
  span {
    display: block;
  }
  .svg-icon {
    font-size: 25px;
    color: #adadad;
    margin-top: 12px;
  }
}
.dialog-cont {

/deep/.el-input{
  width: 200px!important;
}
}
</style>
