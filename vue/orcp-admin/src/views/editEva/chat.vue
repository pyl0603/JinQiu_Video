<template>
  <!-- 右边 -->
  <div class="right el-col-7">
    <div class="chat-list" ref="barrage">
      <div
        v-for="(item, index) in message"
        :key="index"
        class="mt10"
        :class="{ on: !item.helper }"
      >
        {{ item.helper ? "(小号)" : "" }}{{ item.user.nickname }}：
        <em v-if="item.msgType != 'IMG'">{{ item.content }}</em>
        <img :src="item.content" alt="" v-if="item.msgType == 'IMG'" />
      </div>
    </div>
    <el-row class="eva-add">
      <el-col
        class="mb10 img-icon"
        :span="12"
        v-if="evaName == userInfo.nickname"
      >
        <div class="upload-before" v-if="imgUrl == ''">
          <svg-icon icon-class="tupian"></svg-icon>
          <span class="f14 cada">690*460</span>
        </div>
        <div class="upload-after" v-if="imgUrl != ''">
          <img :src="imgUrl" alt />
        </div>
        <upload ref="upload" @upImg="upImg"></upload>
      </el-col>
      <el-col class="cont" :span="evaName == userInfo.nickname ? 12 : 24">
        <el-input
          type="textarea"
          placeholder="评论内容"
          @keyup.enter.native="chat"
          v-model="cont"
          maxlength="30"
        ></el-input>
      </el-col>
    </el-row>

    <div class="send-btn">
      <el-button
        type="dqx-btn"
        class="ml20"
        @click="chat('img')"
        :disabled="isDisabled"
        v-if="evaName == userInfo.nickname"
        >发送图片</el-button
      >
      <em> 当前用户名：{{ evaName }}</em>
      <el-button
        type="dqx-btn"
        class="ml20"
        @click="chat"
        :disabled="isDisabled"
        >发送文本</el-button
      >
    </div>
    <paging
      ref="paging"
      v-if="total > 10"
      @changePage="changePage"
      :total="total"
      class="mt10"
    ></paging>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import paging from "@/components/Paging/page-eva";
