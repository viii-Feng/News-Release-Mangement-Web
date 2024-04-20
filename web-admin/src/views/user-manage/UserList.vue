<template>
    <!-- 用户列表 -->
    <div>
        <el-card>
            <el-page-header
                content="用户列表"
                icon=""
                title="用户管理"
            />
            <!-- table控件 -->
            <el-table
                :data="tableData"
                style="width: 100%"
            >
                <el-table-column
                    prop="username"
                    label="用户名"
                    width="180"
                />
                <el-table-column
                    label="头像"
                    width="180"
                >
                    <template #default="scope">
                        <div v-if="scope.row.avatar">
                            <el-avatar
                                :size="50"
                                :src="'http://localhost:3000'+scope.row.avatar"
                            ></el-avatar>
                        </div>
                        <!-- 默认头像 -->
                        <div v-else>
                            <el-avatar
                                :size="50"
                                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="角色">
                    <template #default="scope">
                        <!-- {{scope.row.role===1?'管理员':'编辑'}}
                         -->
                        <el-tag
                            v-if="scope.row.role===1"
                            class="ml-2"
                            type="danger"
                        >管理员</el-tag>

                        <el-tag
                            v-else
                            class="ml-2"
                            type="success"
                        >编辑</el-tag>

                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button
                            size="small"
                            @click="handleEdit( scope.row)"
                        >编辑</el-button>
                        <el-popconfirm title="你确定要删除吗?" confirmButtonText="确定" cancelButtonText="取消" @confirm="handleDelete(scope.row)">
                            <template #reference>
                                <el-button
                                    size="small"
                                    type="danger"
                                    
                                >删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table> 
            <!-- pagination
                   v-model:current-page:设置分页器当前页码
                   v-model:page-size:设置每一个展示数据条数
                   page-sizes:用于设置下拉菜单数据
                   background:设置分页器按钮的背景颜色
                   layout:可以设置分页器六个子组件布局调整
            -->
           
        </el-card>
        <el-pagination style="margin-top:15px;" @size-change="sizeChange" @current-change="getTableData" :pager-count="5"
                v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 11]" :background="true"
                layout="prev, pager, next, jumper,->,sizes,total" :total="total" />

        <!-- 编辑弹框 -->
        <el-dialog
            v-model="dialogVisible"
            title="编辑用户"
            width="50%"
        >
            <el-form
                ref="userFormRef"
                :model="userForm"
                :rules="userFormRules"
                label-width="80px"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="用户名"
                    prop="username"
                >
                    <el-input v-model="userForm.username" />
                </el-form-item>
                <el-form-item
                    label="密码"
                    prop="password"
                >
                    <el-input
                        v-model="userForm.password"
                        type="password"
                    />
                </el-form-item>

                <el-form-item
                    label="角色"
                    prop="role"
                >
                    <el-select
                        v-model="userForm.role"
                        class="m-2"
                        placeholder="Select"
                        style="width:100%"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="个人简介"
                    prop="introduction"
                >
                    <el-input
                        v-model="userForm.introduction"
                        type="textarea"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button
                        type="primary"
                        @click="handleEditConfirm()"
                    >确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
//当前页码
let pageNo = ref(1);
//每一页展示多少条数据
let limit = ref(3);
//存储已有品牌数据总数
let total = ref(0);
import { ref, onMounted,reactive } from "vue";
import axios from "axios";

const dialogVisible = ref(false);//表单是否展示标志位
const userFormRef = ref();//表单指向
// 表单数据
let userForm = reactive({
  username: "",
  password: "",
  role: 2, //1 是管理员 ,2编辑
  introduction: ""
});
// 表单规则
const userFormRules = reactive({
  username: [{ required: true, message: "请输入名字", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  role: [{ required: true, message: "请选择权限", trigger: "blur" }],
  introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }]
});

// 权限选项
const options = [
  {
    label: "管理员",
    value: 1
  },
  {
    label: "编辑",
    value: 2
  }
];

const tableData = ref([]);
onMounted(() => {
  getTableData();
});

// 获取用户列表数据
const getTableData = async (page=1) => {
    pageNo.value = page;
    const dir=`/adminapi/user/list1/${pageNo.value}/${limit.value}`
  const res = await axios.get(dir);
  console.log(res.data)
  tableData.value = res.data.data;
  total.value = res.data.total;
};
const sizeChange = () => {
    //当前每一页的数据量发生变化的时候，当前页码归1
    getTableData();
}

// 编辑事件
const handleEdit = async data => {
    // 请求数据填充弹出框
  const res = await axios.get(`/adminapi/user/list2/${data._id}`)
  console.log('要编辑的用户数据:',res.data.data)
  // 不能直接赋值,需要用对象合并的方法
  Object.assign(userForm,res.data.data[0])
  dialogVisible.value = true;
};

//编辑确认回调
const handleEditConfirm = ()=>{
    // 校验表单规则
    userFormRef.value.validate(async (valid)=>{
        if(valid){
            // console.log('编辑后的用户数据',userForm)
            //1- 更新后端
            await axios.put(`/adminapi/user/list/${userForm._id}`,userForm)
            //2- dialog隐藏
            dialogVisible.value = false
            //3-获取table数据
            getTableData()
        }
    })
}

// 删除事件
const handleDelete = async data =>{
    // console.log('删除的用户数据',data)
    await axios.delete(`/adminapi/user/list/${data._id}`) 
    getTableData();// 重新获取数据
}
</script>

<style lang="scss" scoped>
.el-table {
  // 设置上边距
  margin-top: 50px;
}
</style>

