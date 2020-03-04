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

      <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth" class="listMattersAdminInput" :inline='true'>
        <el-form-item label="事项名称:" prop="">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="事项编码:" prop="">
          <el-input v-model="form.code"></el-input>
        </el-form-item>

        <el-form-item label="事项类型:" prop="">
          <el-select v-model="form.workType">
            <el-option v-for="(v,k) in res.workType" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属行业:" prop="">
          <el-select v-model="form.industry">
            <el-option v-for="(v,k) in res.industry" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门:" prop="">
          <el-select v-model="form.department">
            <el-option v-for="(v,k) in res.industry" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="事项状态:" prop="">
          <el-checkbox-group v-model="form.editStatus">
            <el-checkbox v-for="(v,k) in res.editStatus" :key="k" :label="v"></el-checkbox>
          </el-checkbox-group>
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
          <el-link icon='el-icon-circle-plus-outline' @click="click(0)">新增</el-link>
          <el-link icon='el-icon-delete' @click="click(1)">删除</el-link>
          <el-link icon='el-icon-close' @click="click(2)">停用</el-link>
          <el-link icon='el-icon-check' @click="click(3)">启用</el-link>
          <el-link icon='el-icon-document-delete' @click="click(4)">作废</el-link>
        </div>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column prop="workCode" label="事项编码"></el-table-column>
          <el-table-column prop="name" label="事项名称"></el-table-column>

          <el-table-column :formatter='tableFilter' prop="editStatus" label="事项状态"></el-table-column>
          <el-table-column :formatter='tableFilter' prop="department" label="所属部门"></el-table-column>
          <el-table-column :formatter='tableFilter' prop="industry" label="所属行业"></el-table-column>
          <el-table-column :formatter='tableFilter' prop="workType" label="事项类型"></el-table-column>
          <el-table-column prop="createTime" label="录入时间"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" :disabled="!(scope.row.editStatus === 1 || scope.row.editStatus === 3)" @click="updata(scope.row)">编辑</el-button>
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

    <!-- 批量处理 -->
    <el-dialog :title="dialogVisibleText" :visible.sync="dialogVisible" width="30%" :append-to-body='true'>
      <span>
        确定{{dialogVisibleText}}所选项?
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="shunt">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { notNullClone, openInfo } from '@/utils'

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
        editStatus: ['草稿', '已停用', '已启用', '已废止', '上报中', '申请启用中', '申请停用中', '申请变更中', '申请废止中'], // array 事项状态 1-草稿 2-上报中 3-申请变更中 4-申请启用中 5-申请停用中 6-申请废止中 7-已启用 8-已停用 9-已废止
        industry: '', // string 所属行业
        name: '', // string 事项名称
        workCode: '', // string (query) 事项编码
        workType: '', // string (query) 事项类型
        page: 1, // * integer 当前页序号 Available values : 1
        limit: 10 // * integer 每页查询行数 Available values : 10
      },
      rules: {},
      res: {
        workType: [
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
        industry: [
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

      tableData: [],
      // 批量状态处理
      multipleSelection: [], // 表格选中
      dialogVisible: false,
      dialogVisibleText: ''
    }
  },
  methods: {
    // 重置
    resetForm () {
      this.form = {
        department: '', // integer 所属部门
        editStatus: ['草稿', '已停用', '已启用', '已废止', '上报中', '申请启用中', '申请停用中', '申请变更中', '申请废止中'], // array 事项状态 1-草稿 2-上报中 3-申请变更中 4-申请启用中 5-申请停用中 6-申请废止中 7-已启用 8-已停用 9-已废止
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
    },

    // 表格过滤
    tableFilter (row, col, cellValue, index) {
      if (col.property === 'editStatus') {
        if (cellValue === 1 || cellValue === '1') return '草稿'
        if (cellValue === 2 || cellValue === '2') return '已停用'
        if (cellValue === 3 || cellValue === '3') return '已启用'
        if (cellValue === 4 || cellValue === '4') return '已废止'
        if (cellValue === 5 || cellValue === '5') return '上报中'
        if (cellValue === 6 || cellValue === '6') return '申请启用中'
        if (cellValue === 7 || cellValue === '7') return '申请停用中'
        if (cellValue === 8 || cellValue === '8') return '申请变更中'
        if (cellValue === 9 || cellValue === '9') return '申请废止中'
        return cellValue
      }

      if (col.property === 'department') {
        if (cellValue === 1 || cellValue === '1') return '经济'
        if (cellValue === 2 || cellValue === '2') return '教育'
        if (cellValue === 3 || cellValue === '3') return '科学'
        if (cellValue === 4 || cellValue === '4') return '宗教'
        if (cellValue === 5 || cellValue === '5') return '公安'
        if (cellValue === 6 || cellValue === '6') return '民政'
        if (cellValue === 7 || cellValue === '7') return '司法'
        if (cellValue === 8 || cellValue === '8') return '财政'
        if (cellValue === 9 || cellValue === '9') return '人事'
        if (cellValue === 10 || cellValue === '10') return '国土'
        if (cellValue === 11 || cellValue === '11') return '环境'
        if (cellValue === 12 || cellValue === '12') return '交通'
        if (cellValue === 13 || cellValue === '13') return '水利'
        if (cellValue === 14 || cellValue === '14') return '农业'
        if (cellValue === 15 || cellValue === '15') return '林业'
        if (cellValue === 16 || cellValue === '16') return '商务'
        if (cellValue === 17 || cellValue === '17') return '文化'
        if (cellValue === 18 || cellValue === '18') return '卫生'
        if (cellValue === 19 || cellValue === '19') return '审计'
        if (cellValue === 20 || cellValue === '20') return '税务'
        if (cellValue === 21 || cellValue === '21') return '工商'
        if (cellValue === 22 || cellValue === '22') return '质检'
        if (cellValue === 23 || cellValue === '23') return '药检'
        if (cellValue === 24 || cellValue === '24') return '新闻'
        if (cellValue === 25 || cellValue === '25') return '体育'
        if (cellValue === 26 || cellValue === '26') return '统计'
        if (cellValue === 27 || cellValue === '27') return '旅游'
        if (cellValue === 28 || cellValue === '28') return '国防'
        if (cellValue === 29 || cellValue === '29') return '档案'
        if (cellValue === 30 || cellValue === '30') return '气象'
        if (cellValue === 31 || cellValue === '31') return '通信'
        if (cellValue === 32 || cellValue === '32') return '烟草'
        if (cellValue === 33 || cellValue === '33') return '其他'
        return cellValue
      }

      if (col.property === 'industry') {
        if (cellValue === 1 || cellValue === '1') return '经济'
        if (cellValue === 2 || cellValue === '2') return '教育'
        if (cellValue === 3 || cellValue === '3') return '科学'
        if (cellValue === 4 || cellValue === '4') return '宗教'
        if (cellValue === 5 || cellValue === '5') return '公安'
        if (cellValue === 6 || cellValue === '6') return '民政'
        if (cellValue === 7 || cellValue === '7') return '司法'
        if (cellValue === 8 || cellValue === '8') return '财政'
        if (cellValue === 9 || cellValue === '9') return '人事'
        if (cellValue === 10 || cellValue === '10') return '国土'
        if (cellValue === 11 || cellValue === '11') return '环境'
        if (cellValue === 12 || cellValue === '12') return '交通'
        if (cellValue === 13 || cellValue === '13') return '水利'
        if (cellValue === 14 || cellValue === '14') return '农业'
        if (cellValue === 15 || cellValue === '15') return '林业'
        if (cellValue === 16 || cellValue === '16') return '商务'
        if (cellValue === 17 || cellValue === '17') return '文化'
        if (cellValue === 18 || cellValue === '18') return '卫生'
        if (cellValue === 19 || cellValue === '19') return '审计'
        if (cellValue === 20 || cellValue === '20') return '税务'
        if (cellValue === 21 || cellValue === '21') return '工商'
        if (cellValue === 22 || cellValue === '22') return '质检'
        if (cellValue === 23 || cellValue === '23') return '药检'
        if (cellValue === 24 || cellValue === '24') return '新闻'
        if (cellValue === 25 || cellValue === '25') return '体育'
        if (cellValue === 26 || cellValue === '26') return '统计'
        if (cellValue === 27 || cellValue === '27') return '旅游'
        if (cellValue === 28 || cellValue === '28') return '国防'
        if (cellValue === 29 || cellValue === '29') return '档案'
        if (cellValue === 30 || cellValue === '30') return '气象'
        if (cellValue === 31 || cellValue === '31') return '通信'
        if (cellValue === 32 || cellValue === '32') return '烟草'
        if (cellValue === 33 || cellValue === '33') return '其他'
        return cellValue
      }

      if (col.property === 'workType') {
        if (cellValue === 1 || cellValue === '1') return '行政许可'
        if (cellValue === 2 || cellValue === '2') return '行政处罚'
        if (cellValue === 3 || cellValue === '3') return '行政强制'
        if (cellValue === 4 || cellValue === '4') return '行政裁决'
        if (cellValue === 5 || cellValue === '5') return '行政确认'
        if (cellValue === 6 || cellValue === '6') return '行政给付'
        if (cellValue === 7 || cellValue === '7') return '行政奖励'
        if (cellValue === 8 || cellValue === '8') return '行政检查'
        if (cellValue === 9 || cellValue === '9') return '其他行政权力'
        if (cellValue === 10 || cellValue === '10') return '其他群众事项'
        return cellValue
      }
    },
    // 功能按钮
    click (type) {
      if (this.multipleSelection.length === 0 && type !== 0) return
      this.dialogVisible = true
      switch (type) {
        case 0: // 新增
          this.$router.push({name: 'newItem'})
          break
        case 1: // 批量删除
          this.dialogVisibleText = '删除'
          break
        case 2: // 批量停用
          this.dialogVisibleText = '停用'
          break
        case 3: // 批量启用
          this.dialogVisibleText = '启用'
          break
        case 4: // 批量作废
          this.dialogVisibleText = '作废'
          break
      }
    },
    shunt () {
      this.dialogVisible = false
      switch (this.dialogVisibleText) {
        case '删除': // 批量删除
          this.dels()
          break
        case '停用': // 批量停用
          this.handle(5)
          break
        case '启用': // 批量启用
          this.handle(4)
          break
        case '作废': // 批量作废
          this.handle(6)
          break
      }
    },
    // 表格选取
    handleSelectionChange (val) { this.multipleSelection = val },
    search () {
      let req = notNullClone(this.form)
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
      req.editStatus = arr.toString()
      this.$api.workPage(req).then(res => {
        if (res.code === 0) {
          this.tableData = res.bean.list
          this.pageCount = res.bean.totalCount
        }
      })
    },
    // 编辑
    updata (row) {
      window.sessionStorage.removeItem('auditId')
      this.$api.workGetById(row.id).then(res => {
        if (res.code === 0) {
          let updataWork = {
            work: res.bean,
            workId: res.bean.id
          }
          window.sessionStorage.setItem('updataWork', JSON.stringify(updataWork))
          this.$router.push({name: 'updataItem'})
        }
      })
    },

    // 批量删除
    dels () {
      for (let i of this.multipleSelection) {
        this.$api.workDeleById(i.id).then(res => {
          this.search()
        })
      }
    },

    // 批处理
    handle (type) {
      let req = {
        status: type,
        workIds: this.getIds(this.multipleSelection)
      }
      this.$api.workUpdateStatus(req).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.search()
          openInfo(`${this.dialogVisibleText}成功`, 's')
        } else {
          openInfo(`${this.dialogVisibleText}失败`, 'w')
        }
      })
    },
    getIds (arr) {
      let newArr = []
      for (let i of arr) { newArr.push(i.id) }
      return newArr
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
