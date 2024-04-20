<template>
  <!-- 组件库的布局容器设置 -->
  <el-container class="container">
    <!-- 侧边栏 -->
    <SideMenu />
    <el-container direction="vertical">
      <TopHeader />
      <!-- 顶部区域 -->
      
      <!-- 内容主题区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import TopHeader from "../components/mainbox/TopHeader";
import SideMenu from "../components/mainbox/SideMenu";

</script>
<style lang="scss" scoped >
  .container {
  height: 100vh;
  overflow: auto;
}
</style>