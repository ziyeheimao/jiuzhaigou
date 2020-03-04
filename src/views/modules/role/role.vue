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

      <el-form :model="form" :rules="rules" ref="form" label-width="90px" :inline='true'>
        <el-form-item label="角色名称:" prop="">
          <el-input style='width: 280px;' v-model="form.roleName" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="地区层级:" prop="">
          <el-select style='width: 280px;' v-model="form.regionLv" placeholder="请选择地区层级" clearable>
            <el-option v-for="(v,k) in res.regionLv" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
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
          <el-link icon='el-icon-circle-plus-outline' @click="clickLink(0)">新增</el-link>
          <el-link icon='el-icon-delete' @click="clickLink(1)">删除</el-link>
        </div>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="regionLv" label="地区层级"></el-table-column><!-- :formatter='tableFilter' -->
          <el-table-column prop="time" label="创建时间"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updata(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="power(scope.row)">权限配置</el-button>
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

    <!-- 新增 & 修改 -->
    <el-dialog :title="dialogText.text[dialogText.index]" :visible.sync="dialogVisible" width="650px" :append-to-body='true'>
      <el-form :model="addUpdataForm" :rules="rules" ref="addUpdataForm" label-width="90px" :inline='true'>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input style='width: 280px;' v-model="addUpdataForm.roleName" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="地区层级:" prop="regionLv">
          <el-select style='width: 280px;' v-model="addUpdataForm.regionLv" placeholder="请选择地区层级" clearable>
            <el-option v-for="(v,k) in res.regionLv" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUpdata('addUpdataForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量删除 -->
    <el-dialog title="删除角色" :visible.sync="delDialogVisible" width="650px" :append-to-body='true'>
      <span>确定删除所选角色?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dels">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 权限配置 -->
    <el-dialog title="配置权限" :visible.sync="powerDialogVisible" width="850px" :append-to-body='true'>
      <div class="box" style="max-height: 600px; overflow: hidden !important; overflow-y: scroll !important;">
        <el-form :model="powerForm" :rules="powerFormRules" ref="powerForm" label-width="100px" class="power-form" :inline='true'>
          <h3>事项管理系统</h3>
          <el-form-item label="事项清单管理:" prop="">
            <el-radio-group v-model="powerForm.a">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.b">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="变更"></el-checkbox>
              <el-checkbox label="启用"></el-checkbox>
              <el-checkbox label="停用"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="事项审批管理:" prop="">
            <el-radio-group v-model="powerForm.c">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.d">
              <el-checkbox label="审批"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="工作流管理:" prop="">
            <el-radio-group v-model="powerForm.e">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.f">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="表单管理:" prop="">
            <el-radio-group v-model="powerForm.g">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.h">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="控件组管理:" prop="">
            <el-radio-group v-model="powerForm.i">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.j">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </div>

          <h3>事项管理系统</h3>
          <el-form-item label="事项清单管理:" prop="">
            <el-radio-group v-model="powerForm.k">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.l">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="变更"></el-checkbox>
              <el-checkbox label="启用"></el-checkbox>
              <el-checkbox label="停用"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="事项审批管理:" prop="">
            <el-radio-group v-model="powerForm.m">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.n">
              <el-checkbox label="审批"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="工作流管理:" prop="">
            <el-radio-group v-model="powerForm.o">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.p">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="表单管理:" prop="">
            <el-radio-group v-model="powerForm.q">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.r">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="控件组管理:" prop="">
            <el-radio-group v-model="powerForm.s">
              <el-radio label="1">可见</el-radio>
              <el-radio label="0">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="checkbox">
            <el-checkbox-group v-model="powerForm.t">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form>
      </div>


      <span slot="footer" class="dialog-footer">
        <el-button @click="powerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="upDataPower">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { openInfo, getVlaue } from '@/utils'

export default {
  components: {},
  // props: [''],
  computed: {},
  data () {
    return {
      pageCount: 0,
      form: {
        roleName: '',
        regionLv: '',
        page: 1,
        limit: 10
      },
      addUpdataForm: {
        roleName: '',
        regionLv: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        regionLv: [
          { required: true, message: '请选择地区层级', trigger: 'change' }
        ]
      },
      res: {
        regionLv: [] // 地区层级
      },

      tableData: [
        {roleName: '角色名称', regionLv: '区县级', time: '2020-03-03'},
        {roleName: '角色名称', regionLv: '乡镇级', time: '2020-03-03'}
      ],
      // 批量状态处理
      multipleSelection: [], // 表格选中
      dialogVisible: false,
      delDialogVisible: false,
      powerDialogVisible: false,
      dialogText: {
        text: ['新增角色', '修改角色'],
        index: -1
      },
      row: {},
      powerForm: { // 权限表单
        a: '',
        b: [],
        c: '',
        d: [],
        e: '',
        f: [],
        g: '',
        h: [],
        i: '',
        j: [],
        k: '',
        l: [],
        m: '',
        n: [],
        o: '',
        p: [],
        q: '',
        r: [],
        s: '',
        t: []
      },
      powerFormRules: {}
    }
  },
  methods: {
    // 重置
    resetForm () {
      this.form = {
        roleName: '',
        regionLv: '',
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
    // 表格选取
    handleSelectionChange (val) { this.multipleSelection = val },
    init () {
      this.$api.sysDictSelectItemsByDictType({dictType: 'regionOrigin'}).then(res => {
        if (res.code === 0) {
          this.res.regionLv = res.bean
          console.log(this.res.regionLv)
        }
      })
    },
    search () {
      // this.$api.workPage().then(res => {
      //   if (res.code === 0) {
      //     this.tableData = res.bean.list
      //     this.pageCount = res.bean.totalCount
      //   }
      // })
    },
    // 表格过滤
    tableFilter (row, col, cellValue, index) {
      if (col.property === 'editStatus') {
        if (cellValue === 1 || cellValue === '1') return '草稿'
        if (cellValue === 2 || cellValue === '2') return '已停用'
        if (cellValue === 3 || cellValue === '3') return '已启用'
        if (cellValue === 4 || cellValue === '4') return '已废止'
        if (cellValue === 5 || cellValue === '5') return '上报中'
        return cellValue
      }

      if (col.property === 'department') {
        if (cellValue === 1 || cellValue === '1') return '经济'
        if (cellValue === 2 || cellValue === '2') return '教育'
        return cellValue
      }

      if (col.property === 'regionLv') {
        if (cellValue === 1 || cellValue === '1') return '经济'
        if (cellValue === 2 || cellValue === '2') return '教育'
        return cellValue
      }

      if (col.property === 'workType') {
        if (cellValue === 1 || cellValue === '1') return '行政许可'
        if (cellValue === 2 || cellValue === '2') return '行政处罚'
        if (cellValue === 3 || cellValue === '3') return '行政强制'
        return cellValue
      }
    },
    // 功能按钮
    clickLink (type) {
      switch (type) {
        case 0: // 打开新增
          this.dialogText.index = 0
          this.dialogVisible = true
          break
        case 1: // 批量删除
          if (this.multipleSelection.length === 0) {
            openInfo('未选择角色', 'w')
            return
          }
          this.delDialogVisible = true
          break
      }
    },
    // 打开编辑
    updata (row) {
      console.log(row)
      this.addUpdataForm.roleName = row.roleName
      this.addUpdataForm.regionLv = getVlaue(this.res.regionLv, row.regionLv, 'dictItemName', 'sortNo')

      this.dialogText.index = 1
      this.dialogVisible = true
    },
    addUpdata (formName) { // 新增 & 更新
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          if (this.dialogText.index === 0) { // 新增接口

          } else if (this.dialogText.index === 1) { // 编辑接口

          }
        }
      })
    },
    dels () {
      console.log('批量删除', this.multipleSelection)
      this.delDialogVisible = false
    },

    power (row) { // 打开权限窗口
      this.row = row
      this.powerDialogVisible = true

      // 查
      console.log(this.row)
      // 回显
    },

    // 权限
    upDataPower () {
      this.powerDialogVisible = false
      console.log('提交')
      // 将修改的数据提交
      // 隐层窗口 提示用户
    }
  },
  beforeCreate () {},
  created () {
    this.init()
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
.power-form{
  .checkbox{
    padding: 0 30px;
    margin-bottom: 30px;
  }
}
</style>
