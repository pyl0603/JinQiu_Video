<template>
    <div class="live">
        <!-- <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab> -->
        <Studio ref="Studio"></Studio>
    </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import Source from './source'
import Studio from './studio'
export default {
    data(){
        return{
            tabList: [{name:"直播源设置",value:'Source'},{name: "直播间设置",value:'Studio'}],
            currentTab:'Source'
        }
    },
    components:{
        TopTab,
        Source,
        Studio
    },
    methods:{
        chooseTab(val){
            this.currentTab = val;
        }
    }
}
</script>
