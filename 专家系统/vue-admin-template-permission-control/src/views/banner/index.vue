<template>
  <div>
    <!-- <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab> -->
    <edit :is="currentTab" ref="Edit"></edit>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import List from './list'
import Edit from './edit'
export default {
  data() {
    return { 
      tabList: [{name:"上传图片",value:'Edit'},{name: "历史记录",value:'List'}],
      currentTab:'Edit'
    };
  },
  components: {
    TopTab,
    List,
    Edit
  },
  methods: {
    //   顶部tab
    chooseTab(val) {
      // console.log(val);
      if(val === 'List') this.$store.commit("setPaging", false);
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
