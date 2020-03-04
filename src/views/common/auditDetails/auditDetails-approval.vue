<template>
  <section class="ctn">
    <table>
      <tr>
        <td>审核部门</td>
        <td>{{form.auditDepartmen ? form.auditDepartmen : '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'}}</td>
        <td>审核人</td>
        <td>{{form.auditUserName ? form.auditUserName : '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'}}</td>
        <td>审核状态</td>
        <td>{{form.auditStatus === 0 ? '未通过' : form.auditStatus === 1 ? '通过' : '审核中'}}</td>
        <td>审核时间</td>
        <td>{{form.auditTime ? form.auditTime : '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'}}</td>
      </tr>
      <tr>
        <td>审核意见</td>
        <td colspan='7' style="padding:20px;">
          <el-input v-model="form.auditAdvice" type="textarea" :rows='4' placeholder="请输入审核意见"></el-input>
        </td>
      </tr>
    </table>
    <div class="btn">
      <el-button @click="quit">取消</el-button>
      <el-button @click="adopt" type="success" :disabled="form.auditStatus !== 2">通过</el-button>
      <el-button @click="notPass" type="danger" :disabled="form.auditStatus !== 2">不通过</el-button>
    </div>
  </section>
</template>

<script>
// import { openInfo, clone } from '@/utils'
export default {
  components: {
    // x
  },
  props: ['row'],
  computed: {

  },
  data () {
    return {
      form: {
        auditDepartmen: '', // 部门
        auditUserName: '',
        auditStatus: null,
        auditTime: '',
        auditAdvice: '' // 审批意见
      }
    }
  },
  methods: {
    // 返回
    quit () { this.$router.go(-1) },
    init () {
      this.$api.workAuditById(this.row.id).then(res => {
        if (res.code === 0) {
          this.form = res.bean
        }
      })
    },
    // 通过
    adopt (row) {
      this.$confirm('确定审核通过吗？', '确认操作', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.approval(1, this.row.id)
      }).catch(() => {
        this.$message({ type: 'info', message: '提交失败' })
      })
    },

    // 不通过
    notPass (row) {
      this.$confirm('确定审核不通过吗？', '确认操作', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.approval(0, this.row.id)
      }).catch(() => {
        this.$message({ type: 'info', message: '提交失败' })
      })
    },

    // 审批
    approval (auditStatus, id) {
      let req = {
        auditAdvice: this.form.auditAdvice, // 审批意见
        auditStatus, // 审批状态 0-未通过 1-通过 2-审核中
        id
      }
      this.$api.workAuditAuditPost(req).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '提交成功' })

          setTimeout(() => {
            this.$router.go(-1)
          }, 300)
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
@import './auditDetails.scss';
.ctn{
  table{
    width: 100%;
    border-collapse:collapse;
    border-radius: 5px solid #aaa;
    td{
      padding: 20px 0;
      text-align: center;
      border: 1px solid #aaa;
    }
  }
}
</style>
