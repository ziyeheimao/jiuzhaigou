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
        <el-form-item label="控件名称:" prop="">
          <el-input v-model="form.name" placeholder="请输
          入控件名称"></el-input>
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
          <el-link icon='el-icon-delete' @click="click(2)">删除</el-link>
        </div>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column prop="code" label="控件组编码"></el-table-column>
          <el-table-column prop="name" label="控件组名称"></el-table-column>
          <el-table-column prop="industry" label="控件组描述"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="see(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="use(scope.row)">复用</el-button>
              <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
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

    <!-- <el-dialog :title="dialogVisibleText" :visible.sync="dialogVisible" width="30%" :append-to-body='true'>
      <span>
        确定{{dialogVisibleText}}所选项?
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="shunt">确 定</el-button>
      </span>
    </el-dialog> -->

  </section>
</template>

<script>
// import { notNullClone } from '@/utils'

export default {
  components: {},
  // props: [''],
  computed: {
  },
  data () {
    return {
      multipleSelection: [],
      rules: {},
      form: {
        page: 1,
        limit: 10
      },
      res: {},
      labelWidth: '120px',
      pageCount: 0,
      tableData: [
        {id: 1, name: '表单1', code: 12345, industry: '描述信息'},
        {id: 2, name: '表单2', code: 12347, industry: '描述信息'}
      ]
    }
  },
  methods: {
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

    // 表格过滤
    tableFilter () {

    },
    resetForm () {},
    search () {},
    click (type) {
      switch (type) {
        case 1:
          this.add()
          break
        case 2:
          this.dels()
          break
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

    // 编辑
    edit (row) {
      console.log(row, '作废')
    },
    // 查看
    see (row) {
      console.log(row, '查看')
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
