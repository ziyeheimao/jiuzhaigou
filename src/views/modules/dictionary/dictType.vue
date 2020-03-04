<template>
  <div>
  <el-dialog :append-to-body='true' :title="'字典详情'" :close-on-click-modal="false" :visible.sync="visible" width="65%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <span>字典名称：</span>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.dictItemName" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <span>字典标签：</span>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.dictTag" clearable></el-input>
      </el-form-item>
      <el-form-item label="数据状态：">
        <el-select v-model="dataForm.status" placeholder="所有">
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item>
          <el-button type="success" round size="small" @click="getDataList()">搜索</el-button>
          <el-button type="warning" round size="small" v-model="dataForm.resetting">重置</el-button>
        </el-form-item>
        <el-form-item>
        <div>
      <el-button type="primary" @click="addOrHandle()" size="small">新增</el-button>
      <el-button type="success" size="small">修改</el-button>
       
      <el-button
        type="danger"
        @click="deleteHandle()"
        :disabled="dataListSelections.length <= 0"
        size="small"
      >删除</el-button>
       </div>
       </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      stripe
      style="width: 100%;text-align:center"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" label="字典编码" width="80"></el-table-column>
      <el-table-column prop="dictItemName" label="字典名称" width="80"></el-table-column>
      <el-table-column prop="dictType" label="字典标识"></el-table-column>
      <el-table-column prop="sortNo" label="字典排序"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template></el-table-column>
      <el-table-column prop="dataItemDesc" label="备注"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <dictitem v-if="dictitemVisible" ref="dictitem" @refreshDataList="getDataList"></dictitem>
  </div>
</template>

<script>
import dictitem from './dict-add-or-update'
export default {
  components:{
    dictitem,
  },
  data() {
    return {
      dataForm: {
        dictItemName: "",
        dictType: "",
        sortNo:'',
        region: "",
        dataItemDesc:'',
        resetting: "",
        search: "",
        date1: "",
        date2: ""
      },
      associatedDictId: '',
      dictType: null,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      dictitemVisible: false,
      visible: false
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.visible = true;
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/dict/item/list"),
        method: "get",
        params: this.$http.adornParams({
          dictItemName: this.dataForm.dictItemName || null,
          dictType: this.dictType || null,
          page: this.pageIndex,
          limit: this.pageSize,
          status: this.dataForm.status || null
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.bean.list;
          this.totalPage = data.bean.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    childrenVisible(dictType, associatedDictId) {
      this.dictType = dictType
      this.associatedDictId = associatedDictId
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 修改
    addOrHandle (id) {
      this.dictitemVisible = true
      this.$nextTick(() => {
        this.$refs.dictitem.init(id, this.dictType, this.associatedDictId)
      })
    },
    init(id) {
      this.id = id;
    },
    //删除
    deleteHandle(id) {
      this.$http({
            url: this.$http.adornUrl('/sys/dict/item/delete'),
            method: 'delete',
            params: this.$http.adornParams({id})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
    }
  }
};
</script>
