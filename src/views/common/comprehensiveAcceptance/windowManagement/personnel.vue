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
        <el-form-item label="系统账户名:" prop="">
          <el-input v-model="form.userName" style="width: 260px;" placeholder="请输入系统账号"></el-input>
        </el-form-item>

        <el-form-item label="姓名:" prop="">
          <el-input v-model="form.naem" style="width: 260px;" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="所属窗口:" prop="">
          <el-select v-model="form.window" style="width: 260px;">
            <el-option label="请选择所属窗口" value=""></el-option>
            <el-option label="2楼综合窗口" value="1"></el-option>
            <el-option label="民生窗口" value="2"></el-option>
            <el-option label="教育窗口" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门:" prop="">
          <el-select v-model="form.bumen" style="width: 260px;">
            <el-option label="请选择所属窗口" value=""></el-option>
            <el-option label="2楼综合窗口" value="1"></el-option>
            <el-option label="民生窗口" value="2"></el-option>
            <el-option label="教育窗口" value="3"></el-option>
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
          <el-link icon="el-icon-circle-plus-outline" @click="linkClick(1)">新增</el-link>
        </div>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column prop="a" label="系统账户名" width=''></el-table-column>
          <el-table-column prop="b" label="姓名" width=''></el-table-column>
          <el-table-column prop="c" label="所属窗口" width=''></el-table-column>
          <el-table-column prop="d" label="所属部门" width=''></el-table-column>
          <el-table-column prop="e" label="手机号" width=''></el-table-column>
          <el-table-column prop="f" label="创建时间" width=''></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="operation(scope.row, 1)">编辑</el-button>
              <el-button type="text" size="small" @click="operation(scope.row, 2)">删除</el-button>
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
// import api from '@api'
// import main from '@main'
// import { clone } from '@/utils'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {

  },
  data () {
    return {
      labelWidth: '100px',
      pageCount: 0,
      form: {
        userName: '',
        naem: '',
        window: '',
        bumen: '',
        page: 1,
        limit: 10
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
        ]
      },

      tableData: [
        {a: '2楼综合窗口', b: '张三', c: '2楼综合窗口', d: '教育', e: '18888888888', f: '2020-2-10'},
        {a: '2楼综合窗口', b: '张三', c: '2楼综合窗口', d: '环境', e: '18888888888', f: '2020-2-10'},
        {a: '2楼综合窗口', b: '张三', c: '2楼综合窗口', d: '审批局', e: '18888888888', f: '2020-2-10'},
        {a: '2楼综合窗口', b: '张三', c: '2楼综合窗口', d: '教育', e: '18888888888', f: '2020-2-10'},
        {a: '2楼综合窗口', b: '张三', c: '2楼综合窗口', d: '旅游', e: '18888888888', f: '2020-2-10'},
        {a: '2楼综合窗口', b: '张三', c: '2楼综合窗口', d: '环境', e: '18888888888', f: '2020-2-10'},
        {a: '2楼综合窗口', b: '张三', c: '2楼综合窗口', d: '旅游', e: '18888888888', f: '2020-2-10'}
      ]
    }
  },
  methods: {
    // 重置
    resetForm () {
      this.form = {
        userName: '',
        naem: '',
        window: '',
        bumen: '',
        page: 1,
        limit: 10
      }
    },
    // 搜搜
    search () {
      // let req = clone(this.form)
      console.log(this.form)
      // this.$api.workPage(this.form).then(res => {
      //   console.log(res)
      // })
    },

    // 表格顶功能按钮
    linkClick (type) {
      switch (type) {
        case 1: // 新增
          // this.$router.push({name: 'newItem'})
          console.log('add')
          break
        case 2: // 删除
          break
        case 3: // 编辑
          break
        case 4: // 停用
          break
        case 5: // 启用
          break
        case 6: // 作废
          break
      }
    },
    // 表格选取
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 编辑
    operation (row, type) {
      switch (type) {
        case 1:
          console.log(row, type)
          break
        case 2:
          console.log(row, type)
          break
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
