import axios from "axios";
import "./App.css";

import { useState } from "react";

//import reactLogo from "./assets/react.svg";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div className="App">
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </div>
//   );
// }
//export default App;
function FileUploader() {
  const [file, setFile] = useState(null);  //useState Hook 来管理表单数据。这让你能够跟踪表单字段的值，并在用户输入时更新这些值。
  const [file_id, setFilea_id] = useState('');
  const [data, setData] = useState({ link: '' });
  //const [data,] = useState('');
  //上传文件
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  //预览链接
  const previewSubmit = (event: any) => {
    event.preventDefault(); // 阻止表单默认提交行为
    // 将表单数据作为查询参数发送到后端
    preview(file_id);
  };
  //编辑链接
  const editSubmit = (event: any) => {
    event.preventDefault(); // 阻止表单默认提交行为
    // 将表单数据作为查询参数发送到后端
    edit(file_id);

  };

  const preview = async (file_id: string) => {
    try {
      const response = await axios.get('/previewurl', {
        params: { file_id },  // 使用对象字面量来构造查询参数
      });
      console.log(response.data);
      window.open(response.data.data.url)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const edit = async (file_id: string) => {
    try {
      const response = await axios.get('/editwurl', {
        params: { file_id },  // 使用对象字面量来构造查询参数
      });
      console.log(response.data);
      window.open(response.data.data.url)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const usercode = async () => {
    try {
      const response = await axios.get('/usercode');
      console.log(response.data);
      window.open(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };






  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        {/* onChange={previewSubmit}是在React中用来处理输入元素变化的常见模式，特别是在处理文件上传或表单输入字段时。当用户选择了一个文件或改变了输入值时，这个事件处理器会被触发 */}
        <button type="submit">Upload</button>
        <label htmlFor="file_id">请输入文件id</label>
        <input type="text" name="filea_id" id="filea_id" value={file_id} onChange={(e) => setFilea_id(e.target.value)} />
        <button id="preview" onClick={previewSubmit} >预览跳转</button>
        <button id="preview" onClick={editSubmit} >编辑跳转</button>
        {/* onClick={handleFileChange} 是在React中用来绑定一个函数到按钮或其他元素的点击事件上的语法。当用户点击这个元素时，就会执行previewSubmit函数 */}
      </form>
      <button id="usercode" onClick={usercode} >授权跳转</button>
    </div>

  );
}

export default FileUploader;