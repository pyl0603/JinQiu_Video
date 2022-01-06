<template>
  <!-- 列表 -->
  <div>
    <el-row class="mt20 file-main">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item :name="index" v-for="(item,index) in matList" :key="index">
          <template slot="title">
            <el-col :span="20">{{item.name}}</el-col>
          </template>
          <el-row :gutter="20" class="show-list">
            <el-col :span="4" v-for="(items,index) in item.list" :key="index">
              <video
                :src="items.fullVideoPath"
                class="img-list"
                @click="chooseItem(items.fullVideoPath)"
              ></video>
              <span class="img-name">{{items.videoName}}</span>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <paging ref="paging" @changePage="changePage" :total="totalNum" v-if="isPop"></paging>
  </div>
</template>
<script>
import { getVideoDate, getVideoList } from "@/api/edit";
import paging from "@/components/Paging/pop-index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeNames: [0],
      matList: [],
      dayTime: "",
      pages: 1,
      totalNum: 0
    };
  },
  props: {
    day: {
      type: String,
      default: ""
    },
    upDate: {
      type: Boolean,
      default: false
    },
    isPop: {
      type: Boolean,
      default: false
    }
  },
  components: {
    paging
  },
  methods: {
    //   页面切换
    changePage(val) {
      this.pages = val;
    },
    // 图片地址传递
    chooseItem(val) {
      this.$emit("chooseItem", val);
    },
    // 获取图片列表
    async getVideoDates() {
      this.matList = [];
      return new Promise((resolve, reject) => {
        getVideoDate({ page: this.pages }).then(res => {
          return resolve(res);
        });
      });
    },
    //  折叠事件
    async handleChange(val) {
      if (val) {
        this.dayTime = this.matList[val].name;
        this.itemsData(val);
      }
    },
    // 获取图片列表(折叠时)
    async getVideoLists() {
      return new Promise((resolve, reject) => {
        getVideoList({ day: this.dayTime, content: this.keys }).then(res => {
          return resolve(res.data);
        });
      });
    },
    // 列表赋值
    async itemsData(val) {
      let imgItem = await this.getVideoLists();
      let item = this.matList[val];
      item.list = imgItem;
      this.$set(this.matList, val, item);
    }
  },
  async mounted() {
    // 分页列表
    let keys = await this.getVideoDates();
    keys.data.map(res => {
      this.matList.push({ name: res, list: [] });
    });
    this.$store.commit("setTotal", keys.meta.pagination.total);
    this.totalNum = keys.meta.pagination.total;
    // 详细数据项
    this.dayTime = keys.data[0];
    this.itemsData(0);
  },
  computed: {
    dataList() {
      return [this.pages, this.upDate];
    },
    ...mapGetters(['page'])
  },
  watch: {
    page(newVal){
      this.pages = newVal;
    },
    async dataList(newVal) {
      let keys = await this.getVideoDates();
      keys.data.map(res => {
        this.matList.push({ name: res, list: [] });
      });
      this.$store.commit("setTotal", keys.meta.pagination.total);
      this.dayTime = keys.data[0];
      this.itemsData(0);
    }
  }
};
</script>
<style lang="scss" scoped>
.img-name {
  word-break: break-all;
}
.img-list {
  width: 100%;
  height: 150px;
}
.el-collapse {
  max-height: calc(100vh - 300px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
