<template>
  <div>
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <picture :is="currentTab" ref="Picture"></picture>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import Picture from './img-list'
import Video from './video-list'
export default {
  data() {
    return { 
      tabList: [{name:"图片管理",value:'Picture'},{name: "视频管理",value:'Video'}],
      currentTab:'Picture'
    };
  },
  components: {
    TopTab,
    Picture,
    Video
  },
  methods: {
    //   顶部tab
    chooseTab(val) {
      this.currentTab = val;
    }
  },
  mounted() {
  },
  computed: {
  }
};
</script>
