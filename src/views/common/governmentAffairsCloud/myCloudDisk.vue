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
          <el-form-item label="文件名称:" prop="">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="文件编码:" prop="">
            <el-input v-model="form.code"></el-input>
          </el-form-item>

          <el-form-item label="文件类型:" prop="">
            <el-select v-model="form.type">
              <el-option v-for="(v,k) in res.type" :key="k" :label="v.label" :value="v.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
<!--
        <div class="box">
          <el-form-item label="所属行业:" prop="">
            <el-select v-model="form.hangye">
              <el-option v-for="(v,k) in res.hangye" :key="k" :label="v.label" :value="v.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属部门:" prop="">
            <el-select v-model="form.hangye">
              <el-option v-for="(v,k) in res.hangye" :key="k" :label="v.label" :value="v.value"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="box2">
          <el-form-item label="事项状态:" prop="">
            <el-checkbox-group v-model="form.editStatus">
              <el-checkbox v-for="(v,k) in res.editStatus" :key="k" :label="v"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div> -->
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
        </div>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column prop="a" label="文件编码"></el-table-column>
          <el-table-column prop="b" label="文件名称"></el-table-column>
          <el-table-column prop="c" label="文件类型"></el-table-column>
          <el-table-column prop="d" label="上传时间"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updata(scope.row)">下载</el-button>
              <el-button type="text" size="small" @click="updata(scope.row)">分享</el-button>

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
          {label: '请选择', value: ''},
          {label: '文件', value: 0},
          {label: '文件夹', value: 1}
        ]
      },

      tableData: [
        {a: '412356', b: '我的文件1', c: '文件', d: '2019-12-12 17:54:26'},
        {a: '412365', b: '我的文件2', c: '文件夹', d: '2019-12-24 17:54:26'},
        {a: '413461', b: '我的文件3', c: '文件', d: '2019-01-02 17:54:26'},
        {a: '413566', b: '我的文件4', c: '文件夹', d: '2019-01-03 17:54:26'},
        {a: '413567', b: '我的文件5', c: '文件夹', d: '2019-01-04 17:54:26'},
        {a: '413569', b: '我的文件6', c: '文件', d: '2019-01-04 17:54:26'}
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
