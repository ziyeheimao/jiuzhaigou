<template>
  <section class="ctn">
    <div class="btnTop">
      <el-button type="primary" icon="el-icon-plus" @click="addSearch">关联流程图</el-button>
    </div>

    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="name" label="工作流名称"></el-table-column>
      <el-table-column prop="activitiKey" label="工作流标识"></el-table-column>
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
      <el-button type="primary" @click="click(1)">上一步</el-button>
      <el-button type="primary" @click="click(2, 'form')" :disabled="tableData.length === 0">下一步</el-button>
      <el-button @click="click(3)">取消</el-button>
    </div>


    <!-- 关联工作流 -->
    <el-dialog class="relation-dialog" title="引用流程" :visible.sync="quoteDialogVisible" width="1000px" :append-to-body='true'>
      <div class="initSearch">
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
    <el-dialog class="relation-dialog" title="查看流程" :visible.sync="seeDialogVisible" width="1000px" :append-to-body='true'>
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
import { openInfo } from '@/utils'

export default {
  components: {},
  // props: [''],
  computed: {
  },
  data () {
    return {
      // 关联流程
      tableData: [],
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
        // name: '',
        // activitikey: '',
        status: 2 // 已启用
      },
      relationPageCount: 0, // 分页总条数
      quoteDialogVisible: false, // 引用流程 关联流程模态框
      relationTable: [],

      seeDialogVisible: false, // 查看工作流
      row: {},
      see: { // 工作流回显
        modelId: '',
        token: ''
      }
    }
  },
  methods: {
    // 分页
    currentChange (page) { // 翻页
      this.form.page = page
      this.initSearch()
    },
    sizeChange (limit) { // 页大小
      this.form.limit = limit
      this.initSearch()
    },
    // 主表格&初始化
    initSearch () {
      this.$api.workActivitiPage(this.form).then(res => {
        if (res.code === 0) {
          this.tableData = res.bean.list
          this.pageCount = res.bean.totalCount
        }
      })
    },
    click (type, form) {
      switch (type) {
        case 1:
          this.$store.commit('common/updatePrevious') // 上一步
          break
        case 2:
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
    // 编辑
    edit (row) {
      // console.log(row, this.tableData[0])
      this.addSearch()
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

    workActivitiById () {
      return new Promise((resolve, reject) => {
        this.$api.workActivitiById(this.tableData[0].id).then(res => {
          if (res.code === 0) {
            this.row = res.bean
          }
          resolve()
        })
      })
    },
    // 关联 取消关联
    relation: async function (row, type) {
      if (this.tableData.length === 0) {
        let req = {
          activitiKey: row.activitiKey,
          workId: this.form.workId,
          name: row.name,
          info: row.info
        }
        this.$api.workActivitiAdd(req).then(res => {
          if (res.code === 0) {
            openInfo('修改成功', 's')
            this.quoteDialogVisible = false
            this.initSearch()
          }
          console.log('关联取关(新增接口)', res)
        })
      } else {
        console.log('修改')
        await this.workActivitiById() // 通过id获取work
        let req = {
          id: this.row.id,
          // activitiKey: this.row.activitiKey,
          name: this.row.name,
          info: this.row.info,
          workId: this.form.workId
        }
        if (type === 1) req.activitiKey = row.activitiKey
        else if (type === 2) req.activitiKey = ''

        console.log(req)
        this.$api.workActivitiUpdata(req).then(res => {
          if (res.code === 0) {
            openInfo('修改成功', 's')
            this.quoteDialogVisible = false
            this.initSearch()
          }
          console.log('关联取关(修改接口)', res)
        })
      }
    }

  },
  beforeCreate () {},
  created () {
    this.form.workId = sessionStorage.getItem('workId')
    this.initSearch()
  },
  beforeMount () {},
  mounted () {
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {}
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

.relation-dialog{
  .initSearch{
    text-align: center;
  }
  .relation-page{
    margin-top: 20px;
    text-align: center;
  }
}
</style>
