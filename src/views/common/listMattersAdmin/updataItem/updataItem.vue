<template>
  <el-container class="ctn">
    <el-header :style="'padding:0; height:170px;'">
      <div class="title">编辑事项</div>
      <div class="info red">安全生产许可企业地址变更</div>
      <div class="btn">
        <el-button type="primary" v-for="(v,k) in btnList" :key="k" :plain="updataActive !== k" @click='clickChange(k)'>{{v}}</el-button>
      </div>
    </el-header>

    <el-main>
      <basics :auditId='auditId' v-if='updataActive === 0'></basics>

      <implementation :auditId='auditId' v-if='updataActive === 1'></implementation>

      <service :auditId='auditId' v-if='updataActive === 2'></service>

      <apply :auditId='auditId' v-if='updataActive === 3'></apply>

      <technologicalProcess :auditId='auditId' v-if='updataActive === 4'></technologicalProcess>

      <toExamine :auditId='auditId' v-if='updataActive === 5'></toExamine>

      <answer :auditId='auditId' v-if='updataActive === 6'></answer>

      <log :auditId='auditId' v-if='updataActive === 7'></log>
    </el-main>
  </el-container>
</template>

<script>
import basics from './updataItem-basics'
import implementation from './updataItem-implementation'
import service from './updataItem-service'
import apply from './updataItem-apply'
import technologicalProcess from './updataItem-technologicalProcess'
import toExamine from './updataItem-toExamine'
import answer from './updataItem-answer'
import log from './updataItem-log.vue'

export default {
  components: {
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
  computed: {},
  data () {
    return {
      updataActive: 0,
      auditId: 0,
      btnList: [ '基础信息', '实施信息', '服务信息', '申请材料', '流程配置', '审查要点', '常见问题解答', '事项日志' ]
    }
  },
  methods: {
    clickChange (index) {
      sessionStorage.setItem('updataActive', index)
      this.updataActive = index
    }
  },
  beforeCreate () {},
  created () {
    this.updataActive = Number(sessionStorage.getItem('updataActive')) || 0
    this.auditId = Number(sessionStorage.getItem('auditId')) || 0
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
@import '../../../../style/index.scss';

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
