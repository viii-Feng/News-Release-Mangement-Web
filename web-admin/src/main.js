import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'// 引入element-plus组件库
import 'element-plus/dist/index.css'// 引入样式
import Particles from "particles.vue3";// 粒子库(登录页面)
import '../util/axios.config.js'// 引入拦截器(请求拦截器和响应拦截器)

createApp(App)
.use(Particles)
.use(ElementPlus)
.use(store)
.use(router)
.mount('#app')