import { getEva, addEva,getMsgList } from "@/api/eva";
import { formatTime } from "@/utils/index.js";
import { setId, getToken, getCategory } from "@/utils/eva-auth";
import openSocket from "socket.io-client";
import upload from "@/components/UploadImg/upload-eva";
let socket;
socket = openSocket(`http://192.168.1.201:9999?token=${getToken()}`);
export default {
  data() {
    return {
      total: 0,
      cont: "",
      page: 1,
      list: [],
      isDisabled: false,
      childList: [],
      isEnter: true,
      message: [],
      id: 3560181,
      imgUrl: ""
    };
  },
  props: {
    matchId: {
      type: Number,
      default: 0
    },
    disIds: {
      type: Number,
      default: 0
    },
    typeName: {
      type: String,
      default: "article"
    },
    logo: {
      type: String,
      default: ""
    },
    isRefresh: {
      type: Boolean,
      default: false
    },
    childrenList: {
      type: Array,
      default: () => {}
    }
  },
  components: {
    paging,
    upload
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  mounted() {
    this.childList = this.childrenList.slice(1);
    // let rand = Math.floor(Math.random() * this.childList.length);
    // let data = this.childList[rand];
    // setId(data.id);
    // this.$store.commit("userEva/SET_NAME", data.nickname);
    // this.$store.commit("userEva/SET_AVATAR", data.avatar);
    if (this.matchId) {
      this.message = [];
      let chName = getCategory() == 0 ? "fb" : "bb";
      getMsgList({channel:`${chName}.match.live.${this.matchId}`}).then(res => {
        this.message = res.data
        this.autoScroll();
      })
      socket = openSocket(`http://192.168.1.201:9999?token=${getToken()}`);
      // 连接直播间
      socket.on("connect", () => {
        let chMsg = { channel: `${chName}.match.live.${this.matchId}` };
        // 加入直播间
        setTimeout(() => {
          socket.emit("dqx.channel.join", chMsg, data => {
            console.log(data, "加入直播间");
          });
        }, 300);

        // 接收消息
        socket.on("dqx.channel.chat.receive", res => {
          console.log(res);
          this.message.push(res);
          this.autoScroll();
        });
      });
    }
  },
  methods: {
    async upImg(val) {
      this.imgUrl = val;
    },
    // 聊天
    chat(val) {
      let chName = getCategory() == 0 ? "fb" : "bb";
      // console.log(this.evaName, this.userInfo.nickname);
      let chMsg = {
        channel: `${chName}.match.live.${this.matchId}`,
        content: this.cont.replace(/[\r\n]/g, ""),
        nickname: this.evaName,
        category: null
      };
      if (this.evaName == this.userInfo.nickname) {
        chMsg.nickname = "";
      }
      
      // 测试使用
      if (val == "img") {
        chMsg.category = 1;
        chMsg.content = this.imgUrl;
      }
      console.log(chMsg);
      if(chMsg.content == ''){
        this.$message('不能发送空内容')
        return
      }
      socket.emit("dqx.channel.chat.send", chMsg, res => {
        console.log(res);
        // console.log('发送消息', res)
        this.cont = "";
        this.imgUrl = '';
        if (this.evaName != this.userInfo.nickname) {
          let rand = Math.floor(Math.random() * this.childList.length);
          let data = this.childList[rand];
          setId(data.id);
          this.$store.commit("userEva/SET_NAME", data.nickname);
          this.$store.commit("userEva/SET_AVATAR", data.avatar);
        }
      });
    },

    // 评论自动向上滚动
    autoScroll() {
      const e = this.$refs.barrage;
      if (e.scrollHeight > e.offsetHeight) {
        e.scrollTop = e.scrollHeight;
      }
    },
    // 详情弹窗
    async detEva(val) {
      this.$emit("detEva", val.id);
    },
    // 分页切换
    async changePage(val) {
      this.page = val;
    },
    // 获取评论列表
    async getIndex() {
      // let type = this.typeName === "article" ? 0 : 1;
      let type;
      if (this.typeName === "article") type = 0;
      if (this.typeName === "video") type = 1;
      if (this.typeName === "circle") type = 4;
      let id = this.contId == 0 ? this.disIds : this.contId;
      getEva({ page: this.page, target: id, type: type }).then(res => {
        this.list = res.data;
        this.total = res.meta.pagination.total;
      });
    },
    // 添加评论
    addEvas() {
      if (!this.isEnter) return;
      this.isEnter = false;
      setTimeout(res => {
        this.isEnter = true;
      }, 1000);
      let type;
      if (this.typeName === "article") type = 0;
      if (this.typeName === "video") type = 1;
      if (this.typeName === "circle") type = 4;
      this.isDisabled = true;
      let id = this.contId == 0 ? this.disIds : this.contId;
      addEva({
        type: type,
        target: id,
        author: { nickname: this.evaName, avatar: this.evaAvatar },
        content: this.cont,
        logo: this.logo
      })
        .then(res => {
          this.$message("评论成功");
          this.getIndex();
          this.cont = "";
          this.isDisabled = false;
          let rand = Math.floor(Math.random() * this.childList.length);
          let data = this.childList[rand];
          setId(data.id);
          this.$store.commit("userEva/SET_NAME", data.nickname);
          this.$store.commit("userEva/SET_AVATAR", data.avatar);
        })
        .catch(res => {
          this.cont = "";
          this.isDisabled = false;
        });
    }
  },
  computed: {
    dataList() {
      return [
        this.contId,
        this.disIds,
        this.typeName,
        this.page,
        this.isRefresh
      ];
    },
    ...mapGetters(["avatar", "evaName", "evaAvatar", "userInfo"])
  },
  watch: {
    matchId(newVal) {
      this.message = [];
      let chName = getCategory() == 0 ? "fb" : "bb";
      getMsgList({channel:`${chName}.match.live.${newVal}`}).then(res => {
        this.message = res.data
        this.autoScroll();
      })
      socket = openSocket(`http://192.168.1.201:9999?token=${getToken()}`);
      // 连接直播间
      socket.on("connect", () => {
        let chMsg = { channel: `${chName}.match.live.${newVal}` };
        // 加入直播间
        setTimeout(() => {
          socket.emit("dqx.channel.join", chMsg, data => {
            console.log(data, "加入直播间");
          });
        }, 300);

        // 接收消息
        socket.on("dqx.channel.chat.receive", res => {
          console.log(res);
          this.message.push(res);
          this.autoScroll();
        });
      });
    },
    childrenList(newVal) {
      this.childList = newVal.slice(1);
    }
  }
};
</script>
<style lang="scss" scoped>
.send-btn {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 5px;
  width: 27%;
  background: #ffffff;
}
.right {
  height: calc(100vh - 60px);
  padding: 0 20px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .eva-list {
    max-height: calc(100vh - 350px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .item + .item {
    border-top: 1px solid #cecece;
  }
  .item {
    display: flex;
    justify-content: flex-start;
    padding: 20px 0;
    width: 100%;
    .rights {
      width: 100%;
      .child {
        padding: 10px 20px;
        background: #f8f8f8;
        .reply-eva-cont {
          line-height: 22px;
        }
      }
    }
    .eva-time-name {
      display: flex;
      justify-content: space-between;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dddddd;
  }
  .eva-add {
    position: fixed;
    bottom: 45px;
    width: 27%;
    /deep/textarea {
      height: 125px;
    }
  }
  .chat-list {
    height: calc(100vh - 270px);
    padding-bottom: 30px;
    overflow-y: scroll;
    img {
      height: 100px;
    }
  }
  .chat-list .on {
    color: red;
  }
  /deep/.inputFlie {
    width: 9vw;
    height: 5.5vw;
    position: absolute;
    margin-left: -0vw;
    margin-top: -5.5vw;
    opacity: 0;
    z-index: 1;
  }
  .upload-after {
    width: 9vw;
    height: 5.5vw;
    img {
      width: 9vw;
      height: 5.5vw;
    }
  }
  .upload-before {
    width: 9vw;
    height: 5.5vw;
    background: #f5f5f5;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    span {
      display: block;
    }
    .svg-icon {
      font-size: 39px;
      color: #adadad;
      margin-top: 1.3vw;
    }
  }
}
</style>
