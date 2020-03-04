
<template>
  <section class="ctn">
    <el-row>
      <!-- 左 -->
      <el-col :span="7">
        <el-form label-width="70px">

          <!-- 拖拽容器 -->
          <draggable :clone="cloneData" :list="form_list" :options="optionsLeft">

            <!-- 过度容器 -->
            <!-- <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div"> -->

              <!-- 被拖拽内容 -->
              <div class="form-left" v-for="(v,k) in form_list" :key="k" style="padding: 15px;">
                <renders :ele='v.ele' :obj='v.obj' :prop='v.prop'></renders>
              </div>
            <!-- </transition-group> -->
          </draggable>
        </el-form>
      </el-col>

      <!-- 中 -->
      <el-col :span="10">
        <el-form label-width="100px" :rules="rules">
          <el-alert title="未绑定数据字典控件无效" type="warning" :closable='false' style="margin-bottom: 15px;"></el-alert>
          <el-divider>将组件拖拽至下述↓方框内</el-divider>
          <div class="border">
            <h3 style="padding: 0 15px;">{{formInfo.formName}}</h3>
            <el-divider></el-divider>

            <draggable :list="form_Right" :options="optionsRight">
              <!-- 过度容器 -->
              <!-- <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div"> -->
                <!-- 被拖入内容 -->
                <div class="form-right" v-for="(v,k) in form_Right" :key="k" style="padding: 15px;"><!--  @click="setting(v)" -->
                  <div class="icon">
                    <i class="el-icon-setting" @click="setting(v)"></i>
                    <i class="el-icon-close" @click="close(v)"></i>
                  </div>
                  <renders :ele='v.ele' :obj='v.obj' :prop='v.prop'></renders>
                </div>
              <!-- </transition-group> -->
            </draggable>
          </div>

        </el-form>

        <el-divider>保存上述↑内容</el-divider>

        <div class="btn">
          <el-button-group>
            <el-button type="primary" @click="reset">重 置</el-button>
            <el-button type="primary" @click="submit(1)">保存草稿</el-button>
            <el-button type="primary" @click="submit(2)">保存并启用</el-button>
          </el-button-group>
        </div>
      </el-col>

      <!-- 右 -->
      <el-col :span="7">
        <!-- 表单信息 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>表单信息</span>
          </div>

          <div>
            <el-form ref="formInfo" :model="formInfo" label-width="70px" :rules="rules">
              <el-form-item label="表单名称">
                <el-input v-model="formInfo.formName" clearable></el-input>
              </el-form-item>

              <el-form-item label="表单类型">
                <!-- <el-input v-model="formInfo.formype" clearable></el-input> -->
                <el-radio-group v-model="formInfo.formype">
                  <el-radio :label="0">实体表单</el-radio>
                  <el-radio :label="1">表格表单</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="表单描述">
                <el-input v-model="formInfo.formDescribe" clearable type="textarea"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <!-- 控件信息 -->
        <el-card class="box-card" style="margin-top: 25px;">
          <div slot="header" class="clearfix">
            <el-input placeholder="字典名称" v-model="formDict.dictName" class="input-with-select" @keyup.native.enter="searchDict">
              <el-button slot="append" icon="el-icon-search" @click="searchDict"></el-button>
            </el-input>
          </div>

          <div style="padding-bottom: 10px;">
            <el-button type="primary" size="mini" @click="addDictDialogVisible = true">新增字典</el-button>
          </div>

          <el-table :data="tableDict" style="width: 100%; max-height: 500px; overflow-y: scroll;">
            <el-table-column align='center' prop="id" label="id" width="70"></el-table-column>
            <el-table-column align='center' prop="dictName" label="字典" :show-overflow-tooltip='true'></el-table-column>
            <!-- <el-table-column prop="date3" label="标识" ></el-table-column>
            <el-table-column prop="date2" label="描述" ></el-table-column> -->

            <el-table-column align='center' label="操作" width="100">
              <template slot-scope="scope">
                <el-dropdown size="small" @command="handleCommand($event, scope.row, scope.$index)">
                  <el-button type="primary" size="mini">操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="del">删除</el-dropdown-item>
                    <el-dropdown-item command="edit">修改</el-dropdown-item>
                    <el-dropdown-item command="list">列表</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

        </el-card>
      </el-col>
    </el-row>

    <!-- 属性配置模态框 -->
    <el-dialog title="配置文本域属性" :visible.sync="setDialogVisible" width="650px" :append-to-body='true'>
      <el-form ref="controlInfo" :model="controlInfo" label-width="100px">
        <el-form-item label="控件名称">
          <el-input v-model="controlInfo.controlName" clearable></el-input>
        </el-form-item>

        <el-form-item label="是否必填" v-if="settingForm.ele !== 'el-button'">
          <el-radio-group v-model="controlInfo.mustFill">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="关联字典" v-if="settingForm.ele === 'el-radio' || settingForm.ele === 'el-checkbox' || settingForm.ele === 'el-select'"><!-- 关联字典(单选 多选 下拉选) -->
          <el-select v-model="controlInfo.dictionaries" clearable>
            <!-- <el-option :label="'性别'" :value="1"></el-option> -->
            <el-option v-for="(v,k) in tableDict" :key="k" :label="v.dictName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="占位符内容" v-if="settingForm.ele === 'el-input' || settingForm.ele === 'textarea' || settingForm.ele === 'el-select'"><!-- 输入框 文本框 下拉选 -->
          <el-input v-model="controlInfo.placeholder" clearable></el-input>
        </el-form-item>

        <el-form-item label="最大输出长度" v-if="settingForm.ele === 'el-input' || settingForm.ele === 'textarea'"><!-- 输入框 文本框 -->
          <el-input-number v-model="controlInfo.maxlength"></el-input-number>
        </el-form-item>

        <el-form-item label="最小值" v-if="settingForm.ele === 'el-input-number'"><!-- 计数器 -->
          <el-input-number v-model="controlInfo.min"></el-input-number>
        </el-form-item>

        <el-form-item label="最大值" v-if="settingForm.ele === 'el-input-number'"><!-- 计数器 -->
          <el-input-number v-model="controlInfo.max"></el-input-number>
        </el-form-item>

        <!-- 按钮 -->
        <!-- <el-form-item label="按钮文字" v-if="settingForm.ele === 'el-button'">
          <el-input v-model="controlInfo.text" clearable></el-input>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="set">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 字典 删除 -->
    <el-dialog title="删除字典" :visible.sync="delDictDialogVisible" width="650px" :append-to-body='true'>
      <span>确定删除所选字典吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDictDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sysDictDelete">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 字典 修改 -->
    <el-dialog title="修改字典" :visible.sync="editDictDialogVisible" width="650px" :append-to-body='true'>
      <el-form ref="formEdit" :model="formEdit" label-width="80px" :rules="rules">
        <el-form-item label="字典名称">
          <el-input v-model="formEdit.dictName" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典标识">
          <el-input v-model="formEdit.dictType" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典状态">
          <el-radio-group v-model="formEdit.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="字典描述">
          <el-input v-model="formEdit.dataDesc" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDictDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sysDictEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 字典 详情列表 -->
    <el-dialog title="字典详情" :visible.sync="listDictDialogVisible" width="650px" :append-to-body='true'>
      <div style="padding-bottom: 10px;">
        <el-button type="primary" size="mini" @click="addItme">新增字典项</el-button>
      </div>

      <el-table :data="tableDictDetail" style="width: 100%; max-height: 500px; overflow-y: scroll;">
        <el-table-column align='center' prop="id" label="id" width="70"></el-table-column>
        <el-table-column align='center' prop="dictItemName" label="字典名称" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column align='center' prop="dictType" label="字典标识" ></el-table-column>
        <el-table-column align='center' prop="sortNo" label="字典排序" width="80"></el-table-column>

        <el-table-column align='center' label="操作" width="100">
          <template slot-scope="scope">
            <el-dropdown size="small" @command="handleCommandItem($event, scope.row, scope.$index)">
              <el-button type="primary" size="mini">操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="del">删除</el-dropdown-item>
                <el-dropdown-item command="edit">修改</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="listDictDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="listDictDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增字典 -->
    <el-dialog title="新增字典" :visible.sync="addDictDialogVisible" width="650px" :append-to-body='true'>
      <el-form ref="formAdd" :model="formAdd" label-width="80px" :rules="rules">
        <el-form-item label="字典名称">
          <el-input v-model="formAdd.dictName" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典标识">
          <el-input v-model="formAdd.dictType" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典状态">
          <el-radio-group v-model="formAdd.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="字典描述">
          <el-input v-model="formAdd.dataDesc" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDictDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sysDictSave">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增字典项 -->
    <el-dialog title="新增字典项" :visible.sync="addItmeDictDialogVisible" width="650px" :append-to-body='true'>
      <el-form ref="formAddItem" :model="formAddItem" label-width="90px" :rules="rules">
        <el-form-item label="字典项名称">
          <el-input v-model="formAddItem.dictItemName" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典项标识">
          <el-input v-model="formAddItem.dictType" clearable :disabled='true'></el-input>
        </el-form-item>

        <el-form-item label="字典项状态">
          <el-radio-group v-model="formAddItem.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="字典项排序">
          <el-input v-model="formAddItem.sortNo" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典项描述">
          <el-input v-model="formAddItem.dataItemDesc" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addItmeDictDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddItme">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除字典项 -->
    <el-dialog title="删除字典项" :visible.sync="delItemDictDialogVisible" width="650px" :append-to-body='true'>
      <span>确定删除所选字典项吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delItemDictDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delItem">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改字典项 -->
    <el-dialog title="新增字典项" :visible.sync="editItmeDictDialogVisible" width="650px" :append-to-body='true'>
      <el-form ref="formEditItem" :model="formEditItem" label-width="90px" :rules="rules">
        <el-form-item label="字典项名称">
          <el-input v-model="formEditItem.dictItemName" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典项标识">
          <el-input v-model="formEditItem.dictType" clearable :disabled='true'></el-input>
        </el-form-item>

        <el-form-item label="字典项状态">
          <el-radio-group v-model="formEditItem.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="字典项排序">
          <el-input v-model="formEditItem.sortNo" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典项描述">
          <el-input v-model="formEditItem.dataItemDesc" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editItmeDictDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editItem">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import renders from './renders/renders'
