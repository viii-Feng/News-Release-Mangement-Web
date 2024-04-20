<template>
    <div>
        <!-- 头部标题 -->
        <el-card>
            <el-page-header
            content="新闻列表"
                icon=""
                title="新闻管理"
            >
            </el-page-header>
            <div class="box">
                <div class="left">
                    选择：
                </div>
                <div class="right">
                <el-select v-model="choose" placeholder="Select"  @change="handler">
                    <el-option v-for="(c2, index) in options" :key="c2.id" :label="c2.label"
                        :value="c2.label"></el-option>
                </el-select>
            </div>
            </div>
            <!-- table表单 -->
             <el-table
                :data="tableData"
                style="width: 100%"
            >
                <el-table-column
                    prop="title"
                    label="标题"
                    width="180"
                />
                <el-table-column
                    label="分类"
                    
                >
                    <template #default="scope">
                        {{categoryFormat(scope.row.category)}}
                    </template>
                </el-table-column>

                <el-table-column
                    label="更新时间"
                >
                    <template #default="scope">
                        {{formatTime.getTime(scope.row.editTime)}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否发布"
                    
                >
                    <template #default="scope">
                        <!-- 该开关严格遵守布尔值,不能以1,0来替代true或false
                        但是使用:active-value属性可以指对应的值表示布尔值 -->
                        <el-switch v-model="scope.row.isPublish" :active-value="1"
                        :inactive-value="0"
                        @change="handleSwitchChange(scope.row)"
                         />
                    </template>
                </el-table-column>

                 <el-table-column label="操作">
                    <template #default="scope">
                        <!-- 预览按钮 -->
                        <el-button
                            circle
                            :icon="Star"
                            type="success"
                            title="预览"
                            @click="handlePreview(scope.row)"
                        ></el-button>
                        <!-- 编辑按钮 -->
                        <el-button
                            circle
                            :icon="Edit"
                            title="编辑"
                            @click="handleEdit(scope.row)"
                        ></el-button>
                        <!-- 删除按钮(删除提示控件) -->
                        <el-popconfirm
                            title="你确定要删除吗?"
                            confirmButtonText="确定"
                            cancelButtonText="取消"
                            @confirm="handleDelete(scope.row)"
                        >
                            <template #reference>
                                <el-button
                                    circle
                                    :icon="Delete"
                                    type="danger"
                                    title="删除"
                                ></el-button>
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
            <el-pagination style="margin-top:15px;" @size-change="sizeChange" @current-change="getTableData" :pager-count="3"
                v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 11]" :background="true"
                layout="prev, pager, next, jumper,->,sizes,total" :total="total" />
        </el-card>

        <!-- 消息弹窗(预览新闻) -->
        <el-dialog
            v-model="dialogVisible"
            title="预览新闻"
            width="50%"
        >
            <div>
                <h2>{{previewData.title}}</h2>
                <div style="font-size:12px;color:gray;">{{formatTime.getTime(previewData.editTime)}}</div>

                <el-divider>
                    <el-icon>
                        <star-filled />
                    </el-icon>
                </el-divider>

                <div v-html="previewData.content" class="htmlcontent"></div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import {ref,onMounted} from 'vue'
import axios from 'axios'
import formatTime from '../../../util/formatTime'
import {Star,Edit,Delete,StarFilled} from '@element-plus/icons-vue'// 引入icon图标
import {useRouter} from 'vue-router'
const router = useRouter()// 创建全局路由对象
const tableData = ref([])// 指定该数据为响应式数据,默认值为空数组
const previewData = ref({});// 指定该数据为响应式数据,默认值为空对象
const dialogVisible = ref(false);
let choose=ref('全部');
//当前页码
let pageNo = ref(1);
//每一页展示多少条数据
let limit = ref(3);
//存储已有品牌数据总数
let total = ref(0);
const handler=async function(){
    console.log("pageNo",pageNo.value);
    console.log("limit",limit.value);
    console.log(total);
        getTableData();

}
const sizeChange=async function(){
    getTableData();
}
onMounted(()=>{
    getTableData()
})
const options = [
{
    label: "全部",
    value: 0
  },
  {
    label: "最新动态",
    value: 1
  },
  {
    label: "产品预告",
    value: 2
  },
  {
    label: "通知公告",
    value: 3
  }
];

// 获取新闻数据
const getTableData =async (page=1)=>{
    pageNo.value=page
    console.log(choose);
    let value
    options.map(
        (index)=>{
            if(index.label==choose.value){
                value=index.value;
            }
        }
    )
    console.log(value);
   const res = await axios.get(`/adminapi/news/getlist/${pageNo.value}/${limit.value}/${value}`)
   console.log("res",res);
//    console.log(res.data.data)
   tableData.value = res.data.data
   total=res.data.total
}

//格式化分类信息
const categoryFormat = (category)=>{
    const arr=["最新动态","产品预告","通知公告"]
    return arr[category-1]
}

//开关回调(发布新闻)
const handleSwitchChange =async (item)=>{
    // console.log('要发布的新闻数据',item)
    await axios.put(`/adminapi/news/publish`,{
        _id:item._id,
        isPublish:item.isPublish
    })
    await getTableData()
}

//预览回调函数(点击预览)
const handlePreview = data => {
  console.log('要预览的新闻数据',data)
  previewData.value = data;// 显示
  dialogVisible.value = true;// 打开消息弹窗
};

//删除回调函数(点击删除)
const handleDelete =async (item)=>{
    // console.log('要删除的新闻',item)
    await axios.delete(`/adminapi/news/list/${item._id}`)
    await getTableData()// 重新获取新闻数据
}

//编辑回调
const handleEdit = (item)=>{
    //跳转到/news-manage/editnews/:id(携带对应的新闻id跳转到对应的动态路由页面上)
    router.push(`/news-manage/editnews/${item._id}`)
}
</script>
<style lang="scss" scoped>
.el-table{
    margin-top:30px;
}
.el-header{
    display: flex;
}
.box{
    width:300px;
    margin-top:20px;
    display: flex;
    .left{
        width:50px;
        text-align: center;
        margin-top:5px;
    }
    .right{
        width:150px;
    }
   
}
::v-deep.htmlcontent{
   img{
    max-width: 100%;
   }
}

</style>
