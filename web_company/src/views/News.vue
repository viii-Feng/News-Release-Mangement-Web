<!-- 新闻页面 -->
<template>
  <div class="container">
    <div
      class="news-header"
      :style="{
        backgroundImage: `url(${require('@/assets/newsbg.jpg')})`,
      }"
    >
    <div class="newsHeader-text">
       <h1>新闻资讯</h1>
       <p>为您推荐公司及行业的前途咨询，让您随时了解行业动态！</p>
    </div>
  </div>

    <!-- 搜索区域 -->
    <div class="search">
      <el-popover
        placement="bottom"
        title="检索结果"
        width="50%"
        :visible="visible"
      >
        <template #reference>
          <el-input
            v-model="searchText"
            class="w-50 m-2"
            placeholder="请输入新闻关键字"
            :prefix-icon="Search"
            type="search"
            size="large"
            @input="visible = true"
            @blur="visible = false"
          />
        </template>
        <!-- 判断当前是否有该新闻 -->
        <div v-if="searchnewslist.length">
          <div
            v-for="data in searchnewslist"
            :key="data._id"
            class="search-item"
            @click="handleChangepage(data._id)"
          >
            {{ data.title }}
          </div>
        </div>
        <!-- 若无搜索结果则展示以下页面 -->
        <div v-else>
          <el-empty description="暂无新闻" :image-size="50" />
        </div>
      </el-popover>
    </div>
    <!-- 顶部展示四篇新闻(最新),使用栅格组件 -->
    <div class="topnews">
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in topNewsList" :key="item._id">
          <el-card :body-style="{ padding: '0px' }" shadow="hover" @click="handleChangepage(item._id)">
            <div
              class="image"
              :style="{
                backgroundImage: `url(http://localhost:3000${item.cover})`,
              }"
            ></div>
            <div style="padding: 14px">
              <span>{{ item.title }}</span>
              <div class="bottom">
                <time class="time">{{ whichTime(item.editTime) }}</time>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 新闻选项卡功能(tags组件) -->
    <el-tabs style="margin: 20px" v-model="whichTab" class="demo-tabs">
      <!-- 选项选择 -->
      <el-tab-pane
        :key="item.name"
        v-for="item in tablist"
        :label="item.label"
        :name="item.name"
      >
        <el-row :gutter="20">
          <el-col :span="18">
            <!-- 展示对应分类对应的新闻数据 -->
            <div
              v-for="data in tabnews[item.name]"
              :key="data._id"
              style="padding: 10px"
            >
              <!-- 选项卡 -->
              <el-card
                :body-style="{ padding: '0px' }"
                shadow="hover"
                @click="handleChangepage(data._id)"
              >
                <!-- 新闻封面 -->
                <div
                  class="tab-image"
                  :style="{
                    backgroundImage: `url(http://localhost:3000${data.cover})`,
                  }"
                ></div>
                <!-- 新闻内容 -->
                <div style="padding: 14px; float: left">
                  <span>{{ data.title }}</span>
                  <div class="bottom">
                    <time class="tab-time">{{ whichTime(data.editTime) }}</time>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
          <!-- 时间线组件(展示新闻的创建顺序) -->
          <el-col :span="6">
            <el-timeline>
              <el-timeline-item
                v-for="(data, index) in tabnews[item.name]"
                :key="index"
                :timestamp="whichTime(data.editTime)"
              >
                {{ data.title }}
              </el-timeline-item>
            </el-timeline>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!-- 返回顶部按钮 -->
    <el-backtop :visibility-height="100" />
  </div>
</template>
<script setup>
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted, computed } from "vue";
import {useRouter} from 'vue-router'
import moment from "moment";
import axios from "axios";
import _ from "lodash";// 根据某一个字段进行分类的库
const router = useRouter()// 引入全局路由

moment.locale("zh-cn"); // 设置中国时区显示时间
const searchText = ref(""); // 搜索关键字
const visible = ref(false); // 默认搜索结果不展示(每次输入就展示)
const newlist = ref([]); // 新闻列表
const whichTab = ref(1);// 新闻选项卡响应式绑定,默认值为1

// 新闻选项卡分类
const tablist = [
  {
    label: "最新动态",
    name: 1
  },
  {
    label: "产品预告",
    name: 2
  },
  {
    label: "通知公告",
    name: 3
  }
];

// 根据新闻数据中的category属性进行分类
const tabnews = computed(() => _.groupBy(newlist.value, item => item.category));

// 点击对应的新闻选项卡进行新闻详情的跳转(携带新闻的id,其实就是新闻的名字)
const handleChangepage = (id)=>{
    console.log('对应的新闻id',id)
    router.push(`/news/${id}`)
}

onMounted(async () => {
  // 获取已经发布了的新闻
  var res = await axios.get("/webapi/news/list");
  console.log("已经发布了的新闻数据", res.data);
  newlist.value = res.data.data; // 将获取过来已发布的新闻数据赋值给响应式的新闻数组
});

// 筛选搜索关键字(筛选新闻数组)
const searchnewslist = computed(
  () =>
    searchText.value
      ? newlist.value.filter((item) => item.title.includes(searchText.value))
      : [] // 判断输入框中是否有数据
);

// 顶部取四篇新闻
const topNewsList = computed(() => newlist.value.slice(0, 4));

// 设置时间校准
const whichTime = (time) => {
  // 快捷设置,将时间设置成时分秒形式返回
  return moment(time).format("lll");
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
}

.news-header {
  width: 100%;
  height: 400px;
  background-size: cover;
}
.newsHeader-text{
  color:white;
  position: absolute;
  top: 80px;
  width: 100%;
  text-align: center;
  h1{
    font-size: 90px;
    letter-spacing:9px;
  }
  p{
    font-size: 20px;
  }
  
}
.search {
  position: absolute;
  top: 280px;
  width: 100%;
  text-align: center;
  .el-input {
    width: 60%;
  }
}

.search-item {
  height: 50px;
  line-height: 50px;
  &:hover {
    background: whitesmoke;
    color: skyblue;
  }
}

.topnews {
  margin: 20px;
  .image {
    width: 100%;
    height: 150px;
    background-size: cover;
  }
  .time {
    font-size: 13px;
    color: gray;
  }
}

// 选项卡样式
.tab-image {// 选项卡新闻封面
  width: 150px;
  height: 100px;
  background-size: cover;
  float: left;
}
.tab-time { // 选项卡新闻时间
  font-size: 13px;
  color: gray;
}
</style>
