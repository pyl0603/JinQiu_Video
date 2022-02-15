<template>
    <div></div>
</template>
<script>
export default {
    created(){
        this.$store.commit('setPaging',false)
    }
}
</script>
