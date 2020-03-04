
<template>
<el-container :style="'height:' + (InnerSize.height - 160) + 'px;'">
  <iframe :src="src" ref="iframe" width="100%"></iframe>
</el-container>
  
</template>

<script>
// import api from '@api'
// import main from '@main'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {
    InnerSize () {
      return this.$store.state.common.InnerSize
    }
  },
  data () {
    return {
      src: '',
      iframeWin: {}
    }
  },
  methods: {
    sendMessage () {
      // 外部vue向iframe内部传数据
      this.iframeWin.postMessage(
        {
          cmd: 'getFormJson',
          params: {}
        },
        '*'
      )
    },
    handleMessage (event) {
    // 根据上面制定的结构来解析iframe内部发回来的数据
      const data = event.data
      switch (data.cmd) {
        case 'exit':
          this.$router.go(-1)
          break
        case 'returnHeight':
        // 业务逻辑
          break
      }
    }
  },
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {
    if (this.$route.query && this.$route.query.modelId) {
      this.src = `${window.SITE_CONFIG['workflowUrl']}/editor?modelId=${this.$route.query.modelId}`
    } else {
      this.src = `${window.SITE_CONFIG['workflowUrl']}/create?name=activiti&key=123456`
    }
    console.log(this.$route)

    window.addEventListener('message', this.handleMessage)
    this.iframeWin = this.$refs.iframe.contentWindow
  },

  beforeUpdate () {},
  updated () {},
  beforeDestroy () {
    window.removeEventListener('message', this.handleMessage)
  },
  deactivated () {},

  watch: {}
}
</script>

<style scoped lang='scss'>
</style>
