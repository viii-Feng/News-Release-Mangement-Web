<template>
  <!-- 个人中心 -->
  <div>
    <el-page-header content="个人中心" icon="" title="企业门户网站后台管理系统" />
    <el-row :gutter="20" class="el-row">
      <el-col :span="8">
        <el-card class="box-card">
          <el-avatar :size="100" :src="avatarUrl" />
          <h3>{{ store.state.userInfo.username }}</h3>
          <h5>{{ store.state.userInfo.role === 1 ? "管理员" : "编辑" }}</h5>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>

          <el-form
            ref="userFormRef"
            :model="userForm"
            :rules="userFormRules"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select
                v-model="userForm.gender"
                class="m-2"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="个人简介" prop="introduction">
              <el-input v-model="userForm.introduction" type="textarea" />
            </el-form-item>

            <el-form-item label="头像" prop="avatar">
              <Upload :avatar="userForm.avatar" @lamchange="handleChange" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm()">更新</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { computed, ref, reactive } from "vue";

import { ElMessage } from "element-plus";
import upload from "../../../util/upload.js";
import Upload from "../../components/upload/Upload";
const store = useStore();

// 显示头像(默认?数据库用户数据)
const avatarUrl = computed(() =>
  store.state.userInfo.avatar
    ? "http://localhost:3000" + store.state.userInfo.avatar
    : `https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png`
);

// 结构用户信息
const { username, gender, introduction, avatar } = store.state.userInfo;
const userFormRef = ref();
const userForm = reactive({
  username,
  gender,
  introduction,
  avatar,// 头像数据本地展示
  file: null,// 头像数据(提交后端真数据)
});

// 表单数据规则
const userFormRules = reactive({
  username: [{ required: true, message: "请输入名字", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
  introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }],
  avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
});
//性别选择
const options = [
  {
    label: "保密",
    value: 0,
  },
  {
    label: "男",
    value: 1,
  },
  {
    label: "女",
    value: 2,
  },
];

//每次选择完图片之后的回调
const handleChange = (file) => {
  // 作变量转换,使用原生的url对象,将选中的图片转变成upload可识别的url
  userForm.avatar = URL.createObjectURL(file);
  userForm.file = file;// 将url数据赋值给表单
};
//更新提交
const submitForm = () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      // console.log("submit",userForm)
      // 将表单数据传给后端进行处理,更新数据库(使用自己封装的axios方法:upload)
      const res = await upload("/adminapi/user/upload", userForm);
      if (res.ActionType === "OK") {
        store.commit("changeUserInfo", res.data);
        ElMessage.success("更新成功");
      }
    }
  });
};
</script>

<style scoped lang="scss">
.el-row {
  margin-top: 20px;
  .box-card {
    text-align: center;
  }
}
</style>