// 定义一个函数用于处理字符串
function splitByNewline(str) {
  // 去除字符串两端的空格
  str = str.trim();

  // 使用换行符分割字符串并返回数组
  // split()方法会根据指定的分隔符将字符串分割成数组
  return str.split("\n");
}
// 使用示例
const text = `
    Hello World
    你好世界
    Testing
`;

const result = splitByNewline(text);
console.log(result); // ['Hello World', '你好世界', 'Testing']

// 使用axios上传文件
async function uploadFiles(name, files) {
  try {
    // 创建FormData对象用于存储文件数据
    const formData = new FormData();

    // 添加name参数
    formData.append("name", name);

    // 如果files是数组,循环添加文件
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append("files", file);
      });
    } else {
      // 单个文件直接添加
      formData.append("files", files);
    }

    // 发送POST请求上传文件
    const response = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 返回上传结果
    return response.data;
  } catch (error) {
    console.error("文件上传失败:", error);
    throw error;
  }
}

// 判断是否是Object
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

// 使用示例:
// const files = document.querySelector('input[type="file"]').files;
// uploadFiles('测试文件', files)
//   .then(result => console.log('上传成功:', result))
//   .catch(error => console.log('上传失败:', error));
