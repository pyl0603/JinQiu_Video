<template>
  <!-- 列表 -->
  <div>
    <el-row class="mt20 file-main">
      <!--<el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item :name="index" v-for="(item,index) in matList" :key="index">
          <template slot="title">
            <el-col :span="20">{{item.name}}</el-col>
          </template>
          <el-row :gutter="20" class="show-list">
            <el-col :span="4" v-for="(items,index) in item.list" :key="index" class="mt20">
              <span class="forc">
              <img
                :src="items.fullImgPath"
                class="img-list"
                @click="chooseItem(items.fullImgPath)"
              >
              </span>
              <span class="img-name">{{items.imgName | formatName}}</span>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse> -->
        <el-date-picker
          class="ml20"
          v-model="dataRang"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="change"
        ></el-date-picker>
         <div class="imglist-content">
          <div class="no-res" v-if="list.length === 0">暂无数据</div>
          <el-row :gutter="20" class="show-list">
            <el-col :span="4" v-for="(items,index) in list" :key="index" class="mt20">
              <span class="forc">
              <img
                :src="items.fullImgPath"
                class="img-list"
                @click="chooseItem(items.fullImgPath)"
              >
              </span>
              <span class="img-name">{{items.imgName | formatName}}</span>
            </el-col>
          </el-row>
         </div>
    </el-row>
    <paging ref="paging" @changePage="changePage" :total="totalNum" v-if="isPop"></paging>
  </div>
</template>
<script>
// import { getImgDate, getImgList } from "@/api/edit";
import { getOssImgs, getOssImgList } from "@/api/oss";
import paging from "@/components/Paging/pop-index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataRang: [
        new Date(new Date().toLocaleDateString()).getTime() -
          3600 * 1000 * 24 * 3 -
          1000,
        new Date(new Date().toLocaleDateString()).getTime()
      ], //  时间选择
      // activeNames: [0],
      matList: [],
      // dayTime: "",
      list: [],
      pages: 1,
      totalNum: 0
    };
  },
  props: {
    day: {
      type: String,
      default: ""
    },
    intImg: {
      type: Boolean,
      default: false
    },
    isPop: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    formatName(name) {
      let str = ''
      const patt = new RegExp(/^\d{13}/)
      if (19 < name.length) {
        str = name.slice(19)
        if (patt.test(str)) {
          str = str.slice(14)
        }
      }
      return str
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
    // 日期选择
    async change(val) {
      this.start = val[0];
      this.end = val[1] + 3600 * 1000 * 24 - 1000;
      this.matList = await this.getImgList({from: this.intImg ? 0:1});
      this.list = this.matList.data;
      this.$store.commit("setTotal", this.matList.meta.pagination.total);
      this.totalNum = this.matList.meta.pagination.total;
    },
    // 图片地址传递
    chooseItem(val) {
      this.$emit("chooseItem", val);
    },
    // 获取图片列表
    // async getImgDates() {
    //   this.matList = [];
    //   return new Promise((resolve, reject) => {
    //     getImgDate({ page: this.pages }).then(res => {
    //       return resolve(res);
    //     });
    //   });
    // },
    //  折叠事件
    // async handleChange(val) {
    //   if (val) {
    //     this.dayTime = this.matList[val].name;
    //     this.itemsData(val);
    //   }
    // },
    // 获取图片(折叠时)
    // async getImgLists() {
    //   return new Promise((resolve, reject) => {
    //     getOssImgs(this.dayTime).then(res => {
    //       return resolve(res.data);
    //     });
    //   });
    // },
    // 列表赋值
    // async itemsData(val) {
    //   let imgItem = await this.getImgLists();
    //   let item = this.matList[val];
    //   item.list = imgItem;
    //   this.$set(this.matList, val, item);
    // }
    // 获取图片列表
    async getImgList() {
      return new Promise((resolve, reject) => {
        const params = {
          start: this.start,
          end: this.end,
          page: this.pages,
          from: this.intImg ? 0:1
        }
        getOssImgList(params).then(res => {
          return resolve(res);
        });
      });
    }
  },
  async mounted() {
    // 分页列表
    // let keys = await this.getImgDates();
    // keys.data.map(res => {
    //   this.matList.push({ name: res, list: [] });
    // });
    // this.$store.commit("setTotal", keys.meta.pagination.total);
    // this.totalNum = keys.meta.pagination.total;
    // // 详细数据项
    // this.dayTime = keys.data[0];
    // this.itemsData(0);
    this.matList = await this.getImgList();
    this.list = this.matList.data;
    this.$store.commit("setTotal", this.matList.meta.pagination.total);
    this.totalNum = this.matList.meta.pagination.total;
  },
  computed: {
    dataList() {
      return [this.pages, this.upDate, this.intImg];
    },
    ...mapGetters(['page'])
  },
  watch: {
    page(newVal){
      this.pages = newVal;
    },
    async dataList(newVal) {
      // let keys = await this.getImgDates();
      // keys.data.map(res => {
      //   this.matList.push({ name: res, list: [] });
      // });
      this.matList = await this.getImgList();
      this.list = this.matList.data;
      this.$store.commit("setTotal", this.matList.meta.pagination.total);
      // this.dayTime = keys.data[0];
      // this.itemsData(0);
    }
  }
};
</script>
<style lang="scss" scoped>
.img-name {
  word-break: break-all;
  display: block;
  text-align: center;
}
.forc{
  display: inline-block;
  width: 100%;
  height: 150px;
  overflow: hidden;
  text-align: center;
}
.img-list {
  width: 100%;
}
.el-collapse {
  max-height: calc(100vh - 300px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
.imglist-content {
  padding: 0 20px;
}
.no-res{
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 50px;
}
</style>
