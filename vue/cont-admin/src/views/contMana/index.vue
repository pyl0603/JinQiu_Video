<template>
  <div>
    <!-- <top-tab ref="topTab" @chooseTab="chooseTab" :chooseIndex="chooseIndex" :tabList="tabList"></top-tab> -->
    <div class="contMana">
      <el-row>
        <div class="el-col-10 cada">
          <span
            v-for="(item, index) in options"
            :key="item.value"
            @click="changeStatus(item.value, index)"
            class="checkStatus f16 cp"
            :class="{ c18c: itemIndex === index }"
            >{{ item.label }}</span
          >
        </div>
        <div class="el-col-14 tar">
          <span v-if="isPublish">
            只看自己：
            <el-switch
              v-model="isMain"
              active-color="#13ce66"
              inactive-color="#ff4949"
              class="mr20"
            ></el-switch>
          </span>
          <el-button type="dqx-btn" @click="goAdd" class="mr20"
            >添加内容</el-button
          >搜索：
          <el-input v-inputRule v-model="keyworlds" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="搜标题" value="1"></el-option>
              <el-option label="搜作者" value="2"></el-option>
            </el-select>
          </el-input>
          <!-- <el-input class="mr20" v-model="keyworlds"></el-input> -->
          <el-button type="dqx-btn" @click="setTitle">查询</el-button>
          <el-button @click="reSet">重置</el-button>
        </div>
      </el-row>
      <el-row class="mt20">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="calc(100vh - 310px)"
        >
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="seeLook(scope.row.id)"
                v-if="true"
                >推广图片</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="advUrl(scope.row.id)"
                v-if="isPublish"
                >广告链接</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row.id)"
                v-if="isPublish"
                >撤回</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row.id)"
                >查看</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="文章名称">
            <template slot-scope="scope"
              ><em v-if="scope.row.isTop">置顶</em
              >{{ scope.row.title }}</template
            >
          </el-table-column>
          <el-table-column
            prop="author"
            label="文章作者"
            width="250"
          ></el-table-column>
          <el-table-column label="发布时间" width="200" v-if="isPublish">
            <template slot-scope="scope">{{
              scope.row.publishTime | formatTime
            }}</template>
          </el-table-column>
          <el-table-column label="类型标签" width="200" v-if="isPublish">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.label.value"
                placeholder="请选择"
                class="mr30"
                v-if="scope.row.isPublish && user_id == scope.row.authorId"
                @change="setTag($event, scope.row.id)"
              >
                <el-option
                  v-for="item in optiontag"
                  :key="item.value"
                  :label="item.display"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="推广图片预览"
          :visible.sync="dialogVisible"
          :show-close="true"
          style="margin-top: -10vh;"
        >
          <div class="canvas-cont">
            <div id="capture">
              <img src="~img/logo.png" alt="" class="logo" />
              <span class="title">{{ artInfo.title }}</span>
              <div class="content">
                <div v-html="artInfo.content"></div>
              </div>
              <div class="logo-code">
                <img src="~img/logobt.png" alt="" class="logo" />
                <div id="qrcode"></div>
              </div>
            </div>
            <span>右键保存图片</span>
            <div id="picView"></div>
          </div>
          <div slot="footer" class="dialog-footer tac">
            <el-button type="dqx-btn" @click="makePic">生成图片</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getCont,
  getContAll,
  delCont,
  putContTop,
  setContTime,
  contPublish,
  contCheck,
  getLable,
  addLabel,
  getArticleDet
} from "@/api/edit.js";
import html2canvas from "html2canvas";
import TopTab from "@/views/common/top-tab";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
import QRCode from "qrcodejs2";
import { MessageBox, Message, Loading } from "element-ui";
export default {
  data() {
    return {
      tabList: [
        { name: "管理文章", value: "article" },
        { name: "管理视频", value: "video" }
      ],
      tableData: [],
      select: "1",
      multipleSelection: [],
      title: "",
      keyworlds: "",
      isPublish: true,
      checkStatus: 1,
      type: "article", //判断当前是文章还是视频
      optiontag: [],
      tag: "",
      chooseIndex: 0,
      dialogVisible: false,
      artInfo: {},
      dataURL: "",
      isFirefox: false,
      options: [
        {
          value: true,
          label: "已发布"
        },
        {
          value: 3,
          label: "已保存"
        },
        {
          value: 0,
          label: "已提交待审核"
        },
        {
          value: 2,
          label: "被驳回"
        }
      ],
      value: "",
      itemIndex: 0,
      isMain: false, //自己
      author: ""
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    },
    checkTxt(checks, e) {
      if (checks === 0) {
        return "";
      }
      if (checks === 1 && !e) {
        return "发布";
      }
      if (checks === 1 && e) {
        return "";
      }
      if (checks === 2) {
        return " 被驳回";
      }
      if (checks === 3) {
        return "发布";
      }
    }
  },
  components: {
    TopTab,
    QRCode
  },
  created() {
    if (navigator.userAgent.indexOf("Firefox") > -1) {
      this.isFirefox = true;
    }
    this.getIndex();
    // 获取标签列表
    getLable().then(res => {
      this.optiontag = res.data;
    });
    this.$store.commit("setPage", 1);
    this.$store.commit("setPaging", true);
    if (this.roles.includes("EDITOR_INTERNAL_ARTICLE")) {
      this.options = [
        {
          value: true,
          label: "已发布"
        },
        {
          value: 3,
          label: "已保存"
        }
      ];
    }
  },
  methods: {
    /**
     * 推广图片预览
     */
    seeLook(val) {
      getArticleDet(val).then(res => {
        this.artInfo = res.data;
        this.$nextTick(function() {
          this.qrcode(`https://m.jinqiulive.com/apparticle?id=${val}`);
          document.getElementById("picView").innerHTML = "";
        });
        this.dialogVisible = true;
      });
    },
    /**
     *生成canvas
     */
    makePic() {
      const loading = this.$loading({
        lock: true,
        text: "gaygay正在飞奔中"
      });
      html2canvas(document.querySelector("#capture"), {
        scale: 3,
        dpi: window.devicePixelRatio * 3,
        proxy: "https://dev.jinqiulive.com/front-tools/proxy/image"
      }).then(canvas => {
        document.querySelector("#picView").appendChild(canvas);
        loading.close();
      });
    },
    //  生成二维码
    qrcode(val) {
      document.getElementById("qrcode").innerHTML = "";
      let qrcode = new QRCode("qrcode", {
        width: 60,
        height: 60, // 高度
        text: val // 二维码内容
        // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f',   // 背景色
        // foreground: '#ff0'    // 前景色
      });
    },
    // 设置标签
    setTag(val, e) {
      addLabel(e, val).then(_ => {
        this.$message("设置成功");
        this.getIndex();
      });
    },
    // 下拉筛选
    changeStatus(val, e) {
      this.itemIndex = e;
      if (val === true) {
        this.isPublish = true;
        this.checkStatus = 1;
      } else {
        this.isPublish = false;
        this.checkStatus = val;
      }
    },
    // 设置自动发布的时间
    changePubTime(val, e, id) {
      let item = this.tableData[e];
      item.publishTiming = val;
      this.$set(this.tableData, e, item);
      setContTime(id, val, this.type).then(_ => {
        this.$message("操作成功");
      });
    },
    // 关键字搜索
    setTitle() {
      this.$store.commit("setPage", 1);
      if (this.select === "1") {
        this.title = this.keyworlds;
      } else {
        this.author = this.keyworlds;
      }
    },
    // 获取列表
    getIndex() {
      let type = "";
      if (this.isPublish && !this.isMain) {
        type = "-all";
      }
      getCont(
        {
          type: 1,
          page: this.page,
          title: this.title,
          isPublish: this.isPublish,
          status: this.checkStatus,
          name: this.author
        },
        type
      ).then(res => {
        this.tableData = res.data;
        this.$store.commit("setTotal", res.meta.pagination.total);
      });
    },
    updated() {
      // this.getIndex();
    },
    // 文章修改
    handleEdit(val) {
      this.$router.push({
        path: "/addCont/index",
        query: { id: val }
      });
    },
    // 置顶
    handleTop(val, e) {
      putContTop(val, !e, this.type).then(_ => {
        this.$message("操作成功");
        this.page = 1;
        this.getIndex();
      });
    },
    // 定时发布
    setTime(val) {
      console.log(1);
    },
    // 添加内容
    goAdd() {
      this.$router.push({ path: "/addCont/index" });
    },
    // 生成分享链接
    advUrl(val) {
      this.copy("https://m.jinqiulive.com/article.html?id=" + val);
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
    // 文章删除
    handleDelete(val) {
      delCont(val).then(_ => {
        this.$message("撤回成功");
        this.getIndex();
      });
    },
    // 内容审核
    handleCheck(val) {
      if (!val.isPublish && val.checkStatus === 1) {
        contPublish(val.id, this.type).then(_ => {
          this.$message("操作成功");
          this.getIndex();
        });
      }
      if (val.checkStatus === 0) {
        this.$router.push({
          path: "/edit/index",
          query: { type: this.type, id: val.id }
        });
      }
      return;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 重置条件
    reSet() {
      Object.assign(this.$data, this.$options.data());
    }
  },
  computed: {
    ...mapGetters(["page", "roles", "user_id"]),
    dataList() {
      return [
        this.title,
        this.isPublish,
        this.checkStatus,
        this.type,
        this.isMain,
        this.author
      ];
    }
  },
  watch: {
    dataList(newVal) {
      this.$store.commit("setPage", 1);
      this.getIndex();
    },
    page(newVal) {
      this.getIndex();
    }
  }
};
</script>
<style lang="scss" scoped>
.contMana {
  padding: 20px;
  em {
    color: #409eff;
    display: inline-block;
    margin-right: 5px;
  }
  .checkStatus + .checkStatus {
    border-left: 1px solid #eee;
  }
  .checkStatus {
    display: inline-block;
    padding: 0 20px;
  }
  // .el-input {
  //   width: calc(80% - 380px);
  // }
  table {
    border: 1px solid #f5f5f5;
  }
  .el-date-editor {
    width: 200px;
  }
}
/deep/.el-input-group__prepend {
  position: absolute;
  margin-top: 0px;
  line-height: 40px;
  width: 100px;
  height: 40px;
  z-index: 9;
  border-radius: 0;
}
.el-input {
  display: inline-block;
  width: calc(80% - 480px);
  margin-right: 100px;
}
/deep/.el-input-group > .el-input__inner {
  margin-left: 100px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.canvas-cont {
  display: flex;
  justify-content: space-between;
  width: 900px;
  #capture {
    width: 375px;
    height: 664px;
    margin-right: 20px;
    background: url("~img/canvasbg.png") no-repeat center;
    background-size: 100%;
    .logo {
      width: 50px;
      margin: 15px 0 0 162.5px;
    }
    .title {
      display: flex;
      align-items: center;
      height: 60px;
      margin-left: 47.5px;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 600;
      width: 280px;
      padding: 0 15px;
      text-align: left;
      margin-top: 20px;
      background: url("~img/left.png") no-repeat top left,
        url("~img/right.png") no-repeat right bottom;
      background-size: 15px;
    }
    .content {
      margin-top: 20px;
      width: 316px;
      height: 430px;
      padding: 0px 13px;
      font-size: 12px;
      margin-left: 30px;
      line-height: 20px;
      background: url("~img/text.png") no-repeat center;
      background-size: 316px 430px;
      /deep/p {
        margin: 5px 0;
      }
      div {
        height: 410px;
        overflow: hidden;
      }
    }
    .logo-code {
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
      .logo {
        width: 140px;
        height: 60px;
        margin-left: 82px;
        margin-right: 15px;
        margin-top: 5px;
      }
      #qrcode {
        border: 1px solid #fbc31f;
        padding: 3px;
        width: 68px;
        height: 68px;
      }
    }
  }
  #picView {
    width: 375px;
  }
}
</style>
