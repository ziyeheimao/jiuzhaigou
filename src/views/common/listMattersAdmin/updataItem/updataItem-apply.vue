<template>
  <section class="ctn">
    <div class="btnTop">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click="applicationMaterialsTableAdd">新增</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="delsDialogVisible = true">删除</el-button>
      </el-button-group>
    </div>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column width="55" type="selection"></el-table-column>
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="申请材料名称"></el-table-column>
      <el-table-column prop="attribute" label="材料属性"></el-table-column>
      <el-table-column prop="isWebsiteFill" label="门户网站填写"></el-table-column>
      <el-table-column prop="isNecessary" label="是否必交"></el-table-column>
      <el-table-column prop="paperNum" label="纸质材料数量"></el-table-column>
      <el-table-column prop="paperSpecification" label="纸质材料规格"></el-table-column>
      <el-table-column prop="electronicSpecification" label="电子材料规格"></el-table-column>

      <el-table-column prop="modelUrl" label="材料范本">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="download(scope.row.modelUrl)" width="80">下载</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="formKey" label="表单关联状态"></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="tableEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="relationSearch(scope.row, scope.$index)">关联表单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count='5'
        :total="pageCount" :page-count='pageCount' :current-page="1"
        @size-change="sizeChange" @current-change="currentChange"></el-pagination>
    </div>

    <!-- 新增 -->
    <el-dialog title="新建材料明细" :visible.sync="dialogVisibleAdd" width="1000px" :append-to-body='true'>
      <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth">

        <el-form-item label="申请材料名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <div class="box">
          <el-form-item label="材料属性" prop="attribute">
            <el-radio-group v-model="form.attribute">
              <el-radio v-for="(v,k) in res.attribute" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="门户网站填写" prop="isWebsiteFill">
            <el-radio-group v-model="form.isWebsiteFill">
              <el-radio v-for="(v,k) in res.isWebsiteFill" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="box">
          <el-form-item label="来源渠道" prop="sourceChannel">
            <el-radio-group v-model="form.sourceChannel">
              <el-radio v-for="(v,k) in res.sourceChannel" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="材料是否必交" prop="isNecessary">
            <el-radio-group v-model="form.isNecessary">
              <el-radio v-for="(v,k) in res.isNecessary" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="box">
          <el-form-item label="材料形式" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio v-for="(v,k) in res.type" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="纸质材料数量" prop="paperNum" v-if="form.type === 1">
            <el-input-number v-model="form.paperNum"></el-input-number>
          </el-form-item>
        </div>

        <el-form-item label="纸质材料规格" prop="paperSpecification" v-if="form.type === 1">
          <el-radio-group v-model="form.paperSpecification">
            <el-radio v-for="(v,k) in res.paperSpecification" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="电子材料规格" prop="electronicSpecification" v-if="form.type === 2">
          <el-radio-group v-model="form.electronicSpecification">
            <el-radio v-for="(v,k) in res.electronicSpecification" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="材料范本" prop="modelUrl">
          <el-upload class="upload-demo" :action="uploadUrl"
            :multiple='false' :limit='1'
            :file-list="fileList" :on-success='uploadSuccess' :on-error='uploadErr' :before-upload="beforeAvatarUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              支持格式：doc / docx / xls / xlsx / pdf 文件大小：最大支持2M
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="材料范本链接" prop="modelUrl" v-if="false">
          <el-input v-model="form.modelUrl" :disabled='true'></el-input>
        </el-form-item>

        <el-form-item label="填报须知" prop="fillNotice">
          <el-input v-model="form.fillNotice" type="textarea" :rows='4'></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="add('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="编辑材料明细" :visible.sync="updataDialogVisible" width="1000px" :append-to-body='true'>
      <el-form :model="updataForm" :rules="rules" ref="updataForm" :label-width="labelWidth">

        <el-form-item label="申请材料名称" prop="name">
          <el-input v-model="updataForm.name"></el-input>
        </el-form-item>

        <div class="box">
          <el-form-item label="材料属性" prop="attribute">
            <el-radio-group v-model="updataForm.attribute">
              <el-radio v-for="(v,k) in res.attribute" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="门户网站填写" prop="isWebsiteFill">
            <el-radio-group v-model="updataForm.isWebsiteFill">
              <el-radio v-for="(v,k) in res.isWebsiteFill" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="box">
          <el-form-item label="来源渠道" prop="sourceChannel">
            <el-radio-group v-model="updataForm.sourceChannel">
              <el-radio v-for="(v,k) in res.sourceChannel" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="材料是否必交" prop="isNecessary">
            <el-radio-group v-model="updataForm.isNecessary">
              <el-radio v-for="(v,k) in res.isNecessary" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="box">
          <el-form-item label="材料形式" prop="type">
            <el-radio-group v-model="updataForm.type">
              <el-radio v-for="(v,k) in res.type" :key="k" :label="v.label">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="纸质材料数量" prop="paperNum" v-if="updataForm.type === 1">
            <el-input-number v-model="updataForm.paperNum"></el-input-number>
          </el-form-item>
        </div>

        <el-form-item label="纸质材料规格" prop="paperSpecification" v-if="updataForm.type === 1">
          <el-radio-group v-model="updataForm.paperSpecification">
            <el-radio v-for="(v,k) in res.paperSpecification" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="电子材料规格" prop="electronicSpecification" v-if="updataForm.type === 2">
          <el-radio-group v-model="updataForm.electronicSpecification">
            <el-radio v-for="(v,k) in res.electronicSpecification" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="材料范本" prop="modelUrl">
          <el-upload class="upload-demo" :action="uploadUrl"
            :multiple='false' :limit='1'
            :file-list="fileList" :on-success='uploadSuccess' :on-error='uploadErr' :before-upload="beforeAvatarUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              支持格式：doc / docx / xls / xlsx / pdf 文件大小：最大支持2M
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="材料范本链接" prop="modelUrl" v-if="false">
          <el-input v-model="updataForm.modelUrl" :disabled='true'></el-input>
        </el-form-item>

        <el-form-item label="填报须知" prop="fillNotice">
          <el-input v-model="updataForm.fillNotice" type="textarea" :rows='4'></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updata('updataForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量删除 -->
    <el-dialog title="确认操作" :visible.sync="delsDialogVisible" width="30%" :append-to-body='true'>
      <span>确认删除所选申请材料</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dels">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 关联 -->
    <el-dialog class="relation-dialog" title="关联表单" :visible.sync="relationDialogVisible" width="1000px" :append-to-body='true'>

      <div class="search">
        <el-form :model="relationSearchForm" :rules="rules" ref="relationSearchForm" label-width="70px" :inline='true'>
          <el-form-item label="表单名称">
            <el-input v-model="relationSearchForm.name"></el-input>
          </el-form-item>

          <el-form-item label="表单标识">
            <el-input v-model="relationSearchForm.mark"></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" @click="relationSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="relationTable" style="width: 100%">

        <el-table-column prop="id" label="编号" width="100"></el-table-column>
        <el-table-column prop="name" label="表单名称"></el-table-column>
        <el-table-column prop="mark" label="表单标识"></el-table-column>
        <el-table-column prop="description" label="表单描述"></el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="relationSee(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="relation(scope.row, 1)">关联</el-button>
            <el-button type="text" size="small" @click="relation(scope.row, 0)">取联</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="relation-page">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count='5'
          :total="relationPageCount" :page-count='relationPageCount' :current-page="1"
          @size-change="relationSizeChange" @current-change="relationCurrentChange"></el-pagination>
      </div>

    </el-dialog>

    <!-- 关联-查看 -->
    <el-dialog title="确认操作" :visible.sync="relationSeeDialogVisible" width="1000px" :append-to-body='true'>
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
        <!-- <el-button @click="relationSeeDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="relationSeeDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <div class="btn">
      <el-button type="primary" @click="submit">变更申请</el-button>
      <el-button @click="dialogVisible = true">取 消</el-button>
    </div>

    <el-dialog title="确认操作" :visible.sync="dialogVisible" width="30%" :append-to-body='true'>
      <span>取消后本次填写的内容将不会保存，确定取消？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="quit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { openInfo, clone } from '@/utils'
import renders from '../../formAdmini/renders/renders'
export default {
  components: {
    renders
  },
  // props: [''],
  computed: {},
  data () {
    return {
      workId: '',
      labelWidth: '120px',
      dialogVisible: false,
      dialogVisibleAdd: false,
      pageCount: 0,
      tableData: [],
      multipleSelection: [],
      uploadUrl: '',
      fileList: [],

      form: {
        page: 1,
        limit: 10,
        workId: '',
        name: '', // 申请材料名称
        attribute: '', // 申请材料属性 1-证明 2-批文 3-申请表单
        isWebsiteFill: '', // 门户网站填写 1-支持 0-不支持
        sourceChannel: '', // 来源渠道
        isNecessary: '', // 材料是否必交
        type: '', // 材料形式 1- 纸质 2-电子
        paperNum: 1, // 纸质材料数量
        paperSpecification: '', // 纸质材料规格 1-不限 2-a4
        electronicSpecification: '', // 电子材料规格 1-不限 2-word 3-excel
        fillNotice: '', // 填报须知
        modelUrl: '' // 材料范本
      },
      res: {
        supHolidayProcess: [
          {label: 1, name: '办理'},
          {label: 2, name: '不办理'}
        ],
        attribute: [
          {label: 1, name: '证明'},
          {label: 2, name: '批文'},
          {label: 3, name: '申请表单'}
        ],
        isWebsiteFill: [
          {label: 1, name: '支持'},
          {label: 0, name: '不支持'}
        ],
        sourceChannel: [
          {label: 1, name: '申请人自备'},
          {label: 2, name: '政府部门核发'},
          {label: 3, name: '其他'}
        ],
        isNecessary: [
          {label: 1, name: '是'},
          {label: 0, name: '否'}
        ],
        type: [
          {label: 1, name: '纸质'},
          {label: 2, name: '电子'}
        ],
        paperSpecification: [
          {label: 1, name: '不限'},
          {label: 2, name: '纸质'}
        ],
        electronicSpecification: [
          {label: 1, name: '不限'},
          {label: 2, name: 'word'},
          {label: 3, name: 'excel'}
        ]
      },
      rules: {
        name: [ { required: true, message: '请输入', trigger: 'blur' } ],
        attribute: [ { required: true, message: '请输入', trigger: 'blur' } ],
        isWebsiteFill: [ { required: true, message: '请输入', trigger: 'blur' } ],
        sourceChannel: [ { required: true, message: '请输入', trigger: 'blur' } ],

        createTime: [ { required: true, message: '请输入', trigger: 'blur' } ],
        createUserId: [ { required: true, message: '请输入', trigger: 'blur' } ],
        electronicSpecification: [ { required: true, message: '请输入', trigger: 'blur' } ],
        fillNotice: [ { required: true, message: '请输入', trigger: 'blur' } ],
        formKey: [ { required: true, message: '请输入', trigger: 'blur' } ],
        id: [ { required: true, message: '请输入', trigger: 'blur' } ],
        isDel: [ { required: true, message: '请输入', trigger: 'blur' } ],
        isNecessary: [ { required: true, message: '请输入', trigger: 'blur' } ],
        modelUrl: [ { required: true, message: '请输入', trigger: 'blur' } ],
        paperNum: [ { required: true, message: '请输入', trigger: 'blur' } ],
        paperSpecification: [ { required: true, message: '请输入', trigger: 'blur' } ],
        type: [ { required: true, message: '请输入', trigger: 'blur' } ],
        updateTime: [ { required: true, message: '请输入', trigger: 'blur' } ],
        updateUserId: [ { required: true, message: '请输入', trigger: 'blur' } ],
        version: [ { required: true, message: '请输入', trigger: 'blur' } ],

        mustFill: [
          { required: true, message: '此为必填项', trigger: 'change' }
        ]
      },

      updataDialogVisible: false, // 修改
      upDataRowId: '',
      updataForm: { // 更新数据
        workId: '',
        name: '', // 申请材料名称
        attribute: '', // 申请材料属性 1-证明 2-批文 3-申请表单
        isWebsiteFill: '', // 门户网站填写 1-支持 0-不支持
        sourceChannel: '', // 来源渠道
        isNecessary: '', // 材料是否必交
        type: '', // 材料形式 1- 纸质 2-电子
        paperNum: 1, // 纸质材料数量
        paperSpecification: '', // 纸质材料规格 1-不限 2-a4
        electronicSpecification: '', // 电子材料规格 1-不限 2-word 3-excel
        fillNotice: '', // 填报须知
        modelUrl: '' // 材料范本
      },

      delsDialogVisible: false, // 删除

      // 关联 ----------------------------------------------
      relationRow: {}, // 当前行
      index: -1, // 当前行下标
      relationDialogVisible: false, // 关联
      relationTable: [],
      relationSearchForm: {
        page: 1,
        limit: 10,
        status: 0,
        name: '',
        mark: '',
        formKey: ''
      },
      relationPageCount: 0,
      relationSeeDialogVisible: false,
      wFofm: {},

      // 更新数据
      applyMaterialWorkInfosParam: {
        delete: [],
        insert: [],
        update: [],
        workId: ''
      },
      auditId: null,
      formDetailInfo: {}
    }
  },
  methods: {
    // 初始化
    init () {
      let updataWork = JSON.parse(sessionStorage.getItem('updataWork'))
      this.workId = this.form.workId = this.applyMaterialWorkInfosParam.workId = updataWork.workId

      if (sessionStorage.getItem('auditId')) this.auditId = Number(sessionStorage.getItem('auditId')) || null

      this.search()
    },

    // 上传成功
    uploadSuccess (response, file, fileList) {
      if (response.code === 0) {
        this.form.modelUrl = this.updataForm.modelUrl = response.bean
        openInfo('上传成功 (๑•̀ㅂ•́)و✧', 's')
      }
    },
    // 上传失败
    uploadErr (err, file, fileList) {
      openInfo('上传失败', 'e')
      this.form.modelUrl = ''
      console.log(err, file, fileList)
    },
    // 上传之前
    beforeAvatarUpload (file) {
      let arr = [
        `application/vnd.ms-excel`,
        `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
        `application/msword`,
        `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
        `application/pdf`
      ]
      let isType = arr.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isType) openInfo('只能上传 doc / docx / xls / xlsx / pdf 文件', 'w')
      if (!isLt2M) openInfo('文件体积过大', 'w')
      return isType && isLt2M
    },
    // 新增
    add (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let req = clone(this.form)
          req.paperNum = Number(req.paperNum)

          this.applyMaterialWorkInfosParam.insert.push(req)
          this.tableData.push(req)
          this.dialogVisibleAdd = false
          openInfo('添加成功', 's')
        }
      })
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

    // 新增
    applicationMaterialsTableAdd () { this.dialogVisibleAdd = true },
    handleSelectionChange (val) { this.multipleSelection = val },
    // 下载
    download (url) { window.open(url) },

    // 分页查询
    search () {
      let req = {}
      if (this.auditId) req = { page: this.form.page, limit: this.form.limit, workId: this.form.workId, auditId: this.auditId }
      else req = { page: this.form.page, limit: this.form.limit, workId: this.form.workId }

      this.$api.workApplyMaterialPage(req).then(res => {
        this.tableData = res.bean.list
        this.pageCount = res.bean.totalCount
      })
    },
    // 删除
    del (row) {
      this.$confirm('确认删除所选申请材料', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        this.delete(row, this.tableData)
      }).catch(() => {
        openInfo('已取消删除', 'i')
      })
    },
    // 批量删除
    dels () {
      this.delsDialogVisible = false
      if (this.multipleSelection.length === 0) return
      for (let i of this.multipleSelection) { this.delete(i, this.tableData) }
    },
    delete (row, tableData) {
      let index = 0
      for (let i = 0; i < tableData.length; i++) {
        if (row.id === tableData[i].id) {
          index = i
          break
        }
      }
      tableData.splice(index, 1)
      this.applyMaterialWorkInfosParam.delete.push(row.id)
      openInfo('删除成功', 's')
    },

    // 编辑按钮
    tableEdit (row) {
      // 获取
      this.upDataRowId = row.id
      this.$api.workApplyMaterialById(row.id).then(res => {
        if (res.code === 0) {
          // 回显到编辑窗口
          this.updataForm = res.bean
        }
      })
      // 打开编辑窗口
      this.updataDialogVisible = true
    },
    // 修改 / 更新
    updata (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let index = -1
          for (let i = 0; i < this.applyMaterialWorkInfosParam.update.length; i++) {
            if (this.applyMaterialWorkInfosParam.update[i].id === this.upDataRowId) {
              index = i
              break
            }
          }

          for (let i of this.tableData) {
            if (i.id === this.upDataRowId) {
              i.workId = this.updataForm.workId
              i.name = this.updataForm.name
              i.attribute = this.updataForm.attribute
              i.isWebsiteFill = this.updataForm.isWebsiteFill
              i.sourceChannel = this.updataForm.sourceChannel
              i.isNecessary = this.updataForm.isNecessary
              i.type = this.updataForm.type
              i.paperNum = this.updataForm.paperNum
              i.paperSpecification = this.updataForm.paperSpecification
              i.electronicSpecification = this.updataForm.electronicSpecification
              i.fillNotice = this.updataForm.fillNotice
              i.modelUrl = this.updataForm.modelUrl
            }
          }

          if (index === -1) this.applyMaterialWorkInfosParam.update.push(this.updataForm)
          else this.applyMaterialWorkInfosParam.update[index] = clone(this.updataForm)
          this.updataDialogVisible = false
        }
      })
    },

    // 打开关联窗口 ----------------------------------------------------------------------------------------------------------------------------------------------
    relationSearch (row, index) {
      this.relationDialogVisible = true

      if (row) this.relationRow = row
      this.index = index
      this.relationSearchForm.formKey = row.formKey

      this.getFormList()
    },
    getFormList () {
      this.$api.formList(this.relationSearchForm).then(res => {
        if (res.code === 0) {
          this.relationTable = res.bean.list
          this.relationPageCount = res.bean.totalCount
        }
      })
    },
    relationCurrentChange (page) { // 翻页
      this.relationSearchForm.page = page
      this.getFormList()
    },
    relationSizeChange (limit) { // 页大小
      this.relationSearchForm.limit = limit
      this.getFormList()
    },

    // 查看
    relationSee (row) {
      this.relationSeeDialogVisible = true
      this.$api.formDetail({id: row.id}).then(res => { // 获取表单详情
        if (res.code === 0) {
          this.formDetailInfo = res.bean
        }
      })
    },
    // 关联 & 取关
    relation (row, type) {
            // 外层表格 当前行
      if (this.relationRow.id) { // 原有数据
        let isUpdata = false
        for (let i of this.applyMaterialWorkInfosParam.update) { // 修改数据存入 updata
          if (i.id === this.relationRow.id) {
            if (type === 1) i.formKey = row.mark
            else i.formKey = ''
            isUpdata = true
            break
          }
        }

        for (let i of this.tableData) { // 修改表格显示
          if (i.id === this.relationRow.id) {
            if (type === 1) i.formKey = row.mark
            else i.formKey = ''

            if (!isUpdata) {
              this.applyMaterialWorkInfosParam.update.push(i)
            }
            break
          }
        }
      } else { // 新插入正处于审核状态的数据
        if (type === 1) this.tableData[this.index].formKey = row.mark
        else this.tableData[this.index].formKey = ''

        let arr = JSON.parse(JSON.stringify(this.tableData)) // 克隆数据相同对象并替换会表格数据 (否则表格内容再修改时没法实时更新
        this.tableData = []
        this.tableData = arr

        for (let i of this.applyMaterialWorkInfosParam.insert) { // 修改插入的数据
          if (
            i.page === row.page &&
            i.limit === row.limit &&
            i.workId === row.workId &&
            i.name === row.name &&
            i.attribute === row.attribute &&
            i.isWebsiteFill === row.isWebsiteFill &&
            i.sourceChannel === row.sourceChannel &&
            i.isNecessary === row.isNecessary &&
            i.type === row.type &&
            i.paperNum === row.paperNum &&
            i.paperSpecification === row.paperSpecification &&
            i.electronicSpecification === row.electronicSpecification &&
            i.fillNotice === row.fillNotice &&
            i.modelUrl === row.modelUrl
          ) {
            if (type === 1) i.formKey = row.mark
            else i.formKey = ''
            break
          }
        }
      }
      this.relationDialogVisible = false
      this.submit()
    },

    // 返回
    quit () { this.$router.go(-1) },
    submit () {
      let req = { applyMaterialWorkInfosParam: this.applyMaterialWorkInfosParam, workId: this.workId }
      this.$api.workUpdate(req).then(res => {
        if (res.code === 0) {
          openInfo('修改成功', 's')
        } else {
          openInfo('修改失败，请按参照规范修改后重新提交', 'e')
        }
      })
    }
  },
  beforeCreate () {},
  created () {
    this.init()
  },
  beforeMount () {},
  mounted () {
    this.uploadUrl = this.$api.sysOssUpload()
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {}
}
</script>

<style scoped lang='scss'>
@import './updataItem.scss';
.box{
  display: flex;
  justify-content: space-between;
  .el-input{
    width: 400px;
  }
  .el-select{
    width: 400px;
  }
}

.search{
  text-align: center;
}
.relation-page{
  text-align: right;
  margin: 20px 0;
}
</style>
