<template>
  <section class="ctn">
    <header>
      <div class="title">
        <div class="info">
          <i class="el-icon-search"></i>
          查询条件
        </div>
        <div>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </div>

      <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth" :inline='true'>
        <el-form-item label="表单名称:" prop="">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>

        <el-form-item label="事项名称:" prop="">
          <el-input v-model="form.mark" clearable></el-input>
        </el-form-item>

        <el-form-item label="表单状态:" prop="">
          <el-select v-model="form.status" clearable>
            <el-option v-for="(v,k) in res.status" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="事项类型:" prop="">
          <el-select v-model="form.type" :disabled="true" clearable>
            <el-option v-for="(v,k) in res.type" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="行业:" prop="">
          <el-select v-model="form.hy" :disabled="true" clearable>
            <el-option v-for="(v,k) in res.hy" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </header>

    <main>
      <div class="title">
        <div class="info">
          <i class="el-icon-s-grid"></i>
          查询列表
        </div>
      </div>
      
      <div class="bom">
        <div class="btn">
          <el-link icon='el-icon-circle-plus-outline' @click="click(1)">创建</el-link>
          <!-- <el-link icon='el-icon-delete' @click="click(2)">删除</el-link>
          <el-link icon='el-icon-document-delete' @click="click(3)">作废</el-link> -->
        </div>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column prop="name" label="表单名称"></el-table-column>
          <el-table-column prop="mark" label="表单标识"></el-table-column>
          <el-table-column prop="workName" label="关联事项"></el-table-column>
          <el-table-column prop="description" label="表单描述"></el-table-column>
          <el-table-column  prop="workType" label="事项类型"></el-table-column>

          <el-table-column  prop="status" label="状态"></el-table-column>
          <el-table-column label="操作" width="170">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="operation(scope.row, 1)">查看</el-button>
              <el-button type="text" size="small" @click="operation(scope.row, 2)">复用</el-button>
              <el-button type="text" size="small" @click="operation(scope.row, 3)">作废</el-button>
              <el-button type="text" size="small" @click="operation(scope.row, 4)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>

        <div class="page">
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count='5'
            :total="pageCount" :page-count='pageCount' :current-page="1"
            @size-change="sizeChange" @current-change="currentChange"></el-pagination>
        </div>
      </div>
    </main>

    <el-dialog title="查看表单" :visible.sync="seeDialogVisible" width="750px" :append-to-body='true'>

      <el-form label-width="100px" :rules="rules">
        <h3 style="padding: 0 15px;">{{formDetailInfo.name}}</h3>
        <el-divider></el-divider>

        <div class="form-right" v-for="(v,k) in formDetailInfo.fields" :key="k" style="padding: 15px;">
          <renders :ele='v.ele' :obj='v.obj' :prop='v.prop'></renders>
        </div>

        <div style="text-align: right; padding-right: 15px;">
          <el-form-item label="">
            <el-button type="primary">提交</el-button>
          </el-form-item>
        </div>


      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="seeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="seeDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
// import { notNullClone } from '@/utils'
import renders from './renders/renders'
export default {
  components: {
    renders
  },
  // props: [''],
  computed: {
  },
  data () {
    return {
      multipleSelection: [],
      rules: { // 表单检测规则
        mustFill: [
          { required: true, message: '此为必填项', trigger: 'change' }
        ]
      },
      form: {
        page: 1,
        limit: 10,
        name: '', // 表单名称
        mark: '', // 事项名称
        status: '' // 0启用1停用2作废3草稿
      },
      res: {
        status: [
          { label: '请选择表单状态', value: '' },
          { label: '启用', value: 0 },
          { label: '停用', value: 1 },
          { label: '作废', value: 2 },
          { label: '草稿', value: 3 }
        ],
        type: [
          { label: '请选择表单类型', value: '' },
          { label: '行政许可', value: 1 },
          { label: '行政处罚', value: 2 },
          { label: '行政强制', value: 3 },
          { label: '行政裁决', value: 4 },
          { label: '行政确认', value: 5 },
          { label: '行政给付', value: 6 },
          { label: '行政奖励', value: 7 },
          { label: '行政检查', value: 8 },
          { label: '其他行政权力', value: 9 },
          { label: '主动服务', value: 10 },
          { label: '依申请服务', value: 11 },
          { label: '咨询', value: 12 },
          { label: '未归类事项', value: 13 }
        ],
        hy: [
          { label: '请选择行业', value: '' },
          { label: '教育局', value: 1 },
          { label: '人事局', value: 2 }
        ]
      },
      labelWidth: '120px',
      pageCount: 0,
      tableData: [],
      seeDialogVisible: false, // 查看表单
      formDetailInfo: {} // 表单
    }
  },
  methods: {
    search () {
      this.$api.formList(this.form).then(res => {
        if (res.code === 0) {
          this.tableData = res.bean.list

          this.pageCount = res.bean.totalCount
        }
      })
    },

    click (type) {
      switch (type) {
        case 1:
          this.add()
          break
        case 2:
          this.dels()
          break
        case 3:
          this.void()
          break
      }
    },

    // 表格选取
    handleSelectionChange (val) { this.multipleSelection = val },
    // 分页
    currentChange (page) { // 翻页
      this.form.page = page
      this.search()
    },
    sizeChange (limit) { // 页大小
      this.form.limit = limit
      this.search()
    },

    // 重置
    resetForm () {
      this.form = {
        page: 1,
        limit: 10,
        name: '', // 表单名称
        mark: '', // 事项名称
        status: '' // 0启用1停用2作废3草稿
      }
    },

    // 添加
    add () {
      this.$router.push('/addForm')
    },
    // 批量删除
    dels () {
      if (this.multipleSelection.length === 0) return
      console.log(this.multipleSelection, '删除')
    },
    // 作废
    void () {
      if (this.multipleSelection.length === 0) return
      console.log(this.multipleSelection, '作废')
    },
    operation (row, type) {
      switch (type) {
        case 1: // 查看
          this.see(row)
          break
        case 2: // 复用
          // 带参数跳转add
          (async () => {
            await this.formDetail(row.id)
            this.$router.push({name: 'addForm', query: this.formDetailInfo})
          })()
          break
        case 3: // 作废
          break
        case 4: // 删除
          break
      }
    },
    // 查看
    see (row) {
      console.log(row, '查看')
      this.seeDialogVisible = true

      this.formDetail(row.id)
    },
    formDetail (id) {
      return new Promise((resolve, reject) => {
        this.$api.formDetail({id}).then(res => { // 获取表单详情
          if (res.code === 0) {
            console.log(res)
            this.formDetailInfo = res.bean
            resolve()
          }
        })
      })
    },

    // 复用
    use (row) {
      console.log(row, '复用')
      this.$router.push({name: 'addForm', query: row})
    }

  },
  beforeCreate () {},
  created () {
    this.search()
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
.ctn{
  &>header, &>main{
    border: 1px solid #ddd;
  }
  &>header{
    .title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 15px;
      & > .info{
        font-size: 17px;
      }
    }
    margin-bottom: 20px;
  }
  &>main{
    .title{
      padding: 20px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 15px;
      font-size: 17px;
    }
    .bom{
      padding: 20px;
      & > .btn{
        margin-bottom: 25px;
        & > .el-link{
          margin-right: 15px;
        }
      }
      & > .page{
        display: flex;
        justify-content: center;
        margin-top: 25px;
      }
    }
  }
}
</style>
