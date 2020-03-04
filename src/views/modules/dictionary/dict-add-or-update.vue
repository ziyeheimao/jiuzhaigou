<template>
  <el-dialog
    :append-to-body='true'
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字典项名称" prop="dictItemName">
        <el-input v-model="dataForm.dictItemName" placeholder="字典项名称"></el-input>
      </el-form-item>
      <el-form-item label="字典标识" prop="dictType">
        <el-input v-model="dataForm.dictType" placeholder="字典标识" disabled></el-input>
      </el-form-item>
      <el-form-item label="字典排序" prop="sortNo">
        <el-input v-model="dataForm.sortNo" placeholder="字典排序"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="dataItemDesc">
        <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="dataForm.dataItemDesc">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        status:'1',
        textarea2:'',
        dataForm: {
          id: 0,
          dictItemName: '',
          dictType:'',
          sortNo:'',
          dataItemDesc:'',
          status:'0',
          associatedDictId: ''
        },
         dataRule: {
          dictItemName: [
            { required: true, message: '字典项名称不能为空', trigger: 'blur' }
          ],
          sortNo: [
            { required: true, message: '字典排序不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id, dictType, associatedDictId) {
        this.dataForm.id = id || 0
        this.dataForm.dictType = dictType
        this.dataForm.associatedDictId = associatedDictId

        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dict/item/get?id=${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dictItemName = data.bean.dictItemName
                this.dataForm.sortNo = data.bean.sortNo
                this.dataForm.dataItemDesc = data.bean.dataItemDesc
                this.dataForm.status = data.bean.status
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let type = "post"
            if (this.dataForm.id) {
              type = 'put'
            }

            this.$http({
              url: this.$http.adornUrl(`/sys/dict/item/${!this.dataForm.id ? 'save' : 'update'}`),
              method: type,
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dictItemName': this.dataForm.dictItemName,
                'dictType': this.dataForm.dictType,
                'sortNo': this.dataForm.sortNo,
                'dataItemDesc': this.dataForm.dataItemDesc,
                'status': this.dataForm.status,
                'associatedDictId': this.dataForm.associatedDictId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
