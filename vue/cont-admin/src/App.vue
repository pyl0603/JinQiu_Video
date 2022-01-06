<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
    <!-- <div class="change-type">
      <span class="cp" :class="{on : type==0}" @click="setType(0)">足球</span>
      <span class="cp" :class="{on : type==1}" @click="setType(1)">篮球</span>
    </div> -->
  </div>
</template>

<script>
import { getCategory, setCategory } from "@/utils/auth";
import Cookies from "js-cookie";
export default {
  name: "App",
  data() {
    return {
      isLq: false,
      isZq: false,
      isRouterAlive: true
    };
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  updated() {
    if (1585965600000 < new Date().getTime() && new Date().getTime() < 1585965780000) {
      if (localStorage.getItem("type") === "lq") {
        document.body.className = "isLq gray";
      } else {
        document.body.className = "isZq gray";
      }
    } else {
      if (localStorage.getItem("type") === "lq") {
        document.body.className = "isLq";
      } else {
        document.body.className = "isZq";
      }
    }
  },
  created() {
    if (!Cookies.get("Category")) {
      Cookies.set("Category", 0);
    }
    this.type = Cookies.get("Category");
    console.log(this.type);
  },
  methods: {
    async setType(val) {
      Cookies.set("Category", val);
      console.log(Cookies.get("Category"));
      this.type = val;
      location.reload();
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.change-type {
  position: fixed;
  bottom: 50vh;
  right: 30px;
  z-index: 9;
  span {
    display: block;
    margin-top: 10px;
    text-align: center;
    line-height: 30px;
    width: 50px;
    height: 30px;
    border: 1px solid #e4e4e4;
    border-radius: 8px;
    font-size: 12px;
    background: #fff;
  }
  .on {
    background: #18ce94;
    color: #fff;
    border: 1px solid #18ce94;
  }
}
</style>
