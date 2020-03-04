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
          <el-button @click="reset">重置</el-button>
        </div>
      </div>

      <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth" :inline='true'>
        <el-form-item label="事项名称:" prop="">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="事项编码:" prop="">
          <el-input v-model="form.workCode"></el-input>
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
            <el-option v-for="(v,k) in res.department" :key="k" :label="v.label" :value="v.value"></el-option>
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

      <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全 部" name="-1"></el-tab-pane>
        <el-tab-pane label="未通过" name="0"></el-tab-pane>
        <el-tab-pane label="通 过" name="1"></el-tab-pane>
        <el-tab-pane label="审核中" name="2"></el-tab-pane>
      </el-tabs>

      <div class="bom">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column prop="workCode" label="事项编码"></el-table-column>
          <el-table-column prop="name" label="事项名称"></el-table-column>

          <el-table-column :formatter='tableFilter' prop="editStatus" label="事项状态"></el-table-column>
          <el-table-column :formatter='tableFilter' prop="department" label="所属部门"></el-table-column>
          <el-table-column :formatter='tableFilter' prop="industry" label="所属行业"></el-table-column>
          <el-table-column :formatter='tableFilter' prop="workType" label="事项类型"></el-table-column>
          <el-table-column :formatter='tableFilter' label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="tableClick(0, scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="tableClick(1, scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="tableClick(2, scope.row)" :disabled="scope.row.auditStatus !== 2">通过</el-button>
              <el-button type="text" size="small" @click="tableClick(3, scope.row)" :disabled="scope.row.auditStatus !== 2">不通过</el-button>
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
  </section>
</template>

<script>
import { notNullClone } from '@/utils'

export default {
  components: {},
  // props: [''],
  computed: {},
  data () {
    return {
      activeName: '-1',
      labelWidth: '150px',
      tableSelect: [], // 表格多选
      pageCount: 0,
      form: {
        auditStatus: '', // 审核状态 0-未通过 1-通过 2-审核中
        department: '', // 部门
        editStatus: ['上报', '申请启用', '申请停用', '申请变更', '申请废止'], // 事项状态
        industry: '', // 所属行业
        limit: 10,
        name: '', // 事项名称
        page: 1,
        workCode: '', // 事项编码
        workType: '' // 事项类型
      },
      rules: {},
      res: {
        editStatus: ['上报', '申请启用', '申请停用', '申请变更', '申请废止'], // 事项状态
        department: [ // 所属部门
          {value: '', label: '请选择所属部门'},
          {value: 1, label: '经济'},
          {value: 2, label: '教育'},
          {value: 3, label: '科学'},
          {value: 4, label: '宗教'},
          {value: 5, label: '民政'},
          {value: 6, label: '司法'},
          {value: 7, label: '财政'},
          {value: 8, label: '人事'},
          {value: 9, label: '国土'},
          {value: 10, label: '环境'},
          {value: 11, label: '交通'},
          {value: 12, label: '水利'},
          {value: 13, label: '农业'},
          {value: 14, label: '林业'},
          {value: 15, label: '商务'},
          {value: 16, label: '文化'},
          {value: 17, label: '卫生'},
          {value: 18, label: '审计'},
          {value: 19, label: '税务'},
          {value: 20, label: '工商'},
          {value: 21, label: '质监'},
          {value: 22, label: '药监'},
          {value: 23, label: '新闻'},
          {value: 24, label: '体育'},
          {value: 25, label: '统计'},
          {value: 26, label: '旅游'},
          {value: 27, label: '国防'},
          {value: 28, label: '档案'},
          {value: 29, label: '气象'},
          {value: 30, label: '通信'},
          {value: 31, label: '烟草'},
          {value: 32, label: '其他'}
        ],
        industry: [ // 行业
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
        workType: [ // 事项类型
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
        auditStatus: [
          {value: '', label: '全部'},
          {value: 0, label: '未通过'},
          {value: 1, label: '通过'},
          {value: 2, label: '审核中'}
        ]
      },
      tableData: []
    }
  },
  methods: {
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
    handleClick (tab, event) {
      let i = Number(tab.name)
      if (i === -1) {
        this.form.auditStatus = ''
      } else {
        this.form.auditStatus = i
      }
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
      this.tableSelect = val
    },

    // 表格按钮点击
    tableClick (type, row) {
      switch (type) {
        case 0: // 查看
          window.sessionStorage.setItem('seeAuditId', row.id)
          this.$router.push({name: 'auditDetails', query: row})
          break
        case 1: // 编辑
          this.updata(row)
          break
        case 2: // 通过
          this.adopt(row)
          break
        case 3: // 不通过
          this.notPass(row)
          break
      }
    },
    // 编辑
    updata (row) {
      let req = { auditId: row.id }
      this.$api.workGetById(row.workId, req).then(res => {
        if (res.code === 0) {
          let updataWork = {
            work: res.bean,
            workId: res.bean.id
          }
          window.sessionStorage.setItem('updataWork', JSON.stringify(updataWork))
          window.sessionStorage.setItem('auditId', row.id)
          this.$router.push({name: 'updataItem'})
        }
      })
    },
    // 通过
    adopt (row) {
      this.$confirm('确定审核通过吗？', '确认操作', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.approval(1, row.id)
      }).catch(() => {
        this.$message({ type: 'info', message: '提交失败' })
      })
    },
    // 不通过
    notPass (row) {
      this.$confirm('确定审核不通过吗？', '确认操作', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.approval(0, row.id)
      }).catch(() => {
        this.$message({ type: 'info', message: '提交失败' })
      })
    },
    // 审批
    approval (auditStatus, id) {
      let req = {
        auditAdvice: '', // 审批意见
        auditStatus, // 审批状态 0-未通过 1-通过 2-审核中
        id
      }
      this.$api.workAuditAuditPost(req).then(res => {
        if (res.code === 0) {
          this.search()
          this.$message({ type: 'success', message: '提交成功' })
        }
      })
    },

    search () {
      let req = notNullClone(this.form)
      req.editStatus = JSON.parse(JSON.stringify(req.editStatus))
      if (req.editStatus.length === 0) delete req.editStatus
      else {
        for (let i = 0; i < req.editStatus.length; i++) {
          if (req.editStatus[i] === '上报') req.editStatus[i] = 1
          if (req.editStatus[i] === '申请启用') req.editStatus[i] = 4
          if (req.editStatus[i] === '申请停用') req.editStatus[i] = 5
          if (req.editStatus[i] === '申请变更') req.editStatus[i] = 3
          if (req.editStatus[i] === '申请废止') req.editStatus[i] = 9
        }
        req.editStatus = req.editStatus.toString()
      }

      this.$api.workAuditPage(req).then(res => {
        if (res.code === 0) {
          this.pageCount = res.bean.totalCount
          this.tableData = res.bean.list
        }
      })
    },

    // 重置
    reset () {
      this.form.auditStatus = [] // 审核状态 0-未通过 1-通过 2-审核中
      this.form.department = '' // 部门
      this.form.editStatus = [] // 事项状态
      this.form.industry = '' // 所属行业
      this.form.limit = 10
      this.form.name = '' // 事项名称
      this.form.page = 1
      this.form.workCode = '' // 事项编码
      this.form.workType = '' // 事项类型
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
    .tabs{
      margin: 0 20px;
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
