<template>
  <section class="ctn">
    <div class="link">
      <el-link @click='clickLink(1)' icon="el-icon-circle-plus-outline" type="primary">创建</el-link>
      <el-link @click='clickLink(2)' icon="el-icon-delete" type="primary">删除</el-link>
      <el-link @click='clickLink(3)' icon="el-icon-edit" type="primary">编辑</el-link>
      <el-link @click='clickLink(4)' icon="el-icon-unlock" type="primary">配置权限</el-link>
    </div>

    <div class="saerch">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    </div>

    <el-tree class="filter-tree" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
      default-expand-all :filter-node-method="filterNode" ref="tree"></el-tree>

    <!-- 信息 -->
    <section class="info" v-show="seeDialogVisible">
      <div class="title">
        <h4>{{leaf.label}}</h4>
      </div>

      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="info">
            <table>
              <tr>
                <td>部门全称：{{tableData.fullName}}</td>
                <td>部门简称：{{tableData.name}}</td>
              </tr>
              <tr>
                <td>上级部门：{{tableData.parentName}}</td>
                <td>所属地区：{{tableData.areaName}}</td>
              </tr>
              <tr>
                <td>部门级别：{{tableData.gradeName}}</td>
                <td>部门类型：{{tableData.typeName}}</td>
              </tr>
              <tr>
                <td>部门行业：{{tableData.industryName}}</td>
                <td></td>
              </tr>
            </table>
          </el-tab-pane>
          <el-tab-pane label="部门系统用户" name="user">
            <div class="cards">
              <span v-for="(v,k) in 12" :key="k">张三四{{v}}</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>

    <el-dialog title="创建部门" :visible.sync="addDialogVisible" width="650px" :append-to-body='true'>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="部门全称" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入部门全称"></el-input>
        </el-form-item>

        <el-form-item label="部门简称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门简称"></el-input>
        </el-form-item>

        <el-form-item label="上级部门" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级部门">
            <el-option v-for="(v, k) in res.parent" :key="k" :label="v.name" :value="v.deptId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属地区" prop="parentId">
          <el-select v-model="form.areaId" placeholder="请选择所属地区">
            <el-option v-for="(v, k) in res.areaId" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门级别" prop="parentId">
          <el-select v-model="form.grade" placeholder="请选择部门级别">
            <el-option v-for="(v, k) in res.deptLv" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门类型" prop="parentId">
          <el-select v-model="form.typeId" placeholder="请选择部门类型">
            <el-option v-for="(v, k) in res.deptType" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门行业" prop="parentId">
          <el-select v-model="form.industryId" placeholder="请选择部门行业">
            <el-option v-for="(v, k) in res.deptIndustry" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add('form')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="确认删除" :visible.sync="delDialogVisible" width="650px" :append-to-body='true'>
      <span>是否确认删除 《{{tableData.fullName}}》 ？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="del">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑部门" :visible.sync="setDialogVisible" width="650px" :append-to-body='true'>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="部门全称" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入部门全称"></el-input>
        </el-form-item>

        <el-form-item label="部门简称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门简称"></el-input>
        </el-form-item>

        <el-form-item label="上级部门" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级部门">
            <el-option v-for="(v, k) in res.parent" :key="k" :label="v.name" :value="v.deptId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属地区" prop="parentId">
          <el-select v-model="form.areaId" placeholder="请选择所属地区">
            <el-option v-for="(v, k) in res.areaId" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门级别" prop="parentId">
          <el-select v-model="form.grade" placeholder="请选择部门级别">
            <el-option v-for="(v, k) in res.deptLv" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门类型" prop="parentId">
          <el-select v-model="form.typeId" placeholder="请选择部门类型">
            <el-option v-for="(v, k) in res.deptType" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门行业" prop="parentId">
          <el-select v-model="form.industryId" placeholder="请选择部门行业">
            <el-option v-for="(v, k) in res.deptIndustry" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="set('form')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="配置权限" :visible.sync="powerDialogVisible" width="950px" :append-to-body='true'>
      <div class="formBox">
        <h3>事项管理系统</h3>
        <el-form :model="powerForm" :rules="rules" ref="powerForm" label-width="110px">
          <el-form-item label="事项清单管理" prop="name">
            <el-radio-group v-model="powerForm.r">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr1">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="变更"></el-checkbox>
              <el-checkbox label="启用"></el-checkbox>
              <el-checkbox label="停用"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="事项审批管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="审批"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="工作流管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="表单管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="控件组管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <h3>事项管理系统</h3>

          <el-form-item label="事项清单管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="变更"></el-checkbox>
              <el-checkbox label="启用"></el-checkbox>
              <el-checkbox label="停用"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="事项审批管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="审批"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="工作流管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="表单管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="控件组管理" prop="name">
            <el-radio-group v-model="powerForm.r1">
              <el-radio :label="1">可见</el-radio>
              <el-radio :label="2">不可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox-group v-model="powerForm.arr2">
              <el-checkbox label="创建"></el-checkbox>
              <el-checkbox label="编辑"></el-checkbox>
              <el-checkbox label="查看"></el-checkbox>
              <el-checkbox label="废止"></el-checkbox>
              <el-checkbox label="删除"></el-checkbox>
              <el-checkbox label="复用"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>


      <span slot="footer" class="dialog-footer">
        <el-button @click="powerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="power">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
