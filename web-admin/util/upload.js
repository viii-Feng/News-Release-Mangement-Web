import axios from "axios";
// 自己封装一个upload方法,用于提交文件数据(图片)
function upload(path,userForm){
    // 将表单数据分成多份依次传递
    const params = new FormData()
    for(let i in userForm){
        params.append(i,userForm[i])
    }
    // console.log(params)
    return axios.post(path,params,{
        // 将请求头设置成multipart/form-data格式传递文件数据
        headers:{
            "Content-Type":"multipart/form-data"
        }
    }).then(res=>res.data)
}

export default upload