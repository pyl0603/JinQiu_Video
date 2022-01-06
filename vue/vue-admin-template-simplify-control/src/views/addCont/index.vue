<template>
    <div class="">
         <top-tab ref="topTab" @chooseTab="chooseTab" :chooseIndex="chooseIndex" :tabList="tabList"></top-tab>
         <article :is="currentTab" ref="Article"></article>
    </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import Article from './article.vue'
import Video from './video.vue'
export default {
    data(){
        return{
            tabList: [{name:"添加文章",value:'Article'},{name: "添加视频",value:'Video'}],
            currentTab:'Article',
            chooseIndex:0
        }
    },
    components:{
        TopTab,
        Article,
        Video
    },
    methods:{
        chooseTab(val,index){
            this.currentTab = val
        }
    },
    mounted(){
        if(this.$route.query.type){
            let currentTab = this.$route.query.type == 'article' ? 'Article' : 'Video'
            this.chooseIndex = this.$route.query.type == 'article' ? 0 : 1
            this.chooseTab(currentTab)
        }
        this.$store.commit('setPaging',false)
    }
}
</script>