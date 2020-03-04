
<template>
  <section class="ctn">
    <div class="title">
      <span>2020年3月</span>

      <el-date-picker
        v-model="value2"
        type="month"
        placeholder="选择月">
      </el-date-picker>
    </div>

    <div>
      <el-calendar v-model="value" :first-day-of-week='7'></el-calendar>
    </div>
  </section>
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

  },
  data () {
    return {
      value: new Date(),
      value2: ''
    }
  },
  methods: {

  },
  activated () {
    console.log('每次激活组件时触发适合用于初始化')
  },
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},

  watch: {}

}
</script>

<style scoped lang='scss'>
.ctn{
  &>.title{
    padding: 15px 0;
    &>span{
      font-size: 20px;
      font-weight: bold;
      margin: 0 20px;
    }
  }
}
</style>
