
<template>
  <section class="ctn">
    <div class="btnTop">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible=true">新增</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="dels">删除</el-button>
      </el-button-group>
    </div>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column width="55" type="selection"></el-table-column>
      <el-table-column prop="id" label="编号" width="50"></el-table-column>
      <el-table-column prop="content" label="审核要点"></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="beforeDel(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count='5'
        :total="pageCount" :page-count='pageCount' :current-page="1"
        @size-change="sizeChange" @current-change="currentChange"></el-pagination>
    </div>

    <div class="btn">
      <el-button type="primary" @click="click(1)">上一步</el-button>
      <el-button type="primary" @click="click(2, 'form')">下一步</el-button>
      <!-- <el-button type="primary" @click="click(4)">上 报</el-button> -->
      <el-button @click="click(3)">取消</el-button>
    </div>

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
import { openInfo } from '@/utils'
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
      }
    }
  },
  methods: {
    // 分页
    currentChange (page) { // 翻页
      this.form.page = page
      this.search()
    },
    sizeChange (limit) { // 页大小
      this.form.limit = limit
      this.search()
    },
    click (type, form) {
      switch (type) {
        case 1:
          this.$store.commit('common/updatePrevious') // 上一步
          break
        case 2:
          // this.submit(form) // 提交当前页表单
          this.$store.commit('common/updateNext') // 下一步
          break
        case 3:
          this.$store.commit('common/updateQuit') // 取消 / 返回
          break
        case 4:
          this.$store.commit('common/updateSubmit') // 上报
          break
      }
    },
    // 表格选取
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页
    search () {
      let req = {
        workId: this.form.workId,
        page: this.form.page,
        limit: this.form.limit
      }
      this.$api.workAuditPointPage(req).then(res => {
        this.tableData = res.bean.list
        this.pageCount = res.bean.totalCount
        console.log(res)
      })
    },
    // 新增
    add (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$api.workAuditPointAdd(this.form).then(res => {
            if (res.code === 0) {
              this.form.content = ''
              openInfo('保存成功', 's')
            } else {
              openInfo('保存失败，请按参照规范修改后重新提交', 'e')
            }
          })
          this.addDialogVisible = false
        }
      })
    },
    // 保存并添加下一个
    addNext (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$api.workAuditPointAdd(this.form).then(res => {
            if (res.code === 0) {
              this.form.content = ''
              openInfo('保存成功', 's')
            } else {
              openInfo('保存失败，请按参照规范修改后重新提交', 'e')
            }
          })
        }
      })
    },
    // 批量删
    dels () {
      if (this.multipleSelection.length === 0) return

      this.$confirm('确定要删除选中的数据?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      .then(() => {
        let obj = {ids: []}
        for (let i of this.multipleSelection) {
          obj.ids.push(i.id)
        }
        this.$api.workAuditPointDelIds(obj).then(res => {
          if (res.code === 0) {
            openInfo('删除成功', 's')
            this.search() // 刷新
          } else {
            openInfo('删除成功', 'e')
          }
        })
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
      this.$api.workAuditPointDelById(row.id).then(res => {
        this.$message({ type: 'success', message: '删除成功!' })
        this.search() // 刷新
      })
    },
    // 修改
    edit (row) {
      this.$api.workAuditPointById(row.id).then(res => {
        this.editForm = res.bean
        this.editDialogVisible = true
      })
    },
    // 保存修改
    editUpdata (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let req = {
            id: this.editForm.id,
            workId: this.editForm.workId,
            content: this.editForm.content
          }
          this.$api.workAuditPointUpdata(req).then(res => {
            if (res.code === 0) {
              this.editForm.content = ''
              openInfo('保存成功', 's')
              this.search()
            } else {
              openInfo('保存失败，请按参照规范修改后重新提交', 'e')
            }
          })
          this.editDialogVisible = false
        }
      })
    }
  },
  beforeCreate () {},
  created () {
    this.form.workId = sessionStorage.getItem('workId')
    this.search()
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    addDialogVisible () {
      if (!this.addDialogVisible) {
        this.search()
      }
    }
  }

}
</script>

<style scoped lang='scss'>
@import './newItem.scss';
.ctn{
  .btnTop{
    display: block;
    text-align: left;
    margin-bottom: 10px;
  }
}
</style>
