<template>
    <div>
        <div class="mt50">
        <em>外链地址：</em>
        <el-input placeholder="请输入外链地址" v-model="urlLink"></el-input></div>
        <div class="tac mt50">
            <el-button type="dqx-btn" @click="urlCon">确认添加</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            urlLink:''
        }
    },
    methods:{
        urlCon(){
            this.$emit('urlCon',['3',this.urlLink,3])
            // this.$emit('urlCon',this.urlLink)
        }
    },
}
</script>
<style lang="scss" scoped>
/deep/.el-input{
    width: calc(100% - 150px);
}
</style>