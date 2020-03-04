<template>
  <transition name="fade">
    <!-- <keep-alive> -->
    <router-view></router-view>
    <!-- </keep-alive> -->
  </transition>
</template>

<script>
  export default {
    data () {
      return {
        timer: null
      }
    },
    created () {},
    mounted () {
      this.innerSizeCount()
      window.onresize = () => { this.innerSizeCount() }
    },
    methods: {
      // 文档可视区尺寸
      innerSizeCount () {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          let size = { width: window.innerWidth, height: window.innerHeight }
          this.$store.commit('common/updateInnerSize', size)
        }, 100)
      }
    }
  }
</script>
