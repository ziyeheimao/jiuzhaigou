<template>
  <section class="ctn">
    <div class="link">
      <el-link @click='clickLink(1)' icon="el-icon-circle-plus-outline" type="primary">创建</el-link>
      <el-link @click='clickLink(2)' icon="el-icon-delete" type="primary">删除</el-link>
      <el-link @click='clickLink(3)' icon="el-icon-edit" type="primary">编辑</el-link>
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
        <table>
          <tr>
            <td>地区全称：{{tableData.fullName}}</td>
            <td>地区简称：{{tableData.name}}</td>
          </tr>
          <tr>
            <td>上级地区：{{tableData.parentName}}</td>
            <td>地区层级：{{tableData.gradeName}}</td>
          </tr>
          <tr>
            <td>行政区域代码：{{tableData.code}}</td>
            <td></td>
          </tr>
        </table>
      </div>
    </section>

    <el-dialog title="添加子地区" :visible.sync="addDialogVisible" width="650px" :append-to-body='true'>
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="地区全称" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入地区全称"></el-input>
        </el-form-item>

        <el-form-item label="地区简称" prop="name">
          <el-input v-model="form.name" placeholder="请输入地区简称"></el-input>
        </el-form-item>

        <el-form-item label="上级部门" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级部门" @change="parentIdChange">
            <el-option v-for="(v, k) in res.parent" :key="k" :label="v.name" :value="v.deptId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地区层级" prop="parentId">
          <el-select v-model="form.grade" placeholder="请选择地区层级">
            <el-option v-for="(v, k) in res.grade" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="行政区域代码" prop="parentId">
          <el-input v-model="form.code1" style='width: 60px;' :disabled="lvCount >= 3"></el-input> -
          <el-input v-model="form.code2" style='width: 60px;' :disabled="lvCount >= 3"></el-input> -
          <el-input v-model="form.code3" style='width: 60px;' :disabled="lvCount >= 3"></el-input> -
          <el-input v-model="form.code4" style='width: 60px;' :disabled="lvCount >= 4"></el-input> -
          <el-input v-model="form.code5" style='width: 60px;'></el-input>
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
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="地区全称" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入地区全称"></el-input>
        </el-form-item>

        <el-form-item label="地区简称" prop="name">
          <el-input v-model="form.name" placeholder="请输入地区简称"></el-input>
        </el-form-item>

        <el-form-item label="上级部门" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级部门" @change="parentIdChange">
            <el-option v-for="(v, k) in res.parent" :key="k" :label="v.name" :value="v.deptId"></el-option>
          </el-select>
        </el-form-item>
        <!-- <div>{{tableData.parentId}}</div> -->

        <el-form-item label="地区层级" prop="parentId">
          <el-select v-model="form.grade" placeholder="请选择地区层级">
            <el-option v-for="(v, k) in res.grade" :key="k" :label="v.dictItemName" :value="v.sortNo"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="行政区域代码" prop="parentId">
          <el-input v-model="form.code1" style='width: 60px;' :disabled="lvCount >= 3"></el-input> -
          <el-input v-model="form.code2" style='width: 60px;' :disabled="lvCount >= 3"></el-input> -
          <el-input v-model="form.code3" style='width: 60px;' :disabled="lvCount >= 3"></el-input> -
          <el-input v-model="form.code4" style='width: 60px;' :disabled="lvCount >= 4"></el-input> -
          <el-input v-model="form.code5" style='width: 60px;'></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="set('form')">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
