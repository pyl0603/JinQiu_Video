<template>
  <div class="diss">
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <el-row>
      <div class="el-col-24 tar">
       <el-select v-model="values" placeholder="请选择" class="mr60">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select> 
      </div>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 300px)"
    >
      <el-table-column label="标题" prop="summary">
      </el-table-column>
      <el-table-column label="用户昵称">
        <template slot-scope="scope">
          {{scope.row.author.nickname}}
        </template>
      </el-table-column>
      <el-table-column label="评论内容">
        <template slot-scope="scope">
          {{
          scope.row.content
        }}
        <!-- <img :src="scope.row.photo" alt=""> -->
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          {{ scope.row.status.display}}
        </template>
      </el-table-column>
      <el-table-column label="驳回理由">
        <template slot-scope="scope">
          {{ scope.row.reason.value == -1  ? '' : scope.row.reason.display}}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="200">
        <template slot-scope="scope">{{ scope.row.createdAt  | formatTime }}</template>
      </el-table-column>
      <!-- <el-table-colum label="发布时间"></el-table-colum> -->
      <el-table-column label="调整" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.photo && scope.row.photo != ''" @click="url = scope.row.photo,imgShow = true"
            >查看图片</el-button
          >
          <el-button @click="pass(scope.row.id)" type="text" size="small"
            >通过</el-button
          >
           <el-button @click="id = scope.row.id,innerVisible = true" type="text" size="small"
            >驳回</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        width="50%"
        title=""
        :visible.sync="imgShow"
        style="margin-top:10vh!important;text-align:center"
      >
      <img :src="url" alt="" style="height:400px">
    </el-dialog>
      <el-dialog
        width="30%"
        title="驳回"
        :visible.sync="innerVisible"
        style="margin-top:20vh!important;"
      >
        <div>
          <el-radio-group v-model="radio">
            <el-radio :label="item.value" v-for="(item,index) in reasonList" :key="index">{{item.display}}</el-radio>
          </el-radio-group>
          <div slot="footer" class="dialog-footer tac mt20">
            <el-button type="dqx-btn" @click="confirm">确定</el-button>
            <el-button @click="innerVisible=false">取消</el-button>
          </div>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import { formatTime } from "@/utils/index.js";
import { getComments,commentsPass,commentsDenyList,commentsDeny } from "@/api/public"
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tabList: [
        { name: "待审核", value: 0 },
        { name: "审核通过", value: 1 },
        { name: "审核驳回", value: 2 }
      ],
      innerVisible:false,
      tableData: [],
      planStatus:0,
      radio:-1,
      options:[{id:0,name:'文章'},{id:1,name:'视频'},{id:4,name:'帖子回复'}],
      values:0,
      reasonList:[],
      id:null,
      imgShow: false,
      url:''
    };
  },
  filters: {
    checkTxt(txt) {
      let txtList = {
        0: "未审核",
        1: "审核通过",
        2: "审核驳回"
      };
      return txtList[txt];
    },
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components: {
    TopTab
  },
  methods: {
    getIndex(){
      getComments({page:this.page,page_size:10,status:this.planStatus,type:this.values}).then(res => {
        this.tableData = res.data
          this.total = res.meta.pagination.total;
      })
    },
    // 状态筛选
    chooseTab(e) {
      this.planStatus = e;
    },
    // 查看大图
    seePhoto(e){},
    //详情
    itemDet(e) {
      this.dialogVisible = true;
      this.itemData = e;
    },
    pass(e){
      commentsPass(e).then(res => {
        this.$message('操作成功')
        this.getIndex()
      })
    },
    confirm(){
      commentsDeny(this.id,this.radio).then(res => {
        this.$message('操作成功')
        this.getIndex()
        this.innerVisible = false
      })
    },
    
  },
  async mounted() {
    this.getIndex();
    let { data } = await commentsDenyList()
    this.reasonList = data
    this.$store.commit("setPaging", true);
  },
  computed: {
    ...mapGetters(["page", "uid"]),
    dataList() {
      return [this.planStatus, this.values];
    }
  },
  watch: {
    page(newVal) {
      this.getIndex();
    },
    dataList(newVal){
      if(this.page!=1){
        this.$store.commit('setPage',1)
      }else{
        this.getIndex()
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.el-input{
  width: 200px;
}
/deep/.el-dialog {
  margin-top: 10vh !important;
}
.el-radio {
  display: block;
  margin-top: 20px;
}
.to-margin{
  .el-row{
    margin-bottom: 10px;
  }
  .el-input,.el-textarea{
    width: calc(100% - 100px);
  }
}
/deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner{
  background: #409EFF;
  color: #ffffff;
}
/deep/.dis-det {
  max-height: calc(100vh - 180px);
  overflow-y: scroll;
  .lineHeight {
    line-height: 28px;
  }
  img {
    width: 100%;
  }
}
</style>
