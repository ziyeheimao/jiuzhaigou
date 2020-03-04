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

      <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth" class="listMattersAdminInput">
        <div class="box">
          <el-form-item label="部门:" prop="">
            <el-input v-model="form.code"></el-input>
          </el-form-item>

          <el-form-item label="月份:" prop="">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
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
        <!-- <div class="btn">
          <el-link icon='el-icon-circle-plus-outline' @click="click(0)">新增</el-link>
          <el-link icon='el-icon-delete' @click="click(1)">删除</el-link>
          <el-link icon='el-icon-close' @click="click(3)">停用</el-link>
          <el-link icon='el-icon-check' @click="click(4)">启用</el-link>
          <el-link icon='el-icon-document-delete' @click="click(5)">作废</el-link>
        </div> -->

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column prop="a" label="部门"></el-table-column>
          <el-table-column prop="b" label="月份"></el-table-column>
          <el-table-column prop="c" label="分数"></el-table-column>

          <!-- <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updata(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="updata(scope.row)">办理</el-button>
            </template>
          </el-table-column> -->
        </el-table>

        <div class="page">
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count='5'
          :total="pageCount" :page-count='pageCount' :current-page="1"
          @size-change="sizeChange" @current-change="currentChange"></el-pagination>
        </div>
      </div>
    </main>
  </section>
</template>

<script>
import { clone } from '@/utils'

export default {
  components: {},
  // props: [''],
  computed: {},
  data () {
    return {
      labelWidth: '100px',
      pageCount: 0,
      form: {
        department: '', // integer 所属部门
        editStatus: [], // array 事项状态 1-草稿 2-上报中 3-申请变更中 4-申请启用中 5-申请停用中 6-申请废止中 7-已启用 8-已停用 9-已废止
        industry: '', // string 所属行业
        name: '', // string 事项名称
        workCode: '', // string (query) 事项编码
        workType: '', // string (query)
        page: 1, // * integer 当前页序号 Available values : 1
        limit: 10 // * integer 每页查询行数 Available values : 10
      },
      rules: {

      },
      res: {
        type: [
          {label: '请选择事项类型', value: ''},
          {label: '行政许可', value: 0},
          {label: '行政处罚', value: 1},
          {label: '行政强制', value: 2},
          {label: '行政裁决', value: 3},
          {label: '行政确认', value: 4},
          {label: '行政给付', value: 5},
          {label: '行政奖励', value: 6},
          {label: '行政检查', value: 7},
          {label: '其他行政权力', value: 8},
          {label: '其他群众事项', value: 9}
        ],
        hangye: [
          {value: '', label: '请选择所属行业'},
          {value: 1, label: '经济'},
          {value: 2, label: '教育'},
          {value: 3, label: '科学'},
          {value: 4, label: '宗教'},
          {value: 5, label: '公安'},
          {value: 6, label: '民政'},
          {value: 7, label: '司法'},
          {value: 8, label: '财政'},
          {value: 9, label: '人事'},
          {value: 10, label: '国土'},
          {value: 11, label: '环境'},
          {value: 12, label: '交通'},
          {value: 13, label: '水利'},
          {value: 14, label: '农业'},
          {value: 15, label: '林业'},
          {value: 16, label: '商务'},
          {value: 17, label: '文化'},
          {value: 18, label: '卫生'},
          {value: 19, label: '审计'},
          {value: 20, label: '税务'},
          {value: 21, label: '工商'},
          {value: 22, label: '质检'},
          {value: 23, label: '药检'},
          {value: 24, label: '新闻'},
          {value: 25, label: '体育'},
          {value: 26, label: '统计'},
          {value: 27, label: '旅游'},
          {value: 28, label: '国防'},
          {value: 29, label: '档案'},
          {value: 30, label: '气象'},
          {value: 31, label: '通信'},
          {value: 32, label: '烟草'},
          {value: 33, label: '其他'}
        ],
        editStatus: ['草稿', '已停用', '已启用', '已废止', '上报中', '申请启用中', '申请停用中', '申请变更中', '申请废止中']
      },

      tableData: [
        {a: '九寨沟民政局', b: '12月', c: '100'},
        {a: '九寨沟民政局', b: '12月', c: '100'},
        {a: '九寨沟民政局', b: '12月', c: '100'},
        {a: '九寨沟民政局', b: '12月', c: '100'},
        {a: '九寨沟民政局', b: '12月', c: '100'},
        {a: '九寨沟民政局', b: '12月', c: '100'}
      ]
    }
  },
  methods: {
    // 功能按钮
    click (type) {
      switch (type) {
        case 0: // 新增
          this.$router.push({name: 'newItem'})
          break
        case 1: // 删除
          break
        case 2: // 编辑
          break
        case 3: // 停用
          break
        case 4: // 启用
          break
        case 5: // 作废
          break
      }
    },
    // 表格选取
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 编辑
    updata (row) {
      console.log(row)
    },

    // 搜搜
    search () {
      let req = clone(this.form)
      let arr = []
      for (let i of req.editStatus) {
        if (i === '草稿') arr.push(1)
        if (i === '已停用') arr.push(2)
        if (i === '已启用') arr.push(3)
        if (i === '已废止') arr.push(4)
        if (i === '上报中') arr.push(5)
        if (i === '申请启用中') arr.push(6)
        if (i === '申请停用中') arr.push(7)
        if (i === '申请变更中') arr.push(8)
        if (i === '申请废止中') arr.push(9)
      }
      req.editStatus = arr
      this.$api.workPage(req).then(res => {
        console.log(res)
      })
    },

    // 重置
    resetForm () {
      this.form = {
        department: '', // integer 所属部门
        editStatus: [], // array 事项状态 1-草稿 2-上报中 3-申请变更中 4-申请启用中 5-申请停用中 6-申请废止中 7-已启用 8-已停用 9-已废止
        industry: '', // string 所属行业
        name: '', // string 事项名称
        workCode: '', // string (query) 事项编码
        workType: '', // string (query)
        page: 1, // * integer 当前页序号 Available values : 1
        limit: 10 // * integer 每页查询行数 Available values : 10
      }
    },

    // 分页
    currentChange (page) { // 翻页
      this.form.page = page
      this.search()
    },
    sizeChange (limit) { // 页大小
      this.form.limit = limit
      this.search()
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

<style lang="scss">
.listMattersAdminInput{
  .box{
    .el-form-item{
      display: inline-block;
      width: 33%;
      .el-input{
        width: 260px;
      }
    }
  }
}
</style>
