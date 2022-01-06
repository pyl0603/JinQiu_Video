<template>
  <section class="app-main">
    <div class="router-page">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb class="breadcrumb-container"/>
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" class="main-cont"/>
      </transition>
      <paging></paging>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Paging from "@/components/Paging";
export default {
  name: "AppMain",
  components: {
    Breadcrumb,
    Hamburger,
    Paging
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    }
  },
  computed: {
    key() {
      return this.$route.fullPath;
    },
    ...mapGetters(["sidebar", "avatar"])
  }
};
</script>

<style scoped lang="scss">
.main-cont {
  margin-top: 50px;
  border-top: 1px solid #F0F0F0;
  padding: 20px;
  // margin-left: 20px;
}
.hamburger-container {
  height: 49px;
  line-height: 46px;
  // height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.breadcrumb-container {
  float: left;
}
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 30px);
  width: 100%;
  position: relative;
  overflow: hidden;
  div.router-page {
    background: #fff;
    height: 50px;
    margin: 20px 20px 0 20px;
    border: 1px solid #f2f2f2;
    min-height: calc(100vh - 100px);
  }
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>