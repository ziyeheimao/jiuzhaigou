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
          <el-button @click="reset">重置</el-button>
        </div>
      </div>

      <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth" :inline='true'>
        <el-form-item label="预约人/单位:" prop="">
          <el-input style="width: 260px;" v-model="form.name" placeholder="请输入预约人/单位"></el-input>
        </el-form-item>

        <el-form-item label="证件类型:" prop="">
          <el-select style="width: 260px;" v-model="form.idCardType">
            <el-option v-for="(v,k) in res.idCardType" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="证件号码:" prop="">
          <el-input style="width: 260px;" v-model="form.idCard" :disabled="!form.idCardType" placeholder="请输入证件号码">
            <el-button slot="append">读卡</el-button><!-- icon="el-icon-search" -->
          </el-input>
        </el-form-item>

        <el-form-item label="预约编码:" prop="">
          <el-input style="width: 260px;" v-model="form.yuyue" placeholder="请输入预约编码"></el-input>
        </el-form-item>

        <el-form-item label="事项名称:" prop="">
          <el-input style="width: 260px;" v-model="form.name" placeholder="请输入事项名称"></el-input>
        </el-form-item>

        <el-form-item label="所属部门:" prop="">
          <el-select style="width: 260px;" v-model="form.idCardType">
            <el-option label="请选择所属部门" value=""></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="申请时间:" prop="">
          <el-select style="width: 260px;" v-model="form.idCardType">
            <el-option label="请选择申请时间范围" value=""></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="事项类型:" prop="">
          <el-checkbox-group v-model="form.itemTypeItem">
            <el-checkbox v-for="(v,k) in res.itemTypeItem" :key="k" :label="v"></el-checkbox>
          </el-checkbox-group>
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

      <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全 部" name="-1"></el-tab-pane>
        <el-tab-pane label="草稿" name="0"></el-tab-pane>
        <el-tab-pane label="受理中" name="1"></el-tab-pane>
        <el-tab-pane label="驳回修改" name="2"></el-tab-pane>
        <el-tab-pane label="办理成功" name="3"></el-tab-pane>
        <el-tab-pane label="办理失败" name="4"></el-tab-pane>
      </el-tabs>

      <div class="bom">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column align='center' prop="a" label="办件编号"></el-table-column>
          <el-table-column align='center' prop="b" label="申请人/单位"></el-table-column>
          <el-table-column align='center' prop="c" label="申请事项"></el-table-column><!-- :formatter='tableFilter' -->
          <el-table-column align='center' prop="d" label="事项类型"></el-table-column>
          <el-table-column align='center' prop="e" label="证件类型"></el-table-column>
          <el-table-column align='center' prop="f" label="证件号"></el-table-column>
          <el-table-column align='center' prop="g" label="申请渠道"></el-table-column>
          <el-table-column align='center' prop="h" label="当前节点"></el-table-column>
          <el-table-column align='center' prop="i" label="申请时间"></el-table-column>
          <el-table-column align='center' prop="j" label="申请状态"></el-table-column>

          <el-table-column align='center' :formatter='tableFilter' label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="tableClick(0, scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="tableClick(1, scope.row)">受理</el-button>
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
// import { notNullClone } from '@/utils'

