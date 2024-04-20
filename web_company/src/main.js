import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'// 引入element-plus
import 'element-plus/dist/index.css'// 引入组件库的样式


createApp(App).
use(ElementPlus)
.use(store)
.use(router)
.mount('#app')