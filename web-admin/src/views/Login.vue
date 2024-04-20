<template>
  <div>
    <!-- 配置粒子展示 -->
      <Particles
          id="tsparticles"
          :particlesInit="particlesInit"
          :options="options"
      />

      <!-- 登录表单验证 -->
      <div class="formContainer">
          <h3>企业门户网站后台管理系统</h3>
          <el-form
              ref="loginFormRef"
              :model="loginForm"
              status-icon
              :rules="loginRules"
              label-width="80px"
              class="loginform"
          >
              <el-form-item
                  label="用户名"
                  prop="username"
              >
                  <el-input
                      v-model="loginForm.username"

                      autocomplete="off"
                  />
              </el-form-item>
              <el-form-item
                  label="密码"
                  prop="password"
              >
                  <el-input
                      v-model="loginForm.password"
                      type="password"
                      autocomplete="off"
                  />
              </el-form-item>
              <el-form-item>
                  <el-button
                      type="primary"
                      @click="submitForm()"
                  >登录</el-button>  
              </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script setup>
import {reactive,ref} from 'vue'
import {useRouter} from 'vue-router'
import { loadFull } from "tsparticles"
import axios from 'axios'// 引入axios
import { ElMessage } from 'element-plus'//消息提醒框
import {useStore } from 'vuex' // 引入全局store

const store = useStore()

// 表单绑定的响应式对象
const loginForm = reactive({
  username:"",
  password:""
})
const loginFormRef = ref() //表单的引用对象

// 配置表单的验证规则
const loginRules = reactive({
  username:[// 用户名
    {
      // 必须填入,表单提示,触发方式:失去焦点(判断是否通过表单验证)
      required:true,message:"请输入用户名",trigger:"blur"
    }
  ],
  password:[// 密码
    {
      required:true,message:"请输入密码",trigger:"blur"
    }
  ]
})

// 引入路由
const router = useRouter()
//提交表单函数
const submitForm = ()=>{
  //1. 校验表单(获取输入的表单数据)[validate为elementPlus中表单验证内置方法]
  loginFormRef.value.validate((valid)=>{
      console.log('判断输入的数据是否通过表单校验:',valid)// 手动校验表单是否有值
      if(valid){
          console.log('成功获取到表单内容:',loginForm)
          axios.post('/adminapi/user/login',loginForm).then(res=>{
            console.log(res.data);
            // 登录校验
            if(res.data.ActionType === 'OK'){
              // console.log('返回的用户数据',res.data.data);
              store.commit("changeUserInfo",res.data.data)// 将用户信息保存到vuex中
              store.commit("changeGetterRouter",false)
              router.push("/index")//路由跳转
              // localStorage.setItem("token", "lam");//色湖之token
            }else{
              ElMessage.error('用户名和密码不匹配')
            }
          })
      }
  })
  //2. 拿到表单内容,提交后台

  //3. 设置token
  // localStorage.setItem("token", "lam");
}
//配置particles(粒子)
const options = {
  background: {
    color: {
      value: "#2d3a4b"
    }
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push"
      },
      onHover: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40
      },
      push: {
        quantity: 4
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: "#66CCFF"
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1
    },
    collisions: {
      enable: true
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 6,
      straight: false
    },
    number: {
      density: {
        enable: true,
        area: 800
      },
      value: 80
    },
    opacity: {
      value: 0.5
    },
    shape: {
      type: "circle"
    },
    size: {
      random: true,
      value: 5
    }
  },
  detectRetina: true
};

// 配置粒子变换函数
const particlesInit = async (engine) => {
    await loadFull(engine)
}
</script>

<style lang="scss" scoped>
.formContainer{
  width: 500px;
  height: 300px;
  position: fixed;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  background:rgba($color: #000000, $alpha: 0.5);
  color:white;
  text-align: center;
  padding:20px;

  h3{
      font-size: 30px;
  }
  .loginform{
      margin-top: 20px;
  }
}

// 设置深度选择(选择唯一属性,修改样式)
::v-deep .el-form-item__label{
  color:white;
}
</style>    
