<template>
  <div>
    <!-- 头部 -->
    <div class="navbar">
      <i>舆论风控系统</i>
      <div class="right-menu">
        <div class="avatar-container">
          <div class="avatar-wrapper">
            <div class="mr60 cp f16">
              <span class="mr20 choose-style" @click="checkType('Right','left')" :class="{on:isEva}">← 去评论</span>
              <span class="choose-style" @click="checkType('otherRight','otherLeft')" :class="{on:!isEva}">去发帖 →</span>
            </div>
            <span class="mr30 ml20" @click="showMsg">消息</span>
            <img :src="evaAvatar" class="user-avatar" />
            <em>{{evaName}}</em>
            <span @click="showChild" class="mr20">切换</span>
            <span @click="logout">退出</span>
          </div>
        </div>
      </div>
    </div>
    <left ref="Left" :is="tabLeftPage" @disId="disId" :isRefresh='isRefreshLeft' @contId="contId" @type="type" :isEva="isEva"></left>
    <!-- 中间 -->
    <div class="center el-col-10">
      <!-- 文章详情 -->
      <el-col :span="18" :push="3" v-if="cont != ''">
        <div class="title f24 c171 mt10">{{cont.title}}</div>
        <div class="cada f14 mt10"><span class="mr20">{{cont.author}}</span> {{cont.updateTime | formatTime}} </div>
        <div v-if="types === 'article'">
        <div class="news-cont" v-html="cont.content"></div>
        </div>
        <div v-if="types === 'video'" class="mt20">
          <video :src="cont.video" controls="controls" width="100%"></video>
        </div>
      </el-col>
      <!-- 帖子详情 -->
      <el-col :span="18" :push="3" v-if="detType===3">
        <dis-det ref="disDet" :disTitle="disTitle" :disTime="disTime" :disCont="disCont" :disImg="disImg"></dis-det>
      </el-col>
    </div>
    <right :is="tabPage" ref="Right"  @preview="preview"  @refresh="refresh" :isRefresh="isRefresh" :childrenList="childrenList" :contId="id" :typeName="types" :logo="cont.imageUrl" @detEva="detEva"></right>
    <!-- <other-right ref="otherRight"></other-right> -->
    <!-- 弹窗 -->
    <div class="pop-bg" v-if="isChange" @click.stop.prevent="isChange = false">
      <div class="child" @click.stop.prevent="isChange = true">
        <div class="msg-count mt10">
          <span class="eva-num">评论数(总：{{totalCount.topNum}})</span>
          <span class="reply-num">回复数(总：{{totalCount.subNum}})</span>
        </div>
        <div class="list">
          <div class="item" v-for="item in childList" :key="item.id">
            <img :src="item.avatar" alt class="mr20" />
            <em>{{item.nickname}}</em>
            <span>{{item.commentCount.top}}</span>
            <span>{{item.commentCount.sub}}</span>
            <el-button type="text" @click.stop.prevent="setNewId(item)">切换</el-button>
          </div>
        </div>
        <div class="new-add">
          <em>新增子账户：</em>
          <el-input placeholder="请输入昵称" v-inputRule v-model="niceNameAdd"></el-input>
          <el-button type="dqx-btn" @click.stop.prevent="addNewChild">确定</el-button>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="pop-bg" v-if="isMsg" @click.stop.prevent="isMsg = false">
      <div class="child" @click.stop.prevent="isMsg = true">
        <div class="list">
          <div class="items" v-for="item in replyList" :key="item.id" @click="detEva(item.rootId)">
            <div class="reply-time-item"><i>{{item.author.nickname}}</i>回复<i class="c18c">你</i>：{{item.content}}</div>
            <div class="reply-time-item mt20">{{item.createdAt}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="评论详情" :visible.sync="dialogVisible" width="50%" :show-close="true" :close-on-click-modal="false">
      <div class="main-eva f16 main-area">
        <img :src="mainEva.author.avatar" alt />
        <div class="eva-right ml20">
          <div class="eva-info">
            <span>{{mainEva.author.nickname}}</span>
            <em>{{mainEva.createdAt}}</em>
          </div>
          <div
            class="eva-conts mt10"
          >{{mainEva.content}}</div>
        </div>
      </div>
      <div class="f20 mt10 mb10">最新评论</div>
      <div class="eva-list">
        <div class="main-eva f16" v-for="item in replyEvaList" :key="item.id" @click="replyReply(item)">
          <img :src="item.author.avatar" alt />
          <div class="eva-right ml20">
            <div class="eva-info">
              <span>{{item.author.nickname}}<em v-if="item.refer.avatar">回复：{{item.refer.nickname}}</em></span>
              <em>{{item.createdAt}}</em>
            </div>
            <div class="eva-conts mt20">{{item.content}}</div>
          </div>
        </div>
      </div>
      <paging ref="paging" @changePage="changePage" :total="total" class="mt10" v-if="total > 10"></paging>
      <div class="add-reply">
        <el-input type="textarea" v-inputRule :placeholder="remindTxt" v-model="replyCont"  @keyup.enter.native="addReply"></el-input>
        <el-button type="dqx-btn" class="send-btn" @click="addReply" size="mini">发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getContDet, getChild, getReply, addEva,getEvaReply,addChild,getEvaDet,getContKey,getDisDet } from "@/api/eva";
