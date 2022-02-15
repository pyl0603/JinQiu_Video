<template>
  <div class="diss">
    <el-row>
      <div class="el-col-16 tar">
        <!-- 选择圈子：
        <el-select v-model="values" placeholder="请选择" class="mr60">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select> -->
        选择状态：
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="el-col-8 tar">
        搜索：
        <el-input class="mr20" v-model="keyworlds" v-inputRule  @keyup.enter.native="setTitle"></el-input>
        <el-button type="dqx-btn" @click="setTitle">查询</el-button>
        <el-button @click="value = '',keyworlds = '',title = ''">重置</el-button>
      </div>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="mb10 mt10"
      height="calc(100vh - 300px)"
    >
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="帖子标题"></el-table-column>
      <el-table-column prop="nickname" label="作者"></el-table-column>
      <el-table-column prop="commentCount" label="浏览量"></el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">{{scope.row.isDenied | checkTxt}}</template>
      </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
         {{scope.row.createdAt | formatTime}}
        </template>
      </el-table-column>
      <el-table-column label="调整" width="300">
        <template slot-scope="scope">
          <el-button
                size="mini"
                type="text"
                @click="advUrl(scope.row.id)"
                >广告链接</el-button
              >
          <el-button @click="itemDet(scope.row.id)" type="text" size="small">详情</el-button>
          <el-button
            @click="scope.row.isTop ? setUntop(scope.row.id):setTop(scope.row.id)"
            type="text"
            size="small"
            v-if="uid === scope.row.community.managerId"
          >{{scope.row.isTop?'取消置顶':'置顶'}}</el-button>
          <el-button @click="del(scope.row.id)" type="text" size="small" v-if="uid === scope.row.community.managerId">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.isRecommond"
            @change="changeRec($event, scope.row)"
            v-if="uid === scope.row.community.managerId"
          />
          <em v-if="uid != scope.row.community.managerId">无操作权限</em>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加类别" :visible.sync="dialogVisible" width="40%" :show-close="true">
      <el-dialog
        width="30%"
        title="驳回理由"
        :visible.sync="innerVisible"
        append-to-body
        style="margin-top:20vh!important;"
      >
        <div>
          <el-radio-group v-model="radio">
            <el-radio :label="1">广告，软文等营销内容</el-radio>
            <el-radio :label="2">文章内容与标题严重不符</el-radio>
            <el-radio :label="3">文章开头，正文主体（图片信息）包含各种联系方式</el-radio>
            <el-radio :label="4">淫秽色情</el-radio>
            <el-radio :label="5">违法信息</el-radio>
          </el-radio-group>
          <div slot="footer" class="dialog-footer tac mt20">
            <el-button type="dqx-btn" @click="cancle">确定</el-button>
            <el-button @click="innerVisible=false">取消</el-button>
          </div>
        </div>
      </el-dialog>
      <det ref="Det" :disTitle="disTitle" :disTime="disTime" :disCont="disCont" :disImg="disImg"></det>
      <div slot="footer" class="dialog-footer tac">
        <el-button type="dqx-btn" @click="confirm">通过</el-button>
        <el-button @click="innerVisible=true">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Det from "@/views/common/dis-det";
import { formatTime } from "@/utils/index.js";
import {
  getGroupsUser,
  getDisc,
  getDiscDet,
  delDis,
  disTop,
  disUntop,
  disRec,
  disDeny,
  disUndeny
} from "@/api/circle";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      options: [], //圈子列表
      values: "", //圈子选择
      option: [
        { name: "全部", value: '' },
        { name: "未审核", value: 0 },
        { name: "审核通过", value: 1 },
        { name: "审核驳回", value: 2 }
      ], //状态列表
      value: "", //状态选择
      tableData: [],
      keyworlds: "",
      dialogVisible: false,
      title: "",
      // 详情
      disTitle: "",
      disTime: 0,
      disCont: "",
      disImg: [],
      id: "",
      innerVisible: false,
      radio: 1
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
    Det
  },
  methods: {
    // 生成分享链接
    advUrl(val) {
      this.copy("https://m.jinqiulive.com/discusses.html?id=" + val)
    },
    copy(data) {
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "复制成功",
        type: "success"
      });
      oInput.remove();
    },
    // 原因选择
    async changeItem(val, e) {
      console.log(val, e);
    },
    // 获取圈子分类
    async getGroupsUsers() {
      getGroupsUser().then(res => {
        this.options = res.data;
        if(res.data.length>0){
          this.values = res.data[0].id;
        }else{
          this.$store.commit("setTotal", 0);
        }
      });
    },
    // 获取帖子列表
    async getDiscs() {
      getDisc({
        // community: this.values,
        title: this.title,
        isDenied: this.value,
        page:this.page
      }).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    // 驳回
    async cancle() {
      let denyMessage = '';
      if(this.radio === 1) denyMessage ='广告，软文等营销内容'
      if(this.radio === 2) denyMessage ='文章内容与标题严重不符'
      if(this.radio === 3) denyMessage ='文章开头，正文主体（图片信息）包含各种联系方式'
      if(this.radio === 4) denyMessage ='淫秽色情'
      if(this.radio === 5) denyMessage ='违法信息'
      disDeny(this.id,{denyMessage:denyMessage}).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.innerVisible = false;
        this.getDiscs();
      });
    },
    //   通过
    async confirm() {
      disUndeny(this.id).then(_ => {
        this.$message("操作成功");
        this.dialogVisible = false;
        this.getDiscs();
      });
    },
    //  详情
    async itemDet(val) {
      getDiscDet(val).then(res => {
        this.id = res.data.id;
        this.disTitle = res.data.title;
        this.disTime = res.data.createdAt;
        this.disCont = res.data.content;
        this.disImg = res.data.images;
        this.dialogVisible = true;
      });
    },
    //
    async del(val) {
      this.$confirm("此操作将永久删除该帖子, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delDis(val).then(_ => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getDiscs();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //   是否推荐
    async changeRec(val, e) {
      disRec(e.id).then(_ => {
        this.$message("操作成功");
        this.getDiscs();
      });
    },
    // 置顶
    async setTop(val) {
      disTop(val).then(_ => {
        this.$message("操作成功");
        this.getDiscs();
      });
    },
    // 置顶
    async setUntop(val) {
      disUntop(val).then(_ => {
        this.$message("操作成功");
        this.getDiscs();
      });
    },
    async setTitle() {
      this.title = this.keyworlds;
    }
  },
  async mounted() {
    this.getDiscs();
    this.$store.commit("setPaging", true);
  },
  computed: {
    ...mapGetters(["page","uid"]),
    dataList() {
      return [this.title, this.values, this.value];
    }
  },
  watch: {
    page(newVal){
      this.getDiscs();
    },
    dataList(newVal) {
      this.$store.commit('setPage',1)
      this.getDiscs();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: calc(80% - 200px);
}
/deep/.el-dialog {
  margin-top: 0 !important;
}
.el-radio {
  display: block;
  margin-top: 20px;
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

