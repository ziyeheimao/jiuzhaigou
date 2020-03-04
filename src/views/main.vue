<template>
  <el-container class="ctn" :style="'height:' + InnerSize.height + 'px;'">
    <el-header>
      <div class="logo">九寨沟政务服务信息化平台</div>
      <el-menu class="el-menu-demo" style="width: calc(100% - 450px);"
        :default-active="'1'" mode="horizontal" @select="handleSelect"
        background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item v-for='(v,k) in topMenu' :key="k" :index="v.value">{{v.name}}</el-menu-item>
      </el-menu>

      <div class="avatar">
        <el-avatar :size="35" :src="circleUrl"></el-avatar>
        <output>{{userName}}</output>

        <ul>
          <!-- <li>
            <el-button size='mini'>用户中心</el-button>
          </li> -->
          <li>
            <el-button size='small' @click="quit">安全退出</el-button>
          </li>
        </ul>
      </div>
    </el-header>

    <el-container>
      <el-aside class="nav" width="300px" v-if='leftMenu[(topMenuActive-1)].length !== 0'>
        <div class="title">政务服务事项动态管理系统</div>
        <el-menu class="el-menu-demo"
          :default-active="'1-1'" mode="vertical" @select="handleSelect"
          background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">

          <el-submenu :index="k+1+''" v-for="(v,k) in leftMenu[(topMenuActive-1)]" :key="k">
            <template slot="title">{{v.name}}</template>
              <el-menu-item :index="k+1+'-'+(kk+1)" v-for="(vv,kk) in v.children" :key="kk">{{vv.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
          <el-tab-pane v-for="(item, k) in editableTabs" :key="k" :label="item.title" :name="item.name">
            {{item.content}}
          </el-tab-pane>
        </el-tabs>

        <div class="ctn">
          <!-- <keep-alive> -->
            <router-view />
          <!-- </keep-alive> -->
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  // props: [''],
  computed: {
    InnerSize () {
      return this.$store.state.common.InnerSize
    }
  },
  data () {
    return {
      userName: '',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      topMenu: [ // 顶栏数据
        // { value: '1', name: '首页', url: 'index' },
        // { value: '2', name: '事项管理系统' },
        // { value: '3', name: '通用审批系统' },
        // { value: '4', name: '一窗综合受理系统' },
        // { value: '5', name: '电子监察系统' },
        // { value: '6', name: '门户网站后台' },
        // { value: '7', name: '政务云' },
        // { value: '8', name: '系统管理' }
      ],
      topMenuActive: '1', // 顶栏激活项
      leftMenuActive: '1-1', // 侧栏激活项

      leftMenu: [ // 左栏数据
        [],
        [
          { name: '事项清单管理', children: [ { name: '事项清单管理', url: 'listMattersAdmin' } ] },
          { name: '事项审批管理', children: [ { name: '事项审批管理', url: 'mattersApproval' } ] },
          { name: '工作流管理', children: [ { name: '工作流管理', url: 'workflow' } ] },
          { name: '表单管理', children: [ { name: '表单管理', url: 'formAdmin' }, { name: '控件组管理', url: 'controlGroupAdmin' } ] }
        ],
        [
          { name: '2事项清单管理', children: [ { name: '2事项清单管理', url: 7 } ] },
          { name: '2事项审批管理', children: [ { name: '2事项审批管理', url: 8 } ] },
          { name: '2工作流管理', children: [ { name: '2工作流管理', url: 9 } ] },
          { name: '2表单管理', children: [ { name: '2表单管理', url: 10 }, { name: '2控件组管理', url: 11 } ] }
        ],
        [
          { name: '3事项清单管理', children: [ { name: '3事项清单管理', url: 12 } ] },
          { name: '3事项审批管理', children: [ { name: '3事项审批管理', url: 13 } ] },
          { name: '3工作流管理', children: [ { name: '3工作流管理', url: 14 } ] },
          { name: '3表单管理', children: [ { name: '3表单管理', url: 15 }, { name: '3控件组管理', url: 16 } ] }
        ],
        [
          { name: '4事项清单管理', children: [ { name: '4事项清单管理', url: 17 } ] },
          { name: '4事项审批管理', children: [ { name: '4事项审批管理', url: 18 } ] },
          { name: '4工作流管理', children: [ { name: '4工作流管理', url: 19 } ] },
          { name: '4表单管理', children: [ { name: '4表单管理', url: 20 }, { name: '4控件组管理', url: 21 } ] }
        ],
        [
          { name: '5事项清单管理', children: [ { name: '5事项清单管理', url: 22 } ] },
          { name: '5事项审批管理', children: [ { name: '5事项审批管理', url: 23 } ] },
          { name: '5工作流管理', children: [ { name: '5工作流管理', url: 24 } ] },
          { name: '5表单管理', children: [ { name: '5表单管理', url: 25 }, { name: '5控件组管理', url: 26 } ] }
        ],
        [
          { name: '6事项清单管理', children: [ { name: '6事项清单管理', url: 27 } ] },
          { name: '6事项审批管理', children: [ { name: '6事项审批管理', url: 28 } ] },
          { name: '6工作流管理', children: [ { name: '6工作流管理', url: 29 } ] },
          { name: '6表单管理', children: [ { name: '6表单管理', url: 30 }, { name: '6控件组管理', url: 31 } ] }
        ],
        [
          { name: '7事项清单管理', children: [ { name: '7事项清单管理', url: 32 } ] },
          { name: '7事项审批管理', children: [ { name: '7事项审批管理', url: 33 } ] },
          { name: '7工作流管理', children: [ { name: '7工作流管理', url: 34 } ] },
          { name: '7表单管理', children: [ { name: '7表单管理', url: 35 }, { name: '7控件组管理', url: 36 } ] }
        ]
      ],

      // 动态标签
      editableTabsValue: '首页',
      editableTabs: JSON.parse(window.sessionStorage.getItem('editableTabs')) || [{title: '首页', name: '首页', content: '', url: 'index'}]
    }
  },
  methods: {
    quit () {
      this.$router.push({name: 'login'})
    },
    // 顶栏侧栏钩子
    handleSelect (key, keyPath) {
      if (keyPath.length === 1) {
        this.topMenuActive = key
        if (this.leftMenu[this.topMenuActive - 1].length === 0) {
          let url = this.topMenu[this.topMenuActive - 1].url
          let name = this.topMenu[this.topMenuActive - 1].name
          this.isExist(name, url)
        }
      } else if (keyPath.length === 2) {
        this.leftMenuActive = keyPath[1]
        let arr = keyPath[1].split('-')
        let url = this.leftMenu[this.topMenuActive - 1][arr[0] - 1].children[arr[1] - 1].url
        let name = this.leftMenu[this.topMenuActive - 1][arr[0] - 1].children[arr[1] - 1].name
        this.isExist(name, url)
      }
    },
    // 判断该标签是否已存在
    isExist (name, url) {
      for (let i of this.editableTabs) {
        if (i.name === name) {
          this.editableTabsValue = name
          return
        }
      }
      this.addTab(name, url)
    },

    // 添加标签
    addTab (name, url) {
      this.editableTabs.push({
        title: name,
        name,
        content: '',
        url
      })
      this.editableTabsValue = name
    },
    // 移除标签
    removeTab (name) {
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].name === name) {
          this.editableTabs.splice(i, 1)
          break
        }
      }
      try {
        this.editableTabsValue = this.editableTabs[this.editableTabs.length - 1].name
      } catch (err) {
        this.editableTabsValue = ''
      }
    },

    init () {
      let arrAll = JSON.parse(window.sessionStorage.getItem('menuList')) || []

      // 顶栏
      this.topMenu = []
      for (let i = 0; i < arrAll.length; i++) {
        let obj = {}
        if (arrAll[i].url) obj = {value: i + 1 + '', name: arrAll[i].name, url: arrAll[i].url}
        else obj = {value: i + 1 + '', name: arrAll[i].name}
        this.topMenu.push(obj)
      }

      // 侧栏
      this.leftMenu = []
      for (let i of arrAll) {
        if (!i.list || i.list.length === 0) this.leftMenu.push([])
        else {
          let arr = []
          for (let k of i.list) {
            k.children = k.list
            delete k.list
            arr.push(k)
          }
          this.leftMenu.push(arr)
        }
      }
    }
  },
  beforeCreate () {},
  created () {
    this.userName = sessionStorage.getItem('userName')
    this.init()
  },
  beforeMount () {},
  mounted () {
    for (let i of this.editableTabs) {
      if (i.url === this.$route.name) {
        this.editableTabsValue = i.name
        break
      }
    }
    // this.topMenuActive = JSON.parse(window.sessionStorage.getItem('topMenuActive')) || '1'
    // this.leftMenuActive = JSON.parse(window.sessionStorage.getItem('leftMenuActive')) || '1-1'
    // console.log(this.topMenuActive, this.leftMenuActive)
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    // 页面跳转
    editableTabsValue () {
      window.sessionStorage.setItem('editableTabs', JSON.stringify(this.editableTabs)) // 缓存当前打开的标签
      // window.sessionStorage.setItem('topMenuActive', JSON.stringify(this.topMenuActive)) // 缓存顶栏激活项
      // window.sessionStorage.setItem('leftMenuActive', JSON.stringify(this.leftMenuActive)) // 缓存顶栏激活项

      if (!this.editableTabsValue) {
        this.$router.push({name: 'empty'})
        return
      }
      for (let i of this.editableTabs) {
        if (i.name === this.editableTabsValue) {
          // console.log(i.url)
          this.$router.push({name: i.url})
          return
        }
      }
    }
  }

}
</script>

