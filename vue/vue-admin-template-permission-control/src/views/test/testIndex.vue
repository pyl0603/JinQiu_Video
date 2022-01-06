<template>
  <div class="box">
    <div
      v-for="(item, index) in arr"
      :key="index"
      :index="index"
      style="background:blue;margin:10px;"
      class="test"
    >
      <dragAndDrop class="contain" :index="index">
        <div style="background:red;">
          <div>{{item.name}}</div>
          <div>{{item.sex}}</div>这是里面一层
        </div>
      </dragAndDrop>
      <div class="哈哈哈">无数据层{{index}}</div>
    </div>
  </div>
</template>
<script>
import dragAndDrop from "./demo";
export default {
  data() {
    return {
      arr: [{name:'1',sex:'女'},{name:'25',sex:'女'},{name:'9',sex:'女'},{name:'5',sex:'男'},{name:'4',sex:'男'},{name:'3',sex:'女'},{name:'2',sex:'男'}],
      list: []
    };
  },
  methods: {},
  components: {
    dragAndDrop
  },
  mounted() {
    // this.arr = new Array(9).fill(null);
    this.list = [
      {
        awayTeam: {
          id: 10643,
          nameZh: "塞尔维亚",
          nameEn: "Serbia",
          shortNameZh: "塞尔维亚",
          shortNameEn: "Serbia",
          nameZht: "塞爾維亞",
          shortNameZht: "塞爾維亞",
          logo:
            "https://cdn.sportnanoapi.com/basketball/team/f42e84ec9aa9027eacc9beef351d36ee.png",
          matcheventId: null
        },
        homeTeam: {
          id: 10609,
          nameZh: "阿根廷",
          nameEn: "Argentina",
          shortNameZh: "阿根廷",
          shortNameEn: "Argentina",
          nameZht: "阿根廷",
          shortNameZht: "阿根廷",
          logo:
            "https://cdn.sportnanoapi.com/basketball/team/597025607c2279e1d8f0fd08e8bfde70.gif",
          matcheventId: null
        },
        homeScore: 97,
        awayScore: 87,
        winner: 1
      },
      {
        awayTeam: {
          id: 10650,
          nameZh: "法国",
          nameEn: "France",
          shortNameZh: "法国",
          shortNameEn: "France",
          nameZht: "法國",
          shortNameZht: "法國",
          logo:
            "https://cdn.sportnanoapi.com/basketball/team/d3282e1a7aad9ed478776de3a76080ba.gif",
          matcheventId: null
        },
        homeTeam: {
          id: 10608,
          nameZh: "美国",
          nameEn: "USA",
          shortNameZh: "美国",
          shortNameEn: "USA",
          nameZht: "美國",
          shortNameZht: "美國",
          logo:
            "https://cdn.sportnanoapi.com/basketball/team/fc0e73d32f430194dd056b7745f8ee8a.gif",
          matcheventId: null
        },
        homeScore: 79,
        awayScore: 89,
        winner: 2
      }
    ];
    // this.dragInit();
  }
};
</script>
<style>
.box {
  display: flex;
  flex-wrap: wrap;
}
.contain {
  width: 100px;
  height: 100px;
  background: purple;
  margin: 20px;
  font-size: 15px;
}
.test:first-child{
    margin-right: 50px;
}
.box .test:first-child .contain{
    background: yellow;
}
</style>