import { setId } from "@/utils/eva-auth";
import paging from "@/components/Paging/page-eva";
import Right from "./eva-item";
import Left from "./cont-list";
import otherRight from "./add-dis";
import otherLeft from "./dis-list";
import { formatTime } from "@/utils/index.js";
import disDet from '@/views/common/dis-det'
export default {
  data() {
    return {
      detType:0,  //详情类型
      tabPage:'Right',
      tabLeftPage:'Left',
      cont: "", //文章详情
      id: 0,  //内容Id
      types: "article", //内容类型
      isRefresh:false,  //是否刷新评论列表
      childList: [],  //子账户列表
      replyList: [],  //消息回复列表
      replyEvaList:[],  //回复列表
      dialogVisible: false, //弹窗
      isChange: false,  //子账户弹窗
      isMsg: false, //消息弹窗
      niceNameAdd: "",  //新增子账户昵称
      replyCont: "",  //回复内容
      refInfo:'',//被回复的信息
      remindTxt: "请输入内容",
      total: 0, //评论回复总数
      page: 1,  //评论回复列表当前页
      logo:'',  //内容logo
      rootId:0, //主评论Id
      totalCount:{
        subNum:0,
        topNum:0
      },  //子账户消息数量统计
      mainEva: {
        author: {
          avatar: "",
          nickname: ""
        },
        content: "",
        createdAt: ""
      },  //主评论信息
      // 帖子详情数据
      disTitle: "",
      disTime: 0,
      disCont: "",
      disImg: [],
      isEva:true,   //左侧接收是发帖还是评论
      isRefreshLeft:true, //刷新左侧列表
      childrenList:[]
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components: {
    Right,
    otherRight,
    Left,
    otherLeft,
    paging,
    disDet
  },
  computed: {
    ...mapGetters(["avatar", "evaName", "evaAvatar", "userInfo"])
  },
  methods: {
    // 发帖预览
    async preview(val){
      this.detType = 3;
      this.disTime = 0;
      this.disTitle = val[0];
      this.disCont = val[1];
      this.disImg = val[2]
    },
    // 刷新左侧列表
    async refresh(){
      console.log('刷新')
      this.isRefreshLeft = !this.isRefreshLeft;
    },
    // 帖子详情
    async disId(val){
      getDisDet({id:val}).then(res => {
        this.detType = 3;
        this.disTitle = res.data.title;
        this.disTime = res.data.createdAt;
        this.disCont = res.data.content;
        this.disImg = res.data.images;
      })
    },
    // 切换评论和发帖
    async checkType(val,e){
      if(val==='Right'){
        this.isEva = true
      }else{
        this.isEva = false
      }
      this.tabPage = val;
      this.tabLeftPage = e;
      this.detType = 0;
    },
    // 详情数据
    async detEva(val) {
      this.dialogVisible = true;
      this.rootId = val;
      this.getEvaLists();
      this.getEvaReplys();
    },
    // 点击回复列表
    async replyReply(val){
      this.refInfo = val;
      this.remindTxt = "回复" + val.author.nickname+'：';
    },
    // 分页切换
    async changePage(val) {
      this.page = val;
      this.getEvaReplys();
    },

    async logout() {
      await this.$store.dispatch("userEva/resetToken");
      this.$router.push(`/loginEva?redirect=${this.$route.fullPath}`);
    },
    // 获取内容id
    async contId(val) {
      this.id = val;
    },
    // 获取内容类型
    async type(val) {
      this.types = val;
    },
    // 获取详情
    async getDet() {
      getContDet(this.types, { id: this.id }).then(res => {
        this.cont = res.data;
        this.logo = res.data.imageUrl;
      });
    },
    // 获取子账户
    async getChilds() {
      getChild().then(res => {
        let itemMain = [{avatar:this.userInfo.avatar_url,id:this.userInfo.id,nickname:this.userInfo.nickname,
        commentCount:{
          sub:res.data.subNum,
          top:res.data.topNum
        }}];
        // this.childList = res.data.helpers;
        // this.childList = itemMain.concat(res.data.helpers)
        this.childList = res.data.helpers;
        this.childrenList = res.data.helpers;
        this.totalCount = res.data
      });
    },
    // 子账户列表
    async showChild() {
      this.isChange = true;
      this.getChilds();
    },
    // 账号切换
    async setNewId(val) {
      setId(val.id);
      this.$store.commit("userEva/SET_NAME", val.nickname);
      this.$store.commit("userEva/SET_AVATAR", val.avatar);
      this.isChange = false;
    },
    // 新增子账户
    async addNewChild() {
      addChild({nickname:this.niceNameAdd}).then(_ => {
        this.$message('添加成功');
        this.niceNameAdd = ''
        this.getChilds();
      })
    },
    // 消息列表
    async showMsg() {
      this.isMsg = true;
      getReply().then(res => {
        this.replyList = res.data;
      });
    },
    // 获取评论详情
    async getEvaLists(){
      getEvaDet({id:this.rootId}).then(res => {
        this.mainEva = res.data;
        this.refInfo = res.data;
        this.remindTxt = "回复" + res.data.author.nickname+'：';
      })
    },
    // 获取评论回复列表
    getEvaReplys(){
      getEvaReply({id:this.rootId,page:this.page}).then(res => {
        this.replyEvaList = res.data;
        this.total = res.meta.pagination.total
        console.log(this.total)
      })
    },
    // 发送回复
    addReply() {
      let type = this.types === 'article' ? 0 : 1
      addEva({
        type: type,
        target: this.id,
        author: { nickname: this.evaName, avatar: this.evaAvatar },
        content: this.replyCont,
        logo: this.logo,
        ref:this.refInfo.id,
        referId:this.refInfo.uid,
        refer:{
          nikename:this.refInfo.author.nickname,
          avatar:this.refInfo.author.avatar
        }

      }).then(res => {
        this.$message('回复成功')
        this.dialogVisible = false;
        this.replyCont = "";
        this.isRefresh = !this.isRefresh;
      });
    }
  },
  mounted() {
    this.getChilds();
  },
  watch: {
    id(newVal) {
      this.isRefresh = !this.isRefresh;
      this.getDet();
    }
  }
};
</script>

<style lang="scss" scoped>
.choose-style.on{
  padding-bottom: 5px;
  border-bottom: 2px solid #fff;
}
/deep/.dis-det {
  max-height: calc(100vh - 50px);
  padding: 20px 0;
  width: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .lineHeight {
    line-height: 28px;
  }
  img {
    width: 100%;
  }
}
.add-reply {
  position: absolute;
  bottom: 1vh;
  width: 95%;
  .send-btn {
    position: relative;
    top: -30px;
    margin-left: calc(100% - 60px);
  }
  /deep/textarea {
    height: 80px;
  }
}
/deep/.el-dialog {
  margin-top: 10vh !important;
  height: 82vh;
  .el-dialog__body {
    padding-top: 10px;
  }
}
.eva-list {
  height: calc(80vh - 360px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
.main-eva {
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .eva-right {
    width: 100%;
  }
  .eva-info {
    display: flex;
    justify-content: space-between;
  }
}
.pop-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.child {
  height: calc(100vh - 65px);
  width: 610px;
  padding: 0 20px;
  background: #fff;
  position: absolute;
  right: 5px;
  top: 60px;
  z-index: 2;
  box-shadow: 10px 10px 10px 10px #888;
  overflow-y: scroll;
  .reply-time-item{
    display: block;
    width: 100%;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  .list {
    height: calc(100vh - 150px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .new-add {
    .el-input {
      display: inline-block;
      width: 370px;
    }
  }
  .msg-count {
    padding-left: 40%;
    .eva-num {
      display: inline-block;
    }
    span{
      display: inline-block;
      width: 40%;
    }
  }
  .items{
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }
  .item {
    padding: 10px 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
      display: inline-block;
      width: 100px;
    }
    em {
      display: inline-block;
      width: 250px;
    }
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.center {
  height: calc(100vh - 60px);
  padding: 0 20px;
  border-right: 10px solid #f2f2f2;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .title {
    line-height: 35px;
  }
  /deep/.news-cont img {
    width: 100%;
  }
  /deep/.news-cont p {
    margin-top: 20px;
    font-size: 14px;
    line-height: 20px;
  }
}
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #18ce94;
  margin-left: 0;
  color: #fff;
  i {
    display: inline-flex;
    line-height: 60px;
    padding-left: 30px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        span {
          cursor: pointer;
        }
        em {
          margin-right: 50px;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>