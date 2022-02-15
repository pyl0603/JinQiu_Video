<template>
  <div class="feedback">
    <el-row class="sear-header">
      <el-col :span="24" class="tar">
         <el-select v-model="value" placeholder="请选择" class="mr30">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
          搜索：
          <el-input v-inputRule v-model="key"  @keyup.enter.native="sear"></el-input>
          <el-button type="dqx-btn" class="ml20" @click="sear">查询</el-button>
          <el-button @click="reSet">重置</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%;" class="mt20" height="calc(100vh - 310px)">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button @click="seeDet(scope.row.id)" type="text" size="small">查看</el-button> -->
          <el-button @click="reply(scope.row)" type="text" size="small">回复</el-button>
          <el-button @click="del(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="反馈内容">
        <template  slot-scope="scope">
          <div class="hidden-sth">
          {{scope.row.content}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template  slot-scope="scope">
          {{scope.row.done?'已回复':'未回复'}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户名"  width="150"></el-table-column>
      <el-table-column prop="email" label="用户邮箱"  width="200"></el-table-column>
      <el-table-column prop="mobile" label="用户手机"  width="150"></el-table-column>
      <el-table-column label="反馈时间"  width="150">
        <template slot-scope="scope">
          {{scope.row.createdAt | formatTime }} 
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog title="回复反馈" :visible.sync="dialogVisible" width="40%" :show-close="false">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="105px"
        style="width:100%;"
      >
        <el-form-item label="反馈来源:" prop="nickname">
          <el-input v-model="temp.nickname" readonly="readonly"/>
        </el-form-item>
        <el-form-item label="反馈内容:" prop="content">
          <el-input type="textarea" v-model="temp.content" readonly="readonly"/>
        </el-form-item>
        <el-form-item label="联系方式:" prop="contact">
          <el-input v-model="temp.contact" readonly="readonly"/>
        </el-form-item>
        <el-form-item label="回复方:" prop="replyName">
          <el-input v-model="temp.replyName" v-inputRule placeholder="今球官方"/>
        </el-form-item>
        <el-form-item label="回复内容:" prop="replyCont">
          <el-input type="textarea" v-inputRule v-model="temp.replyCont" maxlength="200"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="dqx-btn" @click="dialogStatus==='create'?createData():updateData()">保存</el-button> -->
        <el-button type="dqx-btn" @click="confirm">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getIndex,feedback,delFeedback } from "@/api/feedback";
import { formatTime } from "@/utils/index.js";
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      dataRang: "",
      tableData: [],
      dialogVisible: false,
      replyId:'',
      key:'',
      keys:'',
      dialogStatus: "create",
      options:[{name:'全部',id:''},{name:'已回复',id:1},{name:'未回复',id:0}],
      value:'',
      temp: {
        nickname:'',
        content:'',
        replyName: "",
        replyCont: "",
        contact:""
      },
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        replyCont:[
          { required: true, message: "请输入回复内容", trigger: "blur" }
        ]
      }
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  methods: {
    reSet(){
      this.key = '';
      this.keys = this.key;
    },
    sear(){
      this.keys = this.key;
    },
    handleClick(val) {},
    // 查看详情
    seeDet(val){
      // this.dialogVisible = true;
      // 查看详情

    },
    // 回复弹窗
    reply(val){
      this.replyId = val.id;
      this.temp.nickname = val.nickname
      this.temp.contact = val.contact ? val.contact : ''
      this.temp.content = val.content
      this.temp.replyName = '今球官方'
      this.temp.replyCont = ''
      this.dialogVisible = true;
    },
    // 确认回复
    confirm(){
      feedback(this.replyId,{name:this.temp.replyName,content:this.temp.replyCont}).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
      })
    },
    // 删除反馈
    del(val){
      delFeedback(val).then(res => {
        this.$message("操作成功");
        this.getIndexs();
      })
    },
    getIndexs(){
      
    getIndex({page:this.page,key:this.keys,done:this.value}).then(res => {
      this.tableData = res.data;
      this.$store.commit("setTotal", res.meta.pagination.total);
    });
    },
  },
  mounted() {
    this.$store.commit("setPaging", true);
    this.getIndexs();
  },
  computed:{
    ...mapGetters(['page']),
    dataList(){
      return [this.keys,this.value]
    }
  },
  watch:{
    page(newVal){
      this.getIndexs()
    },
    dataList(newVal){
      if(this.page != 1){
        this.$store.commit('setPage',1)
      }else{
        this.getIndexs()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.feedback {
  .hidden-sth{
    display: block;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .el-range-editor.el-input__inner {
    width: 40%;
  }
  .sear-header .el-input {
    display: inline-block;
    width: calc(50% - 300px);
  }
  .el-dialog {
    .el-input {
      width: calc(100% -150px);
    }
  }
}
</style>
