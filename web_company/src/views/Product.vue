<!-- 产品页面 -->
<template>
  <div>
    <!-- 轮播图(走马灯),竖向 -->
    <el-carousel
      height="calc(100vh - 59px)"
      direction="vertical"
      :autoplay="true"
      interval="4000"
      v-if="looplist.length"
    >
      <!-- 轮播图item获取 -->
      <el-carousel-item v-for="item in looplist" :key="item._id">
        <div
          class="item"
          :style="{
            backgroundImage: `url(http://localhost:3000${item.cover})`,
          }"
        >
          <!-- 文字阐述 -->
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <h2>{{ item.title }}</h2>
              </div>
            </template>
            <div>{{ item.introduction }}</div>
            <div class="detail">{{ item.detail }}</div>

            <div class="more">
              更多信息，请访问：
              <br />
              <a href="https://baidu.com" class="myLink" target="_blank">官方网站</a>
            </div>
          </el-card>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- 保底页面 -->
    <el-empty description="暂无产品" v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
const looplist = ref([]);// 轮播图数据(响应式,默认值为空数组)

// 页面挂载获取产品数据
onMounted(async () => {
  // 获取产品数据
  const res = await axios.get("/webapi/product/list");
//   console.log('产品数据:',res);
  looplist.value = res.data.data;
});
</script>

<style scoped lang="scss">
.item {
  width: 100%;
  height: 100%;
  background-size: '100% 100%';
}

.box-card {
  width: 40%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  .detail,
  .more {
    margin-top: 20px;
  }
}

.myLink{
    display: block;
    margin-top: 20px;
    text-decoration: none;
    color: rgb(7, 127, 170);
    font-size: large;
    font-weight: 700;
}
</style>

