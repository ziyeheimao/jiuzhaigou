
<template>
  <el-container class="ctn">
    <el-header :style="'padding:0; height:170px;'">
      <div class="title">编辑事项</div>
      <div class="info red">安全生产许可企业地址变更</div>
      <div class="btn">
        <el-button type="primary" v-for="(v,k) in btnList" :key="k" :plain="auditActive !== k" @click='clickChange(k)'>{{v}}</el-button>
      </div>
    </el-header>

    <el-main>
      <approval :row='row' v-if='auditActive === 0'></approval>

      <basics :row='row' v-if='auditActive === 1'></basics>

      <implementation :row='row' v-if='auditActive === 2'></implementation>

      <service :row='row' v-if='auditActive === 3'></service>

      <apply :row='row' v-if='auditActive === 4'></apply>

      <technologicalProcess :row='row' v-if='auditActive === 5'></technologicalProcess>

      <toExamine :row='row' v-if='auditActive === 6'></toExamine>

      <answer :row='row' v-if='auditActive === 7'></answer>

      <log :row='row' v-if='auditActive === 8'></log>
    </el-main>
  </el-container>
</template>

<script>
import approval from './auditDetails-approval'
import basics from './auditDetails-basics'
import implementation from './auditDetails-implementation'
import service from './auditDetails-service'
import apply from './auditDetails-apply'
import technologicalProcess from './auditDetails-technologicalProcess'
import toExamine from './auditDetails-toExamine'
import answer from './auditDetails-answer'
import log from './auditDetails-log.vue'

export default {
  components: {
    approval,
    basics,
    implementation,
    service,
    apply,
    technologicalProcess,
    toExamine,
    answer,
    log
  },
  // props: [''],
  computed: {
  },
  data () {
    return {
      row: {}, // 当前事项数据
      auditActive: 0,
      btnList: [ '审批信息', '基础信息', '实施信息', '服务信息', '申请材料', '流程配置', '审查要点', '常见问题解答', '事项日志' ]
    }
  },
  methods: {
    clickChange (index) {
      sessionStorage.setItem('auditActive', index)
      this.auditActive = index
    }
  },
  beforeCreate () {},
  created () {
    this.auditActive = Number(sessionStorage.getItem('auditActive')) || 0
    this.row = this.$route.query
  },
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
@import '../../../style/index.scss';
.el-container.ctn{
  & > .el-header {
    &>.title, &>.info{
      padding: $titlePadding;
      font-size: 16px;
    }
    & > .title {
      background-color: $borderC;
    }
    & > .info {
      color: red;
      background-color: $titileBGC;
    }
    & > .btn{
      padding: 25px 25px 0;
    }
  }
  & > .el-main {
    & > section{
      border: 1px solid $borderC;
      border-radius: 5px;
      padding: 25px;
    }
  }
}
</style>
