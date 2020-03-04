
<template>
  <el-container>
    <el-header :style="'height:150px;padding:0;'">
      <div class="title">
        <P>新建事项</P>
      </div>

      <div class="steps">
        <el-steps :active="stepsActive" align-center>
          <el-step  v-for='(v,k) in titleList' :key="k" :title="v"></el-step>
        </el-steps>
      </div>
    </el-header>

    <el-main>
      <!-- 基础信息 -->
      <basics v-if="stepsActive === 0"></basics>

      <!-- 实施信息 -->
      <implementation v-if="stepsActive === 1"></implementation>

      <!-- 服务信息 -->
      <service v-if="stepsActive === 2"></service>

      <!-- 申请材料 -->
      <apply v-if="stepsActive === 3"></apply>

      <!-- 流程配置 -->
      <technologicalProcess v-if="stepsActive === 4"></technologicalProcess>

      <!-- 审核要点 -->
      <toExamine v-if="stepsActive === 5"></toExamine>

      <!-- 常见问题解答 -->
      <answer v-if="stepsActive === 6"></answer>
    </el-main>

    <el-dialog title="确认操作" :visible.sync="dialogVisibleCancel" :append-to-body='true' width="30%">
      <span>取消后本次填写的内容将不会保存，确定取消？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="quit">确 定</el-button>
        <el-button @click="dialogVisibleCancel = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
// import { openInfo, time } from '@/utils'
import basics from './newItem-basics'
import implementation from './newItem-implementation'
import service from './newItem-service'
import apply from './newItem-apply'
import technologicalProcess from './newItem-technologicalProcess'
import toExamine from './newItem-toExamine'
import answer from './newItem-answer'

export default {
  components: {
    basics,
    implementation,
    service,
    apply,
    technologicalProcess,
    toExamine,
    answer
  },
  // props: [''],
  computed: {
    Previous () {
      return this.$store.state.common.previous
    },
    Next () {
      return this.$store.state.common.next
    },
    Quit () {
      return this.$store.state.common.quit
    }
  },
  data () {
    return {
      dialogVisibleCancel: false,
      titleList: ['基础信息', '实施信息', '服务信息', '申请材料', '流程配置', '审核要点', '常见问题解答'],
      stepsActive: 3
    }
  },
  methods: {
    // 返回上一级页面
    quit () {
      this.dialogVisibleCancel = false
      this.$router.go(-1)
    },
    // 上一步
    previous () {
      if (!this.stepsActive) return
      this.stepsActive--
    },
    // 下一步
    next () { ++this.stepsActive }
  },
  beforeCreate () {},
  created () {
    this.stepsActive = Number(sessionStorage.getItem('stepsActive')) || 0
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    Previous () {
      this.previous()
    },
    Next () {
      this.next()
    },
    Quit () {
      this.dialogVisibleCancel = true
    },
    stepsActive () {
      sessionStorage.setItem('stepsActive', this.stepsActive)
    }
  }
}
</script>

<style scoped lang='scss'>
.form-item-box{
  display: flex;
  justify-content: space-between;
  
  & .el-input, & .el-select{
    width: 400px;
  }
}

.processing-time-box{
  margin-left: 50px;
  width: 720px;
  display: flex;
  justify-content: space-between;

  & .box{
    width: 600px;
    display: flex;
    justify-content: space-between;
  }
}

.el-container{
  & > .el-header{
    & > .title{
      padding: 5px 25px;
      background-color: #aaa;
    }
    & > .steps{
      width: 800px;
      margin: 20px auto 20px;
    }
  }
}
</style>