<style lang='scss' scoped>
@import '../assets/scss/mixin.scss';
@import '../assets/scss/_variables.scss';
.el-menu.el-menu--horizontal,.el-menu--horizontal{
  border: none;
}
.ctn{
  .el-header{
    z-index: 2;
  }
  .el-container{
    z-index: 1;
  }
}
// 页头
.el-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  &>.el-menu,&>.logo,&>.avatar{
    background-color: $navbar--background-color;
    color: #fff;
    position: relative;
  }
  &>.avatar>ul{
    display: none;
    margin: 0;
    padding: 0;
    content: '';
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    &>li{
      margin: 0;
      padding: 5px;
      display: flex;
      justify-content: center;
    }
  }
  &>.avatar:hover ul{
    // outline: 1px solid red;
    display: block;
  }

  &>.logo{
    width: 250px;
    color: #fff;
    text-align: center;
    line-height: 60px;
    font-size: 18px;
  }
  &>.el-menu{}
  &>.avatar{
    height: 100%;
    width: 200px;
    @include fja(center, center);
    flex-direction: column;
    &>output{
      margin-top: 3px;
      font-size: 12px;
    }
  }
}
// 侧栏
.el-container{
  &>.nav{
    display: flex;
    flex-direction: column;
    &>.title{
      background-color: darken($navbar--background-color, 10%); // scss内置的颜色线性加深
      font-size: 16px;
      border-right-color:rgb(230, 230, 230);
      border-right-style:solid;
      border-right-width:1px;
      box-sizing:border-box;
      color: #fff;
      text-align: center;
      height: 60px;
      line-height: 60px;
    }
    .el-menu{
      flex: 1;
    }
  }
}
.ctn{
  // padding: 0 10px;
}
</style>
