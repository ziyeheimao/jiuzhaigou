
<template>
  <section class="ctn">
    <p class="empty" v-if="upDataLog.length===0">暂无数据</p>
    <div v-for="(v,k) in upDataLog" :key="k" class="log">
      <div class="info">
        <span>日志{{k+1}}</span>
        <span>日志名称:{{v.name}}</span>
        <span>操作人姓名:{{v.operateUserName}}</span>
        <span>操作人角色：{{v.operateUserRole}}</span>
        <span>操作时间:{{v.createTime}}</span>
      </div>


      <div class="table" v-if="v.editInfo.length && v.editInfo.length > 0">
        <p>变更信息</p>
        <el-table :data="v.editInfo" style="width: 100%">
          <el-table-column prop="fieldName" label="变更字段"></el-table-column>
          <el-table-column prop="fieldChineseName" label="字段中文"></el-table-column>
          <el-table-column prop="fieldValueBeforeChange" label="变更前"></el-table-column>
          <el-table-column prop="fieldValueAfterChange" label="变更后"></el-table-column>
        </el-table>
      </div>
    </div>

    <div class="page">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count='5'
        :total="pageCount" :page-count='pageCount' :current-page="1"
        @size-change="sizeChange" @current-change="currentChange"></el-pagination>
    </div>

    <div class="btn">
      <el-button type="primary" @click="quit">返 回</el-button>
    </div>
  </section>
</template>

<script>
export default {
  components: {
    // x
  },
  // props: [''],
  computed: {
  },
  data () {
    return {
      pageCount: 0,
      upDataLog: [],

      workId: '',
      form: {
        page: 1,
        limit: 10,
        workId: ''
      }
    }
  },
  methods: {
    // 返回
    quit () {
      this.$router.go(-1)
    },
    // 分页
    currentChange (page) { // 翻页
      this.form.page = page
      this.search()
    },
    sizeChange (limit) { // 页大小
      this.form.limit = limit
      this.search()
    },

    init () {
      let updataWork = JSON.parse(sessionStorage.getItem('updataWork'))
      this.workId = this.form.workId = updataWork.workId
      this.search()
    },
    search () {
      this.$api.workOperateLogPage(this.form).then(res => {
        if (res.code === 0) {
          for (let i of res.bean.list) {
            i.editInfo = JSON.parse(i.editInfo)
          }
          this.pageCount = res.bean.totalCount
          this.upDataLog = res.bean.list
        }
      })
    }
  },
  beforeCreate () {},
  created () {
    this.init()
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
@import './auditDetails.scss';
.ctn{
  .empty{
    text-align: center;
    color: #bbb;
    font-size: 25px;
    padding: 20px;
  }
  .log{
    &>.info{
      display: flex;
      justify-content: space-between;
    }
    border-bottom: 1px dashed $borderC;
    padding: 10px;
    padding-bottom: 20px;
  }
}

</style>
