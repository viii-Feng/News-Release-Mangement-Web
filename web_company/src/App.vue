<template>
  <Navbar/>
  <router-view/>
</template>
<script setup>
import Navbar from '@/components/Navbar'// 引入导航栏组件
</script>

<style lang="scss">
// 全局样式
*{
  margin:0;
  padding:0
}

// 滚动调样式
::-webkit-scrollbar{
  width: 5px;
  height: 5px;
  position: absolute;
}

::-webkit-scrollbar-thumb{
  background:#1890ff;
}

::-webkit-scrollbar-track{
  background:#ddd;
}

</style>