export default {
  components: {},
  // props: [''],
  computed: {},
  data () {
    return {
      activeName: '-1',
      labelWidth: '150px',
      tableSelect: [], // 表格多选
      pageCount: 0,
      form: {
        name: '', // 事项名称
        status: '', // 状态
        idCard: '',
        idCardType: '',
        itemTypeItem: [],
        page: 1,
        limit: 10
      },
      rules: {},
      res: {
        idCardType: [ // 证件类型
          {value: '', label: '请选择证件类型'}
          // {value: 1, label: '统一社会信用代码'},
          // {value: 2, label: '组织机构代码'},
          // {value: 3, label: '工商登记号(营业执照)'},
          // {value: 4, label: '事业单位法人证书'},
          // {value: 5, label: '社会团体法人登记证书'},
          // {value: 6, label: '党政机关法人(无证书)'},
          // {value: 7, label: '其他单位证照'},
          // {value: 8, label: '居民身份证'},
          // {value: 9, label: '临时身份证'},
          // {value: 10, label: '户口簿'},
          // {value: 11, label: '中国人民解放军军官证'},
          // {value: 12, label: '中国人民武装警察部队警官证'},
          // {value: 13, label: '出生医学证明'},
          // {value: 14, label: '中国人民解放军士兵证'},
          // {value: 15, label: '中国人民武装警部队士兵证'},
          // {value: 16, label: '外加护照'},
          // {value: 17, label: '公务护照'},
          // {value: 18, label: '公务普通护照'},
          // {value: 19, label: '普通护照'},
          // {value: 20, label: '旅行证'},
          // {value: 21, label: '出入境通行证'},
          // {value: 22, label: '外国人出入境通行证'},
          // {value: 23, label: '外国人旅行证'},
          // {value: 24, label: '海员证'},
          // {value: 25, label: '香港特别行政区护照'},
          // {value: 26, label: '澳门特别行政区护照'},
          // {value: 27, label: '台湾居民来往大陆通信证(多次有效)'},
          // {value: 28, label: '台湾居民来往大陆通信证(一次有效)'},
          // {value: 29, label: '往来港澳通行证'},
          // {value: 30, label: '前往港澳通行证'},
          // {value: 31, label: '港澳居民来往内地通行证'},
          // {value: 32, label: '往来台湾通行证'},
          // {value: 33, label: '因公往来香港澳门特别行政区通行证'},
          // {value: 34, label: '台湾居民定居证'},
          // {value: 35, label: '外国人永久居留证'},
          // {value: 36, label: '外国人居留证或拘留许可证'},
          // {value: 37, label: '外国人临时居留证'},
          // {value: 38, label: '入籍证书'},
          // {value: 39, label: '退籍证书'},
          // {value: 40, label: '复籍证书'}
        ],
        itemType: [], // 事项类型
        itemTypeItem: []// 事项类型项
      },
      tableData: [
        {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10}
      ]
    }
  },
  methods: {
    init () {
      this.$api.sysDictSelectItemsByDictType({dictType: 'idCardType'}).then(res => { // 证件类型
        if (res.code === 0) {
          for (let i of res.bean) {
            this.res.idCardType.push({value: i.sortNo, label: i.dictItemName})
          }
        }
      })

      this.$api.sysDictSelectItemsByDictType({dictType: 'itemType'}).then(res => { // itemType 事项类型
        if (res.code === 0) {
          for (let i of res.bean) {
            this.res.itemType.push({value: i.sortNo, label: i.dictItemName})
            this.res.itemTypeItem.push(i.dictItemName)
            this.form.itemTypeItem.push(i.dictItemName)
          }
        }
      })
    },

    // 表格过滤
    tableFilter (row, col, cellValue, index) {
      if (col.property === 'editStatus') {
        if (cellValue === 1 || cellValue === '1') return '草稿'
        if (cellValue === 2 || cellValue === '2') return '已停用'
        if (cellValue === 3 || cellValue === '3') return '已启用'
        if (cellValue === 4 || cellValue === '4') return '已废止'
        if (cellValue === 5 || cellValue === '5') return '上报中'
        if (cellValue === 6 || cellValue === '6') return '申请启用中'
        if (cellValue === 7 || cellValue === '7') return '申请停用中'
        if (cellValue === 8 || cellValue === '8') return '申请变更中'
        if (cellValue === 9 || cellValue === '9') return '申请废止中'
        return cellValue
      }

      if (col.property === 'department') {
        if (cellValue === 1 || cellValue === '1') return '经济'
        if (cellValue === 2 || cellValue === '2') return '教育'
        if (cellValue === 3 || cellValue === '3') return '科学'
        if (cellValue === 4 || cellValue === '4') return '宗教'
        if (cellValue === 5 || cellValue === '5') return '公安'
        if (cellValue === 6 || cellValue === '6') return '民政'
        if (cellValue === 7 || cellValue === '7') return '司法'
        if (cellValue === 8 || cellValue === '8') return '财政'
        if (cellValue === 9 || cellValue === '9') return '人事'
        if (cellValue === 10 || cellValue === '10') return '国土'
        if (cellValue === 11 || cellValue === '11') return '环境'
        if (cellValue === 12 || cellValue === '12') return '交通'
        if (cellValue === 13 || cellValue === '13') return '水利'
        if (cellValue === 14 || cellValue === '14') return '农业'
        if (cellValue === 15 || cellValue === '15') return '林业'
        if (cellValue === 16 || cellValue === '16') return '商务'
        if (cellValue === 17 || cellValue === '17') return '文化'
        if (cellValue === 18 || cellValue === '18') return '卫生'
        if (cellValue === 19 || cellValue === '19') return '审计'
        if (cellValue === 20 || cellValue === '20') return '税务'
        if (cellValue === 21 || cellValue === '21') return '工商'
        if (cellValue === 22 || cellValue === '22') return '质检'
        if (cellValue === 23 || cellValue === '23') return '药检'
        if (cellValue === 24 || cellValue === '24') return '新闻'
        if (cellValue === 25 || cellValue === '25') return '体育'
        if (cellValue === 26 || cellValue === '26') return '统计'
        if (cellValue === 27 || cellValue === '27') return '旅游'
        if (cellValue === 28 || cellValue === '28') return '国防'
        if (cellValue === 29 || cellValue === '29') return '档案'
        if (cellValue === 30 || cellValue === '30') return '气象'
        if (cellValue === 31 || cellValue === '31') return '通信'
        if (cellValue === 32 || cellValue === '32') return '烟草'
        if (cellValue === 33 || cellValue === '33') return '其他'
        return cellValue
      }

      if (col.property === 'industry') {
        if (cellValue === 1 || cellValue === '1') return '经济'
        if (cellValue === 2 || cellValue === '2') return '教育'
        if (cellValue === 3 || cellValue === '3') return '科学'
        if (cellValue === 4 || cellValue === '4') return '宗教'
        if (cellValue === 5 || cellValue === '5') return '公安'
        if (cellValue === 6 || cellValue === '6') return '民政'
        if (cellValue === 7 || cellValue === '7') return '司法'
        if (cellValue === 8 || cellValue === '8') return '财政'
        if (cellValue === 9 || cellValue === '9') return '人事'
        if (cellValue === 10 || cellValue === '10') return '国土'
        if (cellValue === 11 || cellValue === '11') return '环境'
        if (cellValue === 12 || cellValue === '12') return '交通'
        if (cellValue === 13 || cellValue === '13') return '水利'
        if (cellValue === 14 || cellValue === '14') return '农业'
        if (cellValue === 15 || cellValue === '15') return '林业'
        if (cellValue === 16 || cellValue === '16') return '商务'
        if (cellValue === 17 || cellValue === '17') return '文化'
        if (cellValue === 18 || cellValue === '18') return '卫生'
        if (cellValue === 19 || cellValue === '19') return '审计'
        if (cellValue === 20 || cellValue === '20') return '税务'
        if (cellValue === 21 || cellValue === '21') return '工商'
        if (cellValue === 22 || cellValue === '22') return '质检'
        if (cellValue === 23 || cellValue === '23') return '药检'
        if (cellValue === 24 || cellValue === '24') return '新闻'
        if (cellValue === 25 || cellValue === '25') return '体育'
        if (cellValue === 26 || cellValue === '26') return '统计'
        if (cellValue === 27 || cellValue === '27') return '旅游'
        if (cellValue === 28 || cellValue === '28') return '国防'
        if (cellValue === 29 || cellValue === '29') return '档案'
        if (cellValue === 30 || cellValue === '30') return '气象'
        if (cellValue === 31 || cellValue === '31') return '通信'
        if (cellValue === 32 || cellValue === '32') return '烟草'
        if (cellValue === 33 || cellValue === '33') return '其他'
        return cellValue
      }

      if (col.property === 'workType') {
        if (cellValue === 1 || cellValue === '1') return '行政许可'
        if (cellValue === 2 || cellValue === '2') return '行政处罚'
        if (cellValue === 3 || cellValue === '3') return '行政强制'
        if (cellValue === 4 || cellValue === '4') return '行政裁决'
        if (cellValue === 5 || cellValue === '5') return '行政确认'
        if (cellValue === 6 || cellValue === '6') return '行政给付'
        if (cellValue === 7 || cellValue === '7') return '行政奖励'
        if (cellValue === 8 || cellValue === '8') return '行政检查'
        if (cellValue === 9 || cellValue === '9') return '其他行政权力'
        if (cellValue === 10 || cellValue === '10') return '其他群众事项'
        return cellValue
      }
    },
    handleClick (tab, event) {
      let i = Number(tab.name)
      if (i === -1) {
        this.form.status = ''
      } else {
        this.form.status = i
      }
      this.search()
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
    handleSelectionChange (val) {
      this.tableSelect = val
    },

    // 表格按钮点击
    tableClick (type, row) {
      console.log(row)
      switch (type) {
        case 0: // 查看
          this.$router.push({name: 'applicationOfficeDetail', query: row})
          break
        case 1: // 受理
          row.upData = true
          this.$router.push({name: 'applicationOfficeDetail', query: row})
          break
        case 2: // 驳回

          break
        case 3: // 不通过

          break
      }
    },

    search () {
      // let req = notNullClone(this.form)
      // req.editStatus = JSON.parse(JSON.stringify(req.editStatus))
      // if (req.editStatus.length === 0) delete req.editStatus
      // else {
      //   for (let i = 0; i < req.editStatus.length; i++) {
      //     if (req.editStatus[i] === '上报') req.editStatus[i] = 1
      //     if (req.editStatus[i] === '申请启用') req.editStatus[i] = 4
      //     if (req.editStatus[i] === '申请停用') req.editStatus[i] = 5
      //     if (req.editStatus[i] === '申请变更') req.editStatus[i] = 3
      //     if (req.editStatus[i] === '申请废止') req.editStatus[i] = 9
      //   }
      //   req.editStatus = req.editStatus.toString()
      // }

      // this.$api.workAuditPage(req).then(res => {
      //   if (res.code === 0) {
      //     this.pageCount = res.bean.totalCount
      //     this.tableData = res.bean.list
      //   }
      // })
    },

    // 重置
    reset () {
      this.form = {
        name: '', // 事项名称
        status: '', // 状态
        idCard: '',
        idCardType: '',
        itemTypeItem: [],
        page: 1,
        limit: 10
      }
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
    .tabs{
      margin: 0 20px;
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
