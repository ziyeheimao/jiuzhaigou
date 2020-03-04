<template>
   <div class="mod-config">
     <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
            <span>字典名称：</span>
        </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.dictName" clearable></el-input>
      </el-form-item>
      <el-form-item>
            <span>字典类型：</span>
        </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.dictType" clearable></el-input>
      </el-form-item>
        <el-form-item label="字典状态：">
        <el-select v-model="dataForm.status" placeholder="所有">
          <el-option label="正常" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
    <el-col :span="11">
      <el-date-picker type="date" placeholder="开始时间" v-model="dataForm.date1" style="width: 100%;"></el-date-picker>
    </el-col>
    <el-col class="line" :span="2" style="text-align:center">-</el-col>
    <el-col :span="11">
      <el-time-picker placeholder="结束时间" v-model="dataForm.date2" style="width: 100%;"></el-time-picker>
    </el-col>
  </el-form-item>
      <div>
      <el-form-item>
      <el-button type="success" round size="small" @click="getDataList()">搜索</el-button>
      <el-button type="warning" round size="small" v-model="dataForm.resetting">重置</el-button>
      </el-form-item>
      </div>
      <el-form-item>
      <el-button type="primary" @click="addOrUpdateHandle()" size="small">新增</el-button>
        <!-- <el-button type="success" size="small">修改</el-button> -->
        <!-- <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" size="small">删除</el-button> -->
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
    <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
      prop="id"
      label="字典主键"
      width="80">
    </el-table-column>
    <el-table-column
      prop="dictName"
      label="字典名称"
      width="80">
    </el-table-column>
    <el-table-column
      prop="dictType"
      label="字典标识">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="dataDesc"
      label="备注">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="开始时间">
    </el-table-column>
    <el-table-column
      prop="operate"
      label="操作">
      <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="dictList(scope.row.dictType, scope.row.id)">列表</el-button>
        </template>
    </el-table-column>
  </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <children-visible v-if="childrenVisible" ref="children" @refreshDataList="getDataList"></children-visible>
  </div>
</template>

<script>
  import AddOrUpdate from './add-or-update'
  import childrenVisible from './dictType'
  export default {
    data () {
      return {
        dataForm: {
          dictName: '',
          dictType:'',
          region:'',
          resetting:'',
          search:'',
          date1: '',
          date2: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        childrenVisible:false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      childrenVisible
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/dict/list'),
          method: 'get',
          params: this.$http.adornParams({
            'dictName':this.dataForm.dictName||null,
            'dictType':this.dataForm.dictType||null,
            'page': this.pageIndex,
            'limit': this.pageSize,
            'status':this.dataForm.status||null
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.bean.list
            this.totalPage = data.bean.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      dictList (id, associatedDictId) {
        this.childrenVisible = true
        this.$nextTick(() => {
          this.$refs.children.childrenVisible(id, associatedDictId)
        })
      },
      //删除
       deleteHandle (id) {
          this.$http({
            url: this.$http.adornUrl('/sys/dict/delete'),
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
  }
</script>
<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color:black;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
.block{
  width: 65%;
}

.el-card__body{
  position: relative;
}
</style>
