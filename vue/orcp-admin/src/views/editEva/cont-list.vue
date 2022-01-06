<template>
  <!-- 左侧 -->
  <div class="left el-col-8">
    <div class="top-header">
      <!-- 顶部切换 -->
      <div class="tab mt10">
        <span
          class="cp"
          :class="{ on: type === 'article' }"
          @click="getConts('article')"
          >文章</span
        >
        <span
          class="cp"
          :class="{ on: type === 'video' }"
          @click="getConts('video')"
          >视频</span
        >
        <span
          class="cp"
          :class="{ on: type === 'circle' }"
          @click="getConts('circle')"
          >圈子</span
        >
        <span
          class="cp"
          :class="{ on: type === 'match' }"
          @click="getConts('match')"
          >比赛</span
        >
      </div>
      <!-- 搜索框 -->
      <div class="sear mt20" v-if="type != 'match'">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="keyValue"
        ></el-input>
        <el-button type="dqx-btn ml10" @click="searCont">搜索</el-button>
      </div>
      <div v-else class="mt20 sele-date">
        <el-select v-model="value" placeholder="请选择" @change="change">
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.name"
            :value="item.competitionId"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="matchDate"
          type="date"
          value-format="timestamp"
          placeholder="选择日期"
          class="ml30"
        ></el-date-picker>
      </div>
    </div>
    <!-- 文章列表 -->
    <div class="list">
      <div
        class="item cp"
        v-for="item in list"
        :key="item.id"
        @click="getDet(item)"
      >
        <span class="c424 f16">{{
          item.title || item.home.name + "VS" + item.away.name
        }}</span>
        <em class="cada f14 mt10">{{
          item.updateTime || item.createdAt || item.matchTime | formatTime
        }}</em>
      </div>
    </div>
    <paging
      ref="paging"
      @changePage="changePage"
      :total="total"
      class="mt10"
    ></paging>
  </div>
</template>
<script>
import paging from "@/components/Paging/page-eva";
import { getCont, getContKey, getDis, getChannel, getMatch } from "@/api/eva";
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    return {
      total: 0,
      type: "article",
      keyValue: "",
      keyWorlds: "",
      page: 0,
      list: [],
      channelList: [],
      value: 0,
      isSearch: false,
      competition: null,
      start: new Date(new Date().toLocaleDateString()).getTime(),
      end:
        new Date(new Date().toLocaleDateString()).getTime() +
        24 * 3600 * 1000 -
        1000,
      matchDate: new Date()
    };
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
    // 下拉切换
    change(val) {
      this.value = val;
    },
    // 分页切换
    async changePage(val) {
      this.page = val;
    },
    // 内容检索
    async searCont() {
      this.isSearch = true;
      this.keyWorlds = this.keyValue;
      // this.getKeyIndex();
    },
    async getConts(val) {
      this.type = val;
      this.$emit("type", val);
    },
    // 获取比赛
    async getMth() {
      getMatch({
        competition: this.value,
        page: this.page,
        start: this.start,
        end: this.end
      }).then(res => {
        this.list = res.data;
        this.total = res.meta.pagination.total;
        if (res.data[0]) {
          this.$emit("match", res.data[0]);
        }
      });
    },
    // 获取帖子
    async getDiss() {
      getDis({ title: this.keyWorlds, page: this.page }).then(res => {
        this.list = res.data;
        this.total = res.meta.pagination.total;
      });
    },
    async getKeyIndex() {
      getContKey(this.type, { content: this.keyWorlds, page: this.page }).then(
        res => {
          this.list = res.data;
          this.total = res.meta.pagination.total;
        }
      );
    },
    async getIndex() {
      getCont(this.type, { page: this.page }).then(res => {
        this.list = res.data;
        this.total = res.meta.pagination.total;
      });
    },
    async getDet(val) {
      console.log(val);
      if (this.type == "circle") {
        this.$emit("disId", val.id);
      } else if (this.type == "match") {
        this.$emit("match", val);
      } else {
        this.$emit("contId", val.id);
      }
    }
  },
  async mounted() {
    let { data } = await getChannel();
    this.channelList = data;
    this.value = data[0].competitionId;
    console.log(this.start, this.end);
    this.page = 1;
  },
  computed: {
    dataList() {
      return [this.page, this.type, this.keyWorlds, this.value, this.matchDate];
    }
  },
  watch: {
    matchDate(newVal) {
      this.start = newVal;
      this.end = newVal + 24 * 3600 * 1000 - 1000;
    },
    dataList(newVal) {
      if (this.type == "circle") {
        this.getDiss();
      } else if (this.type == "match") {
        this.getMth();
      } else {
        if (!this.isSearch) {
          this.getIndex();
        } else {
          this.getKeyIndex();
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-pagination {
  margin-left: -20px;
}
.left {
  height: calc(100vh - 60px);
  padding: 0 20px;
  border-right: 10px solid #f2f2f2;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .top-header {
    position: fixed;
    background: #fff;
    width: calc(25%);
  }
  .list {
    margin-top: 110px;
    height: calc(100vh - 220px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .item + .item {
    border-top: 1px solid #f2f2f2;
  }
  .item {
    padding: 10px 0;
    span {
      display: block;
      line-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    em {
      display: block;
    }
  }
  .el-input {
    width: calc(100% - 90px);
  }
  .tab {
    display: flex;
    justify-content: space-between;
    width: 250px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid #cecece;
    margin-left: calc(50% - 125px);
    span + span {
      border-left: 1px solid #cecece;
    }
    span {
      display: inline-block;
      width: 92px;
      text-align: center;
      background: #f0f0f0;
    }
    span.on {
      color: #18ce94;
      background: #fff;
    }
  }
  .sele-date {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
