<template>
  <!-- 右边 -->
  <div class="right el-col-7">
    <div class="title f20 c171">评论</div>
    <div class="tac mt50" v-if="list.length === 0">暂无评论</div>
    <div class="eva-list" v-if="list.length > 0">
      <div class="item cp" v-for="item in list" :key="item.id" @click="detEva(item)">
        <img :src="item.author.avatar" alt />
        <div class="rights">
          <div class="eva-time-name">
            <span class="f16 c424">{{item.author.nickname}}</span>
            <em class="cada f16"><em class="mr20 c18c cp">举报</em> {{item.createdAt | formatTime}}</em>
          </div>
          <div class="f16 c171 mt20">{{item.content}}</div>
          <div class="child mt10" v-if="item.children">
            <div
              v-for="(items,index) in item.children"
              :key="items.id"
              class="mb10 reply-eva-cont"
              v-if="index < 2"
            >
              <span>
                {{items.author.nickname}}
                <i class="c18c">回复</i>
                {{items.refer.nickname}}：{{items.content}}
              </span>
            </div>
            <div
              v-if="item.children&&item.children.length>2"
              class="c18c mt10"
            >查看全部{{item.children.length}}条回复</div>
          </div>
        </div>
      </div>
    </div>
    <div class="eva-add" v-if="contId != 0 || disIds != 0">
      <el-input type="textarea" placeholder="评论内容" @keyup.enter.native="addEvas" v-model="cont"></el-input>
      <div class="send-btn">
        当前用户名：{{evaName}}
        <el-button type="dqx-btn" class="ml20" @click="addEvas" :disabled="isDisabled">发送</el-button>
      </div>
    </div>
    <paging ref="paging" v-if="total>10" @changePage="changePage" :total="total" class="mt10"></paging>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import paging from "@/components/Paging/page-eva";
import { getEva, addEva } from "@/api/eva";
import { formatTime } from "@/utils/index.js";
import { setId } from "@/utils/eva-auth";
export default {
  data() {
    return {
      total: 0,
      cont: "",
      page: 1,
      list: [],
      isDisabled: false,
      childList: [],
      isEnter:true,
    };
  },
  props: {
    contId: {
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
    paging
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  methods: {
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
      if(this.typeName === 'article') type = 0;
      if(this.typeName === 'video') type = 1;
      if(this.typeName === 'circle') type = 4;
      let id = this.contId == 0 ? this.disIds : this.contId;
      getEva({ page: this.page, target: id, type: type }).then(res => {
        this.list = res.data;
        this.total = res.meta.pagination.total;
      });
    },
    // 添加评论
    addEvas() {
      if(!this.isEnter) return;
      this.isEnter = false;
      setTimeout(res => {
        this.isEnter = true
      },1000)
      let type;
      if(this.typeName === 'article') type = 0;
      if(this.typeName === 'video') type = 1;
      if(this.typeName === 'circle') type = 4;
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
          this.cont=""
          this.isDisabled = false;
        });
    }
  },
  computed: {
    dataList() {
      return [this.contId,this.disIds, this.typeName, this.page, this.isRefresh];
    },
    ...mapGetters(["avatar", "evaName", "evaAvatar"])
  },
  watch: {
    dataList(newVal) {
      this.getIndex();
    },
    contId(newVal) {
      this.list = [];
      this.$store.commit("setPage", 1);
    },
    disID(newVal) {
      this.list = [];
      this.$store.commit("setPage", 1);
    },
    childrenList(newVal) {
      this.childList = newVal;
    }
  }
};
</script>
<style lang="scss" scoped>
.send-btn {
  position: absolute;
  margin-top: -45px;
  right: 10px;
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
    bottom: 20px;
    width: 27%;
    /deep/textarea {
      height: 150px;
    }
  }
}
</style>

