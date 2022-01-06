<template>
    <div class="circle">
        <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
        <circle :is="currentTab" ref="Circles"></circle>
    </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import Circles from './circle'
import Sort from './sort'
export default {
    data(){
        return{
            tabList: [{name:"圈子管理",value:'Circles'},{name: "类别管理",value:'Sort'}],
            currentTab:'Circles'
        }
    },
    components:{
        TopTab,
        Circles,
        Sort
    },
    methods:{
        chooseTab(val){
            this.currentTab = val;
        }
    }
}
</script>
