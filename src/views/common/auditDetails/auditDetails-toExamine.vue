<template>
  <section class="ctn">
    <div class="btnTop">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible=true" :disabled="disabled">新增</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="dels" :disabled="disabled">删除</el-button>
      </el-button-group>
    </div>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column width="55" type="selection"></el-table-column>
      <el-table-column prop="id" label="编号" width="50"></el-table-column>
      <el-table-column prop="content" label="审核要点"></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="beforeDel(scope.row)" :disabled="disabled">删除</el-button>
          <el-button type="text" size="small" @click="edit(scope.row)" :disabled="disabled">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count='5'
        :total="pageCount" :page-count='pageCount' :current-page="1"
        @size-change="sizeChange" @current-change="currentChange"></el-pagination>
    </div>

    <div class="btn">
      <!-- <el-button type="primary" @click="submit">变更申请</el-button> -->
      <el-button type="primary" @click="quit">返 回</el-button>
    </div>

    <el-dialog title="确认操作" :visible.sync="dialogVisible" width="30%" :append-to-body='true'>
      <span>取消后本次填写的内容将不会保存，确定取消？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="quit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加 -->
    <el-dialog title="添加审核要点" :visible.sync="addDialogVisible" width="1000px" :append-to-body='true'>
      <el-form :model="form" ref="form" :rules="rules" label-width="90px">
        <el-form-item label="审核要点" prop="content">
          <el-input v-model="form.content" type="textarea" :rows='4' placeholder="请输入审核要点"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add('form')">保 存</el-button>
        <el-button type="primary" @click="addNext('form')">保存并添加下一个</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 删除 & 批量删除 -->
    <el-dialog title="添加审核要点" :visible.sync="delDialogVisible" width="600px" :append-to-body='true'>
      <span>确定要删除选中的数据?</span>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="del">删 除</el-button>
        <el-button @click="delDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="添加审核要点" :visible.sync="editDialogVisible" width="1000px" :append-to-body='true'>
      <el-form :model="editForm" ref="editForm" :rules="rules" label-width="90px">
        <el-form-item label="审核要点" prop="content">
          <el-input v-model="editForm.content" type="textarea" :rows='4' placeholder="请输入审核要点"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUpdata('editForm')">保 存</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
import { openInfo, clone } from '@/utils'
export default {
  components: {
    // x
  },
  // props: [''],
  computed: {

  },
  data () {
    return {
      disabled: true, // 全部表单锁定
      dialogVisible: false,
      pageCount: 0,
      workId: '',
      form: {
        workId: '',
        content: '',
        page: 1,
        limit: 10
      },
      rules: {
        content: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      tableData: [],
      multipleSelection: [],
      addDialogVisible: false, // 新增
      delDialogVisible: false, // 删除
      editDialogVisible: false, // 编辑
      editForm: {
        id: '',
        workId: '',
        content: ''
      },

      upDataRowId: '',
      // 更新数据
      pointWorkInfosParam: {
        delete: [],
        insert: [],
        update: [],
        workId: ''
      },
      seeAuditId: null
    }
  },
  methods: {
    init () {
      let updataWork = JSON.parse(sessionStorage.getItem('updataWork'))
      this.workId = this.form.workId = this.pointWorkInfosParam.workId = updataWork.workId

      if (sessionStorage.getItem('seeAuditId')) this.seeAuditId = Number(sessionStorage.getItem('seeAuditId')) || null

      this.search()
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
    // 表格选取
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页
    search () {
      let req = {}
      if (this.seeAuditId) req = { page: this.form.page, limit: this.form.limit, workId: this.form.workId, auditId: this.seeAuditId }
      else req = { page: this.form.page, limit: this.form.limit, workId: this.form.workId }

      this.$api.workAuditPointPage(req).then(res => {
        this.tableData = res.bean.list
        this.pageCount = res.bean.totalCount
      })
    },
    // 新增
    add (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let newRow = {workId: this.form.workId, content: this.form.content}
          this.pointWorkInfosParam.insert.push(newRow)
          this.tableData.push(newRow)
          this.addDialogVisible = false
        }
      })
    },
    // 保存并添加下一个
    addNext (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.pointWorkInfosParam.insert.push(this.form)
        }
      })
    },
    // 批量删
    dels () {
      this.$confirm('确定要删除选中的数据?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      .then(() => {
        this.delsDialogVisible = false
        if (this.multipleSelection.length === 0) return
        for (let i of this.multipleSelection) {
          this.delete(i, this.tableData)
        }
      })
      .catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 删除确认
    beforeDel (row) {
      this.$confirm('确定要删除选中的数据?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      .then(() => {
        this.del(row)
      })
      .catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 删除
    del (row) {
      this.delete(row, this.tableData)
    },
    delete (row, tableData) {
      let index = 0
      for (let i = 0; i < tableData.length; i++) {
        if (row.id === tableData[i].id) {
          index = i
          break
        }
      }
      tableData.splice(index, 1)
      this.pointWorkInfosParam.delete.push(row.id)
      openInfo('删除成功', 's')
    },
    // 修改
    edit (row) {
      this.upDataRowId = row.id
      this.$api.workAuditPointById(row.id).then(res => {
        this.editForm = res.bean
        this.editDialogVisible = true
      })
    },
    // 保存修改
    editUpdata (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let index = -1

          for (let i = 0; i < this.pointWorkInfosParam.update.length; i++) {
            if (this.pointWorkInfosParam.update[i].id === this.upDataRowId) {
              index = i
              break
            }
          }

          for (let i of this.tableData) {
            if (i.id === this.upDataRowId) {
              i.workId = this.editForm.workId
              i.content = this.editForm.content
            }
          }

          if (index === -1) this.pointWorkInfosParam.update.push(this.editForm)
          else this.pointWorkInfosParam.update[index] = clone(this.editForm)
          this.editDialogVisible = false
        }
      })
    },
    // 返回
    quit () { this.$router.go(-1) },
    submit () {
      let req = { pointWorkInfosParam: this.pointWorkInfosParam, workId: this.workId }
      this.$api.workUpdate(req).then(res => {
        if (res.code === 0) {
          openInfo('修改成功', 's')
        } else {
          openInfo('修改失败，请按参照规范修改后重新提交', 'e')
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
</style>