export default {
  components: {
    draggable,
    renders
  },
  data () {
    return {
      form_list: [ // 左侧被拖拽数据
        {
          ele: 'el-input',
          obj: {
            dataType: 0,
            label: '控件名称',
            placeholder: '请输入',
            clearable: 1,
            maxlength: 20
          },
          prop: {
            mustFill: 0
          }
        },
        {
          ele: 'el-select',
          obj: {
            dataType: 1,
            label: '控件名称',
            placeholder: '请选择',
            clearable: 1
          },
          prop: {
            mustFill: 0
          }
        },
        {
          ele: 'el-radio',
          obj: {
            dataType: 1,
            label: '控件名称'
          },
          prop: {
            mustFill: 0
          }
        },
        {
          ele: 'el-checkbox',
          obj: {
            dataType: 0,
            label: '控件名称'
          },
          prop: {
            mustFill: 0
          }
        },
        {
          ele: 'el-input-number',
          obj: {
            dataType: 1,
            label: '控件名称',
            min: 1,
            max: 1000
          },
          prop: {
            mustFill: 0
          }
        },
        {
          ele: 'textarea',
          obj: {
            dataType: 0,
            label: '控件名称',
            placeholder: '请输入',
            clearable: 1,
            maxlength: 500
          },
          prop: {
            mustFill: 0
          }
        }
        // {
        //   ele: 'el-button',
        //   obj: {
        //     label: '控件名称',
        //     text: '提 交'
        //   },
        //   prop: {
        //     mustFill: 0
        //   }
        // }
      ],
      optionsLeft: { // 左侧拖拽属性配置
        animation: 0,
        ghostClass: 'ghost',
        // 分组
        group: {
          name: 'shared',
          pull: 'clone',
          revertClone: false
        },
        // 禁止拖动排序
        sort: false
      },
      form_Right: [], // 右侧被拖入数据
      optionsRight: { // 右侧拖拽属性配置
        animation: 0,
        ghostClass: 'ghost',
        group: {
          // 只允许放置shared的控件,禁止pull
          put: ['shared']
        }
      },
      rules: { // 表单检测规则
        mustFill: [
          { required: true, message: '此为必填项', trigger: 'change' }
        ]
      },

      index: 0, // 用于自增统计排序
      setDialogVisible: false,

      // 右侧信息
      formInfo: { // 表单信息
        formName: '表单名称',
        formype: 0, // 标识
        formDescribe: '' // 描述
      },

      indexActivate: -1, // 激活的下标
      controlInfo: { // 控件信息
        controlName: '控件名称', // 表单名称
        mustFill: 1, // 是否必填
        placeholder: '请输入', // 占位符文字

        dictionaries: '', // 关联字典(单选 多选 下拉选)
        maxlength: 20, // 最大输出长度(输入框 文本框)
        min: 1, // 最小值(计数器)
        max: 1000, // 最大值(计数器)
        text: '提 交' // 按钮文字
      },
      settingForm: {}, // 设置

      // 字典↓ ----------------------------------------------------------------------------------
      formDict: {
        dictName: '',
        page: 1,
        limit: 9999999
      },

      tableDict: [], // 字典表格
      delDictDialogVisible: false, // 字典删除
      editDictDialogVisible: false, // 字典修改
      listDictDialogVisible: false, // 字典列表
      addDictDialogVisible: false, // 字典新增
      addItmeDictDialogVisible: false, // 新增字典项
      delItemDictDialogVisible: false, // 删除字典项
      editItmeDictDialogVisible: false, // 修改字典项目
      row: {}, // 当前行
      formEdit: { // 修改
        id: '',
        dictName: '',
        dictType: '', // 标识
        status: '', // '0'启用 '1'禁用
        dataDesc: '' // 描述
      },
      tableDictDetail: [], // 字典详情表格
      formAdd: { // 新增
        dictName: '',
        dictType: '', // 标识
        status: '0', // '0'启用 '1'禁用
        dataDesc: '' // 描述
      },

      // 字典项详情↓ ----------------------------------------------------------------------------------
      formAddItem: {
        dictItemName: '',
        dictType: '',
        sortNo: '', // 排序
        dataItemDesc: '',
        status: '0',
        associatedDictId: ''
      },
      itemRow: {}, // 当前字典项内容
      formEditItem: { // 修改字典项
        id: '',
        dictItemName: '',
        dictType: '',
        sortNo: '',
        dataItemDesc: '',
        status: ''
      }
    }
  },
  methods: {
    init () {
      console.log(this.$route.query)
      let query = this.$route.query
      if (query.id) {
        this.form_Right = query.fields

        for (let i of this.form_Right) {
          delete i.id
          i.obj.dataType = i.dataType // integer($int32) 数据类型：0：文本1：整型2：浮点型3：日期4：枚举5：布尔6：表单对象 ??????????????
          i.obj.dictionaries = i.dictId // integer($int64) 字典ID
          i.prop.mustFill = i.required // integer($int32) 是否为必填
        }
      }
      this.searchDict()
    },

    // https://github.com/SortableJS/Vue.Draggable#clone
    // 克隆,深拷贝对象
    cloneData (original) {
      // 添加一个modal标题
      // original.obj.modalTitle = original.obj.label || ''
      // 深拷贝对象，防止默认空对象被更改
      let obj = JSON.parse(JSON.stringify(original))
      obj.index = this.index++
      return obj
    },
    // 设置当前表单
    setting (v) {
      this.setDialogVisible = true
      this.indexActivate = v.index
      this.settingForm = v
    },
    // 提交设置
    set () {
      for (let i of this.form_Right) {
        if (i.index === this.indexActivate) {
          i.obj.label = this.controlInfo.controlName // 控件名称

          if (i.ele === 'el-button') {
            i.obj.text = this.controlInfo.text
          } else {
            if (this.controlInfo.mustFill === 1) { // 是否必填
              i.prop.mustFill = 1
            } else if (this.controlInfo.mustFill === 0) {
              i.prop.mustFill = 0
            }
          }

          if (i.ele === 'el-input' || i.ele === 'textarea' || i.ele === 'el-select') { // 占位符
            i.obj.placeholder = this.controlInfo.placeholder
          }

          if (i.ele === 'el-radio' || i.ele === 'el-checkbox' || i.ele === 'el-select') { // 占位符文字
            i.obj.dictionaries = this.controlInfo.dictionaries
          }

          if (i.ele === 'el-input' || i.ele === 'textarea') { // 最大输出长度
            i.obj.maxlength = this.controlInfo.maxlength
          }

          if (i.ele === 'el-input-number') { // 最小值 最大值
            i.obj.min = this.controlInfo.min
            i.obj.max = this.controlInfo.max
          }

          break
        }
      }
      this.setDialogVisible = false
    },
    // 删除当前表单
    close (v) {
      let index2 = -1
      for (let i = 0; i < this.form_Right.length; i++) {
        if (this.form_Right[i].index === v.index) {
          index2 = i
          break
        }
      }
      this.form_Right.splice(index2, 1)
    },
    // 重置
    reset () {
      this.form_Right = []
    },
    // 提交
    submit (type) {
      if (this.formInfo.formName === '' || this.formInfo.formype === '') {
        this.$message({message: '表单名称和表单标识不可为空', type: 'error'})
        return
      }

      if (this.form_Right.length === 0) {
        this.$message({message: '至少要有一个表单控件才可提交', type: 'error'})
        return
      }

      for (let i of this.form_Right) {
        if (i.ele === 'el-radio' || i.ele === 'el-checkbox' || i.ele === 'el-select') {
          if (!i.obj.dictionaries) {
            this.$message({message: '单选框、多选框和下拉选择器必须绑定字典才能生效', type: 'error'})
            return
          }
        }
      }

      for (let i of this.form_Right) {
        console.log(i)
        // if (i.obj.label) i.columnName = i.obj.label // string 更新时必填列名,新增无需填写
        if (i.obj.dataType !== '') i.dataType = i.obj.dataType // integer($int32) 数据类型：0：文本1：整型2：浮点型3：日期4：枚举5：布尔6：表单对象 ??????????????
        // i.defaultValue = '' // string 字段的默认值
        if (i.obj.dictionaries !== '') i.dictId = i.obj.dictionaries // integer($int64) 字典ID
        // i.dictItemId = 0 // integer($int64)字典项ID
        // i.ele =  // string ele标签
        // i.fieldOrder = 0 // integer($int32) 字段在表单中的顺序
        // i.isQuery = 0 // integer($int32) 是否为查询参数0否1是
        // i.refFormId = 0 // integer($int64) 如果数据类型为表单对象类型，此字段表示所引用的表单对象
        // i.relativeType = 0 // integer($int32) 如果数据类型为表单对象类型，此字段表示与所引用的表单模板对象之间的映射关系：0：一对多1：多对一2：一对一
        if (i.prop.mustFill !== '') i.required = i.prop.mustFill // integer($int32) 是否为必填
        // i.uiType = 0 // integer($int32) UI 控件类型：0：单行文本框1：多行文本框2：日期选择框3：货币4：下拉框5：单选按钮6：复选框7：表格
      }

      let req = {
        description: this.formInfo.formDescribe, // 描述
        name: this.formInfo.formName, // 表单名称
        formType: this.formInfo.formype, // 表单类型0实体表单1表格表单
        // status: 3, // 启用状态 0启用1停用2作废3草稿

        fields: this.form_Right
        // fields: [
        //   {
        //     columnName: '', // string 更新时必填列名,新增无需填写
        //     dataType: '', // integer($int32) 数据类型：0：文本1：整型2：浮点型3：日期4：枚举5：布尔6：表单对象
        //     defaultValue: '', // string 字段的默认值
        //     dictId: '', // integer($int64) 字典ID
        //     dictItemId: '', // integer($int64)字典项ID
        //     ele: '', // string ele标签
        //     fieldOrder: '', // integer($int32) 字段在表单中的顺序
        //     isQuery: '', // integer($int32) 是否为查询参数0否1是
        //     refFormId: '', // integer($int64) 如果数据类型为表单对象类型，此字段表示所引用的表单对象
        //     relativeType: '', // integer($int32) 如果数据类型为表单对象类型，此字段表示与所引用的表单模板对象之间的映射关系：0：一对多1：多对一2：一对一
        //     required: '', // integer($int32) 是否为必填
        //     uiType: '', // integer($int32) UI 控件类型：0：单行文本框1：多行文本框2：日期选择框3：货币4：下拉框5：单选按钮6：复选框7：表格

        //     obj: {
        //       clearable: '', // integer($int32) 0 false 1 true
        //       label: '', // string 控件名称
        //       max: '', // integer($int32) 最大值
        //       maxlength: '', // integer($int32) 最大长度
        //       min: '', // integer($int32) 最小值
        //       placeholder: '', // string 请输入
        //       text: '' // string 文本
        //     },

        //     prop: {
        //       mustFill: '' // integer($int32) 0 false 1 true
        //     }
        //   }
        // ]
      }

      if (type === 1) { // 保存草稿
        req.status = 3
      } else if (type === 2) { // 保存启用
        req.status = 0
      }
      console.log(req)
      this.$api.formAdd(req).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.$message({message: '提交成功', type: 'success'})
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        }
      })
    },

    // 字典 -----------------------------------------------------------
    searchDict () { // 搜索字典
      let req = {
        page: this.formDict.page,
        limit: this.formDict.limit
      }
      if (this.formDict.dictName) req.dictName = this.formDict.dictName

      this.$api.sysDictList(req).then(res => {
        if (res.code === 0) {
          this.tableDict = res.bean.list
          this.total = res.bean.totalCount
        }
      })
    },
    handleCommand (command, row, index) {
      this.row = row
      switch (command) {
        case 'del':
          this.delDictDialogVisible = true // 字典删除
          break
        case 'edit':
          this.editDictDialogVisible = true // 字典修改

          this.formEdit.id = this.row.id
          this.formEdit.dictName = this.row.dictName
          this.formEdit.dictType = this.row.dictType // 标识
          this.formEdit.status = this.row.status // '0'启用 '1'禁用
          this.formEdit.dataDesc = this.row.dataDesc // 描述
          break
        case 'list':
          this.listDictDialogVisible = true // 字典列表
          this.sysDictItemList()
          break
      }
    },
    sysDictDelete () { // 删除字典
      this.$api.sysDictDelete({ id: this.row.id }).then(res => {
        if (res.code === 0) {
          this.$message({message: '删除成功', type: 'success'})
          this.searchDict()
          this.delDictDialogVisible = false
        }
      })
    },
    sysDictEdit () { // 修改字典
      if (this.formEdit.dictName === '' || this.formEdit.dictType === '' || this.formEdit.status === '') {
        this.$message({message: '字典名称、字典标识及字典状态为必选项', type: 'error'})
        return
      }
      this.$api.sysDictUpdate(this.formEdit).then(res => {
        if (res.code === 0) {
          this.$message({message: '删除成功', type: 'success'})
          this.searchDict()
          this.editDictDialogVisible = false
        }
      })
    },
    sysDictItemList () { // 获取字典项 详情
      let req = {
        dictType: this.row.dictType,
        page: 1,
        limit: 999999
      }
      this.formAddItem.associatedDictId = this.row.id
      this.$api.sysDictItemList(req).then(res => {
        if (res.code === 0) {
          this.tableDictDetail = res.bean.list
        }
      })
    },
    sysDictSave () { // 添加字典
      if (!this.formAdd.dictName || !this.formAdd.dictType) {
        this.$message({message: '字典名称及字典标识为必选项', type: 'error'})
        return
      }
      this.$api.sysDictSave(this.formAdd).then(res => {
        if (res.code === 0) {
          this.addDictDialogVisible = false
          this.searchDict()
          this.$message({message: '添加成功', type: 'success'})
        }
      })
    },

    // 字典详情↓ ----------------------------------------------------------------------------------
    addItme () {
      this.addItmeDictDialogVisible = true
      this.formAddItem.dictType = this.row.dictType
    },
    submitAddItme () { // 提交添加字典项
      this.$api.sysDictItemSave(this.formAddItem).then(res => {
        if (res.code === 0) {
          this.addItmeDictDialogVisible = false
          this.$message({message: '添加成功', type: 'success'})
          this.sysDictItemList()
        }
      })
    },
    handleCommandItem (command, itemRow, index) {
      this.itemRow = itemRow
      switch (command) {
        case 'del':
          this.delItemDictDialogVisible = true
          break
        case 'edit':
          this.editItmeDictDialogVisible = true

          this.formEditItem.id = this.itemRow.id
          this.formEditItem.dictItemName = this.itemRow.dictItemName
          this.formEditItem.dictType = this.itemRow.dictType
          this.formEditItem.sortNo = this.itemRow.sortNo
          this.formEditItem.dataItemDesc = this.itemRow.dataItemDesc
          this.formEditItem.status = this.itemRow.status
          break
      }
    },
    delItem () { // 删除字典项
      this.$api.sysDictItemDelete({id: this.itemRow.id}).then(res => {
        if (res.code === 0) {
          this.delItemDictDialogVisible = false
          this.sysDictItemList()
          this.$message({message: '删除成功', type: 'success'})
        }
      })
    },
    editItem () { // 修改字典项
      if (!this.formEditItem.dictItemName || !this.formEditItem.dictType || !this.formEditItem.status) {
        this.$message({message: '字典项名称及字典项标识及字典项状态为必选项', type: 'error'})
        return
      }

      this.$api.sysDictItemUpdate(this.formEditItem).then(res => {
        if (res.code === 0) {
          this.editItmeDictDialogVisible = false
          this.$message({message: '修改成功', type: 'success'})
          this.sysDictItemList()
        }
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped lang='scss'>
.el-col{
  padding: 20px 20px;
  border: 1px solid #ddd;
}
.form-right{
  position: relative;
}
.form-right > .icon{
  display: none;
  padding: 5px;
  position: absolute;
  top: -15px;
  right: 0;
  font-size: 14px;
  cursor: pointer;
  z-index: 2;
}
.form-right:hover > .icon{
  display: block;
}

/* 方框 */
.border{
  border: 1px dashed rgba(102, 117, 255, 0.5);
  padding: 40px 0;
}
.border:hover{
  border: 1px dashed rgba(102, 117, 255, 1);
}

/* 底部按钮 */
.btn{
  text-align: center;
}

// 分页
// .page{
//   text-align: center;
//   padding-top: 10px;
// }
</style>