// import api from '@api'
// import main from '@main'
import { clone, getVlaue } from '@/utils'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {},
  data () {
    return {
      filterText: '',
      treeData: [], // 树
      tableData: {}, // 表格数据

      defaultProps: { children: 'children', label: 'label' },
      leaf: {}, // 当前选择的节点
      seeDialogVisible: false,
      activeName: 'info', // 默认选择项

      addDialogVisible: false,
      delDialogVisible: false,
      setDialogVisible: false,
      powerDialogVisible: false,
      form: { // 创建部门 & 修改部门
        fullName: '', // string全称
        name: '', // string简称
        parentId: '', // integer($int64) 上级部门ID，一级部门为0
        areaId: '', // integer($int32)所属地区id
        grade: '', // integer($int32)级别
        typeId: '', // integer($int32)部门类型id
        industryId: '' // integer($int32)行业id

        // areaName: '', // string所属地区名称
        // code: '', // string部门编码
        // gradeName: '', // string级别名称
        // industryName: '', // string行业名称
        // typeName: '' // string部门类型名称
      },
      rules: {
        fullName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        name: [
          { min: 2, max: 50, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      res: {
        parent: [], // 上级部门
        areaId: [], // 所属地区
        deptLv: [], // 部门级别
        deptType: [], // 部门类型
        deptIndustry: [] // 部门行业
      },
      powerForm: {
        arr1: [],
        arr2: [],
        arr3: [],
        arr4: [],
        arr5: [],
        arr6: []
      }
    }
  },
  methods: {
    init () {
      // 字典
      this.$api.sysDictSelectItemsByDictType({dictType: 'regionOrigin'}).then(res => { // 所属地区
        if (res.code === 0) this.res.areaId = res.bean
      })

      this.$api.sysDictSelectItemsByDictType({dictType: 'deptLv'}).then(res => { // 部门级别 deptLv
        if (res.code === 0) this.res.deptLv = res.bean
      })

      this.$api.sysDictSelectItemsByDictType({dictType: 'deptType'}).then(res => { // 部门类型 deptType
        if (res.code === 0) this.res.deptType = res.bean
      })

      this.$api.sysDictSelectItemsByDictType({dictType: 'deptIndustry'}).then(res => { // 部门行业 deptIndustry
        if (res.code === 0) this.res.deptIndustry = res.bean
      })

      this.search() // 树结构图
    },

    search () {
      this.$api.sysDeptSelect().then(res => {
        if (res.code === 0) {
          this.res.parent = JSON.parse(JSON.stringify(res.bean))
          let arr = []
          for (let i of res.bean) {
            i.children = []
            i.label = i.fullName
            if (i.parentId === 0) {
              arr.push(i)
            } else {
              this.dg(arr, i)
            }
          }
          arr = [...arr[0].children] // 去除 根数据
          this.treeData = arr
          console.log(this.res.parent, arr)
        }
      })
    },
    dg (arr, i) { // 树结构递归
      for (let j of arr) {
        if (j.deptId === i.parentId) {
          j.children.push(i)
          break
        } else {
          this.dg(j.children, i)
        }
      }
    },

    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    // 树状图点击
    handleNodeClick (data) {
      this.leaf = data
    },

    // tabs 点击
    handleClick (tab, event) {
      console.log(tab, event)
    },

    clickLink (type) {
      switch (type) {
        case 1: // 新增
          this.addDialogVisible = true
          break
        case 2: // 删除
          if (!this.tableData.deptId) {
            this.$message({ message: '请选择要删除的部门', type: 'warning' })
            return
          }
          this.delDialogVisible = true
          break
        case 3: // 修改
          if (!this.tableData.deptId) {
            this.$message({ message: '请选择要修改的部门', type: 'warning' })
            return
          }

          this.form.fullName = this.tableData.fullName // string全称
          this.form.name = this.tableData.name // string简称
          this.form.parentId = this.tableData.parentId // integer($int64) 上级部门ID，一级部门为0
          this.form.areaId = this.tableData.areaId // integer($int32)所属地区id
          this.form.grade = this.tableData.grade // integer($int32)级别
          this.form.typeId = this.tableData.typeId // integer($int32)部门类型id
          this.form.industryId = this.tableData.industryId // integer($int32)行业id

          this.setDialogVisible = true // 设置
          break
        case 4:
          this.powerDialogVisible = true // 权限
          break
      }
    },
    add (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let req = clone(this.form)

          req.areaName = getVlaue(this.res.areaId, req.areaId, 'sortNo', 'dictItemName')
          req.gradeName = getVlaue(this.res.deptLv, req.grade, 'sortNo', 'dictItemName')
          req.industryName = getVlaue(this.res.deptIndustry, req.industryId, 'sortNo', 'dictItemName')
          req.typeName = getVlaue(this.res.deptType, req.industryId, 'sortNo', 'dictItemName')

          this.$api.sysDeptSave(req).then(res => {
            if (res.code === 0) {
              this.$message({ message: res.msg, type: 'success' })
              this.search()
            }
          })
          this.addDialogVisible = false
        }
      })
    },

    del () {
      this.$api.sysDeptDelete(this.tableData.deptId).then(res => {
        if (res.code === 0) {
          this.$message({ message: res.msg, type: 'success' })
          this.search()
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
      this.delDialogVisible = false
    },
    set (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let req = clone(this.form)
          req.deptId = this.tableData.deptId

          req.areaName = getVlaue(this.res.areaId, req.areaId, 'sortNo', 'dictItemName')
          req.gradeName = getVlaue(this.res.deptLv, req.grade, 'sortNo', 'dictItemName')
          req.industryName = getVlaue(this.res.deptIndustry, req.industryId, 'sortNo', 'dictItemName')
          req.typeName = getVlaue(this.res.deptType, req.industryId, 'sortNo', 'dictItemName')

          this.$api.sysDeptUpdate(req).then(res => {
            if (res.code === 0) {
              this.$message({ message: res.msg, type: 'success' })
              this.search()
              this.info()
              this.setDialogVisible = false
            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })
        }
      })
    },
    info () {
      this.$api.sysDeptInfo(this.leaf.deptId).then(res => {
        if (res.code === 0) {
          this.tableData = res.bean
        }
      })
    },
    power () {}
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
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    leaf () {
      // if (this.leaf.children.length === 0) {
      this.seeDialogVisible = true
      this.info()
      // } else {
      //   this.seeDialogVisible = false
      // }
    }
  }

}
</script>

