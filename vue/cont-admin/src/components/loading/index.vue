<template>
    <div class="loadings" v-show="show">
        <div class="mask"></div>
        <div class="cont">
            <img src="~img/loading" alt="">
            <div>loading...</div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        show:{
            type:Boolean,
            default:true
        }
    }
}
</script>
<style lang="scss" scoped>
.loadings{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    left: 0;
    z-index: 999;
}
</style>