// import api from '@api'
// import main from '@main'
import { getVlaue } from '@/utils'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {},
  data () {
    return {
      filterText: '',
      treeData: [],
      tableData: {},
      defaultProps: { children: 'children', label: 'label' },
      leaf: {}, // 当前选择的节点
      seeDialogVisible: false,
      addDialogVisible: false,
      delDialogVisible: false,
      setDialogVisible: false,
      form: {
        deptId: '', // 主键
        code: '', // string 行政单位编码
        fullName: '', // string 全称
        name: '', // string 简称
        parentId: '', // integer($int64) 上级部门ID，一级部门为0

        grade: '', // integer($int32) 地区级别
        gradeName: '', // string 地区级别名称

        code1: '',
        code2: '',
        code3: '',
        code4: '',
        code5: ''
      },
      lvCount: -1,
      res: {
        parent: [], // 上级部门
        grade: [] // 地区层级
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
        ],
        code: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 2, message: '长度为 2 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      // 字典
      this.$api.sysDictSelectItemsByDictType({dictType: 'regionOrigin'}).then(res => { // 所属地区
        if (res.code === 0) this.res.grade = res.bean
      })

      this.search()
    },
    search () {
      this.$api.sysAreaSelect().then(res => {
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
    handleNodeClick (data) { this.leaf = data },

    parentIdChange () {
      let arr = [] // 行政单位编码 两位一级
      let code = getVlaue(this.res.parent, this.form.parentId, 'deptId', 'code') // 代码字符串
      this.lvCount = Math.ceil(code.length / 2)
      for (let i = 0; i < this.lvCount; i++) {
        arr.push(code.slice(0, 2))
        code = code.slice(2)
      }

      for (let i = 1; i < arr.length + 1; i++) { // 将数据分别写入 5个input中
        this.form[`code${i}`] = arr[i - 1]
      }
    },

    clickLink (type) {
      switch (type) {
        case 1:
          this.addDialogVisible = true
          break
        case 2:
          if (!this.tableData.deptId) {
            this.$message({ message: '请选择要删除的部门', type: 'warning' })
            return
          }
          this.delDialogVisible = true
          break
        case 3:
          if (!this.tableData.deptId) {
            this.$message({ message: '请选择要修改的部门', type: 'warning' })
            return
          }
          this.form.deptId = this.tableData.deptId // 主键
          this.form.fullName = this.tableData.fullName // string全称
          this.form.name = this.tableData.name // string简称
          this.form.parentId = this.tableData.parentId // integer($int64) 上级部门ID，一级部门为0
          this.form.grade = this.tableData.grade // integer($int32)级别
          this.form.gradeName = this.tableData.gradeName // string 地区级别名称
          this.form.code = this.tableData.code // string 行政单位编码

          let code = this.form.code
          let arr = [] // 行政单位编码 两位一级

          this.lvCount = Math.ceil(this.form.code.length / 2)
          for (let i = 0; i < this.lvCount; i++) {
            arr.push(code.slice(0, 2))
            code = code.slice(2)
          }

          for (let i = 1; i < arr.length + 1; i++) { // 将数据分别写入 5个input中
            this.form[`code${i}`] = arr[i - 1]
          }

          this.setDialogVisible = true // 设置
          break
      }
    },
    add (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let req = {} // clone(this.form)
          req.fullName = this.form.fullName // string 全称
          req.name = this.form.name // string 简称
          req.parentId = this.form.parentId // integer($int64) 上级部门ID，一级部门为0
          req.grade = this.form.grade // integer($int32) 地区级别
          req.gradeName = getVlaue(this.res.grade, this.form.grade, 'sortNo', 'dictItemName') // string 地区级别名称
          req.code = `${this.form.code1}${this.form.code2}${this.form.code3}${this.form.code4}${this.form.code5}` // string 行政单位编码

          this.$api.sysAreaSave(req).then(res => {
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
      this.$api.sysAreaDelete(this.tableData.deptId).then(res => {
        if (res.code === 0) {
          this.$message({ message: res.msg, type: 'success' })
          this.search()
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
        this.delDialogVisible = false
      })
    },
    set (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.gradeName = getVlaue(this.res.grade, this.form.grade, 'sortNo', 'dictItemName') // string 地区级别名称

          this.$api.sysAreaUpdate(this.form).then(res => {
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
      this.$api.sysAreaInfo(this.leaf.deptId).then(res => {
        if (res.code === 0) {
          this.tableData = res.bean
        }
      })
    }
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
      // if (this.leaf.id && !this.leaf.children) {
      this.seeDialogVisible = true
      this.info()
      // } else {
        // this.seeDialogVisible = false
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


    table{
      border: 1px solid $bgc;
      border-collapse: collapse;
      width: 100%;
      tr>td{
        width: 50%;
        padding: 10px;
        border: 1px solid $bgc;
      }
    }
    .cards{
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