<style scoped lang='scss'>
$bgc: rgb(215,215,215);
.ctn{
  .saerch{
    margin: 15px 0;
  }
  .link{
    padding: 10px;
    .el-link{
      padding: 0 5px;
    }
  }

  .filter-tree{
    margin: 0px 20px;
  }

  .info{
    border: 1px solid $bgc;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    margin: 20px;
    &>div{
      padding: 20px;
      &>h4{
        margin: 0;
        padding: 0;
        font-size: 17px;
      }
    }
    &>.title{
      background-color: $bgc;
    }

    .el-tab-pane{
      &>table{
        border: 1px solid $bgc;
        border-collapse: collapse;
        width: 100%;
        tr>td{
          width: 50%;
          padding: 10px;
          border: 1px solid $bgc;
        }
      }
      &>.cards{
        &>span{
          display: inline-block;
          padding: 15px 30px;
          margin: 10px;
          background-color: #eee;
          width: 120px;
          text-align: center;
        }
      }
    }
  }
}
</style>

<style lang='scss'>
.formBox{
  max-height: 500px;
  overflow: hidden !important;
  overflow-y: scroll !important;
  // scrollbar-width: none !important; /* Firefox */
  // -ms-overflow-style: none !important;  /* IE 10+ */
  // &::-webkit-scrollbar { /* WebKit */
  //   width: 0 !important;
  //   height: 0 !important;
  // }
}
</style>
