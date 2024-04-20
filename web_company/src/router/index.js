import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'// 官网首页
import News from '../views/News.vue'// 新闻列表页
import New from '../views/New.vue'// 新闻详情页
import Product from '../views/Product.vue'// 产品页

import NProgress from 'nprogress'// 进度调样式模块
import 'nprogress/nprogress.css'
const routes = [
  {// 首页
    path: '/',
    name: 'home',
    component: Home
  },
  {// 新闻列表页
    path: '/news',
    name: 'news',
    component: News
  },
  {// 新闻详情页
    path: '/news/:id',
    name: 'new',
    component: New
  },
  {// 产品页
    path: '/product',
    name: 'product',
    component: Product
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
})

router.afterEach((to, from, next) => {
  NProgress.done();
  // next()
})


export default router
