<template>
  <div>
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <chart :is="currentTab" ref="Chart"></chart>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import Chart from './chart.vue'
import Set from './set.vue'
import Code from './code.vue'
import InviDetail from './inviDetail.vue'
import Logistics from './logistics.vue'
import Gift from './gift.vue'
export default {
  data() {
    return { 
      // {name: "用户拉新详情",value:'InviDetail'},
      // ,{name: "兑换码查询",value:'Code'}
      tabList: [{name:"活动数据",value:'Chart'},{name: "用户拉新详情",value:'InviDetail'},{name: "礼品管理",value:'Gift'},{name: "物流管理",value:'Logistics'},{name: "活动设置",value:'Set'}],
      currentTab:'Chart'
    };
  },
  components: {
    TopTab,
    Chart,
    Set,
    Code,
    InviDetail,
    Logistics,
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
