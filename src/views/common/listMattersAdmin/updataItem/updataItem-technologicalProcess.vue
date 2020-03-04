<template>
  <section class="ctn">
    <div class="btnTop">
      <el-button type="primary" icon="el-icon-plus" @click="addSearch">关联流程图</el-button>
    </div>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="name" label="工作流名称"></el-table-column>
      <el-table-column prop="activitikey" label="工作流标识"></el-table-column>
      <el-table-column prop="info" label="流程描述"></el-table-column>
      <el-table-column prop="activitiKey" label="工作流关联"></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
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
      <el-button type="primary" @click="submit">变更申请</el-button>
      <el-button @click="dialogVisible = true">取 消</el-button>
    </div>

    <el-dialog title="确认操作" :visible.sync="dialogVisible" width="30%" :append-to-body='true'>
      <span>取消后本次填写的内容将不会保存，确定取消？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="quit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>


    <!-- 关联工作流 -->
    <el-dialog class="relation-dialog" title="引用流程" :visible.sync="quoteDialogVisible" width="1000px" :append-to-body='true'>
      <div class="search">
        <el-form :model="relationForm" ref="relationForm" label-width="90px" :inline='true'>
          <el-form-item label="工作流名称">
            <el-input v-model="relationForm.name" placeholder="请输入工作流名称"></el-input>
          </el-form-item>

          <el-form-item label="工作流标识">
            <el-input v-model="relationForm.activitikey" placeholder="请输入工作流标识"></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" @click="addSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="relationTable" style="width: 100%">
        <el-table-column prop="id" label="编号" width="100"></el-table-column>
        <el-table-column prop="name" label="流程名称"></el-table-column>
        <el-table-column prop="activitiKey" label="工作流标识"></el-table-column>
        <el-table-column prop="info" label="流程描述"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="relationSee(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="relation(scope.row, 1)" :disabled="tableData.length > 0 && tableData[0].activitiKey === scope.row.activitiKey">关联</el-button>
            <el-button type="text" size="small" @click="relation(scope.row, 2)" :disabled="true">取联</el-button><!-- tableData[0].activitiKey !== scope.row.activitiKey -->
          </template>
        </el-table-column>
      </el-table>

      <div class="relation-page">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count='5'
          :total="relationPageCount" :page-count='relationPageCount' :current-page="1"
          @size-change="relationSizeChange" @current-change="relationCurrentChange"></el-pagination>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="quoteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 查看工作流 -->
    <el-dialog class="relation-dialog" title="引用流程" :visible.sync="seeDialogVisible" width="1000px" :append-to-body='true'>
      <div>
        <iframe frameborder='0' width="100%" style="border: 1px solid #ccc;"
          :src="'http://47.111.7.64:9083/models/'+see.modelId+'/png?token='+see.token"></iframe>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="seeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="seeDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { notNullClone, openInfo } from '@/utils'

export default {
  components: {},
  // props: [''],
  computed: {
  },
  data () {
    return {
      dialogVisible: false,
      // 关联流程
      tableData: [],
      workId: '',
      form: {
        workId: '',
        page: 1,
        limit: 10
      },
      pageCount: 0, // 分页总条数

      editForm: {
        page: 1,
        limit: 10,
        name: '',
        activitikey: ''
      }, // 编辑

      // 关联 ------------------------------------------------------------------------------------------------
      relationForm: { // 搜索关联的工作流
        page: 1,
        limit: 10,
        name: '',
        activitikey: ''
      },
      relationPageCount: 0, // 分页总条数
      quoteDialogVisible: false, // 引用流程 关联流程模态框
      relationTable: [],

      seeDialogVisible: false, // 查看工作流

      // 更新数据
      workActiviti: {
        workId: '',
        activitiKey: '', // 工作流标识
        id: '',
        name: '',
        info: '' // 信息
        // createTime: '', // 创建时间
        // createUserId: '', // 创建用户id
        // isDel: '', // 是否删除
        // updateTime: '', // 更新时间
        // updateUserId: '', // 更新用户id
        // version: '' // 版本
      },
      auditId: null,

      see: { // 工作流回显
        modelId: '',
        token: ''
      }
    }
  },
  methods: {
    init () {
      let updataWork = JSON.parse(sessionStorage.getItem('updataWork'))
      this.workId = this.form.workId = this.workActiviti.workId = updataWork.workId

      if (sessionStorage.getItem('auditId')) this.auditId = Number(sessionStorage.getItem('auditId')) || null

      this.search()
    },
    // 返回
    quit () { this.$router.go(-1) },
    submit () {
      let req = { workActiviti: this.workActiviti, workId: this.workId }
      this.$api.workUpdate(req).then(res => {
        if (res.code === 0) {
          openInfo('修改成功', 's')
        } else {
          openInfo('修改失败，请按参照规范修改后重新提交', 'e')
        }
      })
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
    // 主表格&初始化
    search () {
      let req = {}
      if (this.auditId) req = { page: this.form.page, limit: this.form.limit, workId: this.form.workId, auditId: this.auditId }
      else req = { page: this.form.page, limit: this.form.limit, workId: this.form.workId }

      this.$api.workActivitiPage(req).then(res => {
        if (res.code === 0) {
          this.tableData = res.bean.list
          this.pageCount = res.bean.totalCount
        }
      })
    },

    // 编辑
    edit (row) {
      this.quoteDialogVisible = true
      let req = notNullClone(this.editForm)
      this.$api.workActivitiActList(req).then(res => {
      })
    },

    // 添加关联 获取可关联的列表 -------------------------------------------------------------------------------------------
    addSearch () {
      this.quoteDialogVisible = true

      let req = {}
      req.page = this.relationForm.page
      req.limit = this.relationForm.limit
      req.status = this.relationForm.status

      if (this.relationForm.name) req.name = this.relationForm.name
      if (this.relationForm.activitikey) req.activitikey = this.relationForm.activitikey

      this.$api.activitiPage(req).then(res => {
        if (res.code === 0) {
          this.relationTable = res.bean.list
          this.relationPageCount = res.bean.totalCount
        }
      })
    },

    // 分页
    relationCurrentChange (page) { // 翻页
      this.relationForm.page = page
      this.addSearch()
    },
    relationSizeChange (limit) { // 页大小
      this.relationForm.limit = limit
      this.addSearch()
    },

    // 查看
    relationSee (row) {
      this.seeDialogVisible = true

      this.see.modelId = row.modelId // 工作流回显
      this.see.token = this.$cookie.get('token')
    },
    // 关联
    relation (row, type) {
      if (this.tableData.length > 0) this.tableData[0].activitiKey = row.activitiKey
      let req = {
        WorkUpdateParam: {
          activitiKey: row.activitiKey, // string工作流标识
          id: row.id, // integer($int64)主键id
          info: row.info, // string流程描述
          name: row.name, // string工作流名称
          workId: this.workId // integer($int32)
        },
        workId: this.workId
      }
      this.$api.workUpdate(req).then(res => {
        if (res.code === 0) {
          openInfo('修改成功', 's')
        } else {
          openInfo('修改失败，请按参照规范修改后重新提交', 'e')
        }
      })
      this.quoteDialogVisible = false
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
@import './updataItem.scss';

.relation-dialog{
  .search{
    text-align: center;
  }
  .relation-page{
    margin-top: 20px;
    text-align: center;
  }
}
</style>
