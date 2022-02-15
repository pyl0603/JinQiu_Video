<template>
    <div class="top-tab">
        <span v-for="(item,index) in tabList" :key="index" class="f14 c171" @click="chooseTab(item,index)" :class="{c18c : itemIndex == index}">{{item.name}}</span>
    </div>
</template>
<script>
export default {
    props:{
        tabList:{
            type:Array,
            default:()=>[]
        },
        chooseIndex:{
            type:Number,
            default:0
        }
    },
    data(){
        return{
            itemIndex:0
        }
    },
    methods:{
        // 头部tab切换
        chooseTab(e,index){
            this.itemIndex = index
            this.$emit('chooseTab',e.value)
        }
    },
    watch:{
        chooseIndex(newVal){
            this.itemIndex = newVal;
        }
    }
}
</script>
<style lang="scss">
.top-tab{
    position: absolute;
    top: 85px;
    right: 40px;
    span+span{
        border-left: 2px solid #CECECE;
    }
    span{
        display: inline-block;
        padding: 0 15px;
        cursor: pointer;
    }
}
</style>

