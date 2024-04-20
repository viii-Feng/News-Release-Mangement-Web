<!-- 新闻详情页面 -->
<template>
  <div>
    <el-row>
      <!-- 左边新闻对应id的新闻主体 -->
      <el-col :span="17" :offset="1">
        <div>
          <!-- 新闻标题 -->
          <h2>{{ currentNews.title }}</h2>
          <!-- 发布时间 -->
          <div class="time">
            {{ whichTime(currentNews.editTime) }}
          </div>
          <!-- 星号分界线 -->
          <el-divider>
            <el-icon>
              <star-filled />
            </el-icon>
          </el-divider>
          <!-- 新闻主体内容(使用v-html渲染新闻内容) -->
          <div v-html="currentNews.content"></div>
        </div>
      </el-col>
      <!-- 右边热点新闻区域 -->
      <el-col :span="5" :offset="1" :pull="1" style="overflow: visible;">
        <el-card class="box-card" style="position: sticky ;top:59px">
          <template #header>
            <div class="card-header">
              <span style="font-size: 16px; font-weight: bold">最近新闻</span>
            </div>
          </template>
          <!-- 最近的新闻列表(点击跳转对应的新闻详情页) -->
          <div
            v-for="item in topNews"
            :key="item._id"
            class="text item"
            style="padding: 14px"
            @click="handleChange(item._id)"
          >
            <span>{{ item.title }}</span>
            <div class="bottom">
              <time class="time">{{ whichTime(item.editTime) }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div>
      <!-- 返回顶部区域组件 -->
      <el-backtop :visibility-height="100" />
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onBeforeUnmount } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import { StarFilled } from "@element-plus/icons-vue";

moment.locale("zh-cn");

const route = useRoute();
const router = useRouter();
const currentNews = ref({});// 当前id的新闻数据(新闻内容)
const topNews = ref([]);// 右边最新的新闻数据(6条)

// [重点]设置监听函数,监听路由url上的id参数
/*
    在Vue中,组件间路由的跳转是会触发组件的生命周期走一遍的,但是如果是当前组件
    跳转回当前组件就不会触发生命周期重新走一遍了(在新闻详情页点击右边新闻再次跳转
    回当前的新闻详情页),那么此时如果你的网络请求放在onMounted上面执行就会出现问题了
    (无法再次促发onMounted来获取数据),不仅如此,使用watch属性还需要结合onBeforeUnmount
    来使用,因为在这种情况下,我们在跳转到非当前组件的时候,同样会触发watch属性,此时当我们跳转
    到首页时,同样会发送请求对应新闻id的网络请求,但是此时路由url上是没有id的,即undefined,
    那么此时后端接收到undefined默认将其装换成字符串就会报错!,解决办法就是在组件迹象销毁时取消
    watch属性的监听
*/ 
const stop = watchEffect(async () => {
//   console.log("路由url上面的新闻id:", route.params.id);
  if (!route.params.id) return;// 判断当前路由url上是否有新闻的id参数
  const res1 = await axios.get(`/webapi/news/list/${route.params.id}`); // 获取对应的新闻id
  const res2 = await axios.get(`/webapi/news/toplist?limit=6`);// 获取最近的四条新闻数据
//   console.log("主体新闻数据:", res1.data.data);
  currentNews.value = res1.data.data[0]; // 将新闻数据赋值到响应式数据中
  topNews.value = res2.data.data;
});

/*
    [重点]组件销毁时,取消watch属性的监听路由url上的新闻id参数
*/ 
onBeforeUnmount(() => {
  console.log("组件即将销毁!");
  stop();// 取消watch属性的监听
});

// 将新闻的发布时间校准成中国时区的时间
const whichTime = (time) => {
  return moment(time).format("lll");
};

// 右边最新新闻数据,点击跳转到对应的新闻详情页
const handleChange = (id) => {
  // console.log(id)
  router.push(`/news/${id}`);
};
</script>

<style scoped lang="scss">
.el-row {
  margin-top: 30px;
}

.time {
  font-size: 13px;
  color: gray;
}
::v-deep.el-col div img{
  width:100%;
}
</style>
