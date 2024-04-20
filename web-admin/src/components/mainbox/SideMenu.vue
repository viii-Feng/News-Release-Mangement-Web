<template>
    <!-- 侧边栏(通过Vuex中的标志为来判断宽度[展开还是折叠]) -->
  <el-aside :width="$store.state.isCollapsed ? '64px' : '240px'">
    <!-- 设置侧边栏的属性 -->
    <el-menu
      :collapse="$store.state.isCollapsed"
      :collapse-transition="false"
      :router="true"
      :default-active="route.fullPath"
    >
      <!-- 首页(单菜单) -->
      <el-menu-item index="/index">
        <el-icon><home-filled /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <!-- 个人中心(单菜单) -->
      <el-menu-item index="/center">
        <el-icon >
          <avatar />
        </el-icon>
        <span>个人中心</span>
      </el-menu-item>

      <!-- 用户管理(多级菜单,仅管理员可见,自己封装一个指令获取底层DOM) -->
      <el-sub-menu index="/user-manage" v-admin>
        <template #title>
          <el-icon>
            <user-filled />
          </el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user-manage/adduser">添加用户</el-menu-item>
        <el-menu-item index="/user-manage/userlist">用户列表</el-menu-item>
      </el-sub-menu>

      <!-- 新闻管理(多级菜单) -->
      <el-sub-menu index="/news-manage">
        <template #title>
          <el-icon>
            <message-box />
          </el-icon>
          <span>新闻管理</span>
        </template>
        <el-menu-item index="/news-manage/addnews">创建新闻</el-menu-item>
        <el-menu-item index="/news-manage/newslist">新闻列表</el-menu-item>
      </el-sub-menu>

      <!-- 产品管理(多级菜单) -->
      <el-sub-menu index="/product-manage">
        <template #title>
          <el-icon>
            <reading />
          </el-icon>
          <span >产品管理</span>
        </template>
        <el-menu-item index="/product-manage/addproduct">添加产品</el-menu-item>
        <el-menu-item index="/product-manage/productlist"
          >产品列表</el-menu-item
        >
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>
<script setup>
import { // 引入组件的图标
  HomeFilled,
  Avatar,
  UserFilled,
  MessageBox,
  Reading,
  Pointer,
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";// 引入全局router
import {useStore } from 'vuex'// 引入全局store
const store = useStore()
const route = useRoute();
// console.log('点击的选项跳转的路径:',route.fullPath)
const vAdmin = {
    mounted(el){
        // console.log('指令获取到的DOM',el)
        if(store.state.userInfo.role!==1){
            // 根据当前用户的角色类型来判断是否显示该DOM元素(管理员有权编辑用户)
            el.parentNode.removeChild(el)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-aside {
  height: 100vh;
  background: #001529;

  .el-menu {
    height: 100%;
    background: #001529;
    .el-icon{
      color:#CCCCCC;
    }
   .el-menu-item{
    background: #001529;
  color:#CCCCCC;
   }
   .el-sub-menu span{
    color:#CCCCCC;
   }

  }
}
</style>

