<template>
  <!-- 左侧 -->
  <div class="left el-col-7">
    <div class="top-header">
      <!-- 顶部切换 -->
      <div class="tab mt10">
        <span class="cp" :class="{on:type === 'article'}" @click="getConts('article')">文章</span>
        <span class="cp" :class="{on:type === 'video'}" @click="getConts('video')">视频</span>
      </div>
      <!-- 搜索框 -->
      <div class="sear mt20">
        <el-input v-inputRule prefix-icon="el-icon-search" v-model="keyValue"></el-input>
        <el-button type="dqx-btn ml10" @click="searCont">搜索</el-button>
      </div>
    </div>
    <!-- 文章列表 -->
    <div class="list">
      <div class="item cp" v-for="item in list" :key="item.id" @click="getDet(item.id)">
        <span
          class="c424 f16"
        >{{item.title}}</span>
        <em class="cada f14 mt10">{{item.updateTime | formatTime}}</em>
      </div>
    </div>
    <paging ref="paging" @changePage="changePage" :total="total" class="mt10"></paging>
  </div>
</template>
<script>
import paging from "@/components/Paging/page-eva";
import { getCont,getContKey } from '@/api/eva'
import { formatTime } from "@/utils/index.js";
export default {
  data() {
    return {
      total: 0,
      type: 'article',
      keyValue:'',
      keyWorlds: "",
      page:0,
      list:[],
      isSearch:false
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
    // 分页切换
    async changePage(val) {
      this.page = val;
    },
    // 内容检索
    async searCont(){
      this.isSearch = true;
      this.keyWorlds = this.keyValue;
      // this.getKeyIndex();
    },
    async getConts(val) {
      this.type = val;
      this.$emit('type',val)
    },
    async getKeyIndex(){
      getContKey(this.type,{content:this.keyWorlds,page:this.page}).then(res => {
         this.list = res.data;
        this.total = res.meta.pagination.total
      })
    },
    async getIndex(){
      getCont(this.type,{page:this.page}).then( res =>{
        this.list = res.data;
        this.total = res.meta.pagination.total
      })
    },
    async getDet(val){
      this.$emit('contId',val)
    }
  },
  mounted(){
    this.page = 1
  },
  computed:{
    dataList(){
      return [this.page,this.type,this.keyWorlds]
    }
  },
  watch:{
    dataList(newVal){
      if(!this.isSearch){
        this.getIndex();
      }else{
        this.getKeyIndex();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-pagination{
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
    width: calc(25% - 40px);
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
    width: 185px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid #cecece;
    margin-left: calc(50% - 92px);
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
}
</style>

