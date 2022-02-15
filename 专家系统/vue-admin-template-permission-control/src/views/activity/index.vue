<template>
  <div>
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <InviDetail :is="currentTab" ref="InviDetail"></InviDetail>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import Set from './set.vue'
import Code from './code.vue'
import InviDetail from './inviDetail.vue'
// import Logistics from './logistics.vue'
import Gift from './gift.vue'
export default {
  data() {
    return { 
      // {name: "用户拉新详情",value:'InviDetail'},
      // ,{name: "兑换码查询",value:'Code'}
      tabList: [{name: "专家方案详情",value:'InviDetail'},{name: "礼品管理",value:'Gift'},{name: "活动设置",value:'Set'}],
      currentTab:'InviDetail'
    };
  },
  components: {
    TopTab,
    Set,
    Code,
    InviDetail,
    // Logistics,
    Gift
  },
  methods: {
    //   顶部tab
    chooseTab(val) {
      // console.log(val);
      this.currentTab = val;
    },
  },
  mounted() {
    // this.$store.commit("setPaging", true);
  },
  computed: {
  }
};
</script>
