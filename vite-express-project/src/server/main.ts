import express from "express";
import ViteExpress from "vite-express";
import { createdisk, disk, fileupload, diskmeta, token, filemeta, filedelete, readfile, writefile, createfile } from "./util/app.js";
import bodyParser from 'body-parser';
import multer from "multer";
import path from "path";
import fs from "fs"
import { edit_url, preview_url } from "./util/preview.js";
import config from "./config.js";
import { code, usertoken } from "./util/wdzx.js";


const app = express();
app.use(bodyParser.json()); // 解析application/json格式的数据
app.use(bodyParser.urlencoded({ extended: true })); // 解析application/x-www-form-urlencoded格式的数据
app.use(bodyParser.json());
app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});


//获取token
app.post("/token", async (req, res) => {
  const access_token = await token();
  //console.log(access_token)
  // const access = JSON.stringify(access_token)
  res.send(access_token)
});

//新建驱动盘
app.post('/createdisk', async (req, res) => {
  const create = await createdisk(req.body.allotee_id, req.body.allotee_type, req.body.name)
  res.send(create.data)
})

//获取盘列表
app.get("/disk", async (req, res) => {
  const app = await disk(req.query.allotee_type as string, req.query.page_size as unknown as number);
  res.send(app.data)
});

//获取盘信息
app.get("/diskfilemeta", async (req, res) => {
  const filemeta = await diskmeta(req.query.drive_id as string)
  res.send(filemeta.data.data)
});

//获取文件信息
app.get("/filemeta", async (req, res) => {
  const meta = await filemeta(req.query.drive_id as string, req.query.file_id as string)
  // console.log()
  res.send(meta.data)
});

//删除文件信息
app.post("/filedelete", async (req, res) => {
  const meta = await filedelete(req.query.drive_id as string, req.query.file_id as string)
  res.send(meta.data)
});

//单步上传文件
// 配置存储位置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/'); // 文件保存目录
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // 文件名
  }
});
const upload = multer({ storage: storage });
app.post('/upload', upload.single('file'), async (req, res) => {
  // console.log('path', req.file)
  const fileStream = fs.readFileSync(req.file?.path as string);
  // console.log('fileStream', fileStream)
  //const upload = await fileupload(req.query.drive_id as string, req.query.parent_id as string, fileStream, req.file?.originalname as string, req.file?.size as number)
  const upload = await fileupload('276498957238272', '0', fileStream, req.file?.originalname as string, req.file?.size as number)
  console.log('upload', upload.data)
  //res.send(upload.data)
  res.send(upload.data)
  // console.log('200')
})

//获取预览链接
app.get('/previewurl', async (req, res) => {
  const meta = await filemeta('276498957238272', req.query.file_id as string)
  console.log('meta', meta.data)
  const filename = meta.data.data.name
  console.log(filename)
  const fileExtension = path.extname(filename).toLowerCase();
  let type = ''
  if (['.doc', '.dot', '.wps', '.wpt', '.docx', '.dotx', '.docm', '.dotm', '.rtf', '.txt', '.mht', '.mhtml', '.htm', '.html', '.uot3'].includes(fileExtension)) {
    type = 'w'
  } else if (['.xls', '.xlt', '.et', '.xlsx', '.xltx', '.sv', '.xlsm', '.xltm', '.ett'].includes(fileExtension)) {
    type = 'x'
  } else if (['.ppt', '.pptx', '.pptm', '.ppsx', '.ppsm', '.pps', '.potx', '.potm', '.dpt', '.dps', '.pot'].includes(fileExtension)) {
    type = 'p'
  } else if (['.pdf', '.ofd'].includes(fileExtension)) {
    type = 'f'
  } else if (['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.svg', '.psd'].includes(fileExtension)) {
    type = 'x'
  } else {
    console.log("文件类型不支持")
  }
  const _w_third_boolean = 'read'
  const preview = await preview_url('276498957238272', req.query.file_id as string, type, _w_third_boolean)
  res.send(preview.data)

})

//获取编辑链接
app.get('/editwurl', async (req, res) => {
  const meta = await filemeta('276498957238272', req.query.file_id as string)
  console.log('meta', meta.data)
  const filename = meta.data.data.name
  console.log(filename)
  const fileExtension = path.extname(filename).toLowerCase();
  let type = ''
  if (['.doc', '.dot', '.wps', '.wpt', '.docx', '.dotx', '.docm', '.dotm', '.rtf', '.txt', '.mht', '.mhtml', '.htm', '.html', '.uot3'].includes(fileExtension)) {
    type = 'w'
  } else if (['.xls', '.xlt', '.et', '.xlsx', '.xltx', '.sv', '.xlsm', '.xltm', '.ett'].includes(fileExtension)) {
    type = 'x'
  } else if (['.ppt', '.pptx', '.pptm', '.ppsx', '.ppsm', '.pps', '.potx', '.potm', '.dpt', '.dps', '.pot'].includes(fileExtension)) {
    type = 'p'
  } else if (['.pdf', '.ofd'].includes(fileExtension)) {
    type = 'f'
  } else if (['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.svg', '.psd'].includes(fileExtension)) {
    type = 'x'
  } else {
    console.log("文件类型不支持")
  }
  const _w_third_boolean = 'write'
  const expire_time = 500
  const preview = await edit_url('276498957238272', req.query.file_id as string, type, _w_third_boolean, expire_time, 'cuiruiyan')
  res.send(preview.data)
})

//info回调接口
app.get('/v1/3rd/edit/info', async (req, res) => {
  //  console.log(req.headers)
  if (req.query._w_third_boolean == 'read') {
    const fileinfo = await readfile(req.headers['x-weboffice-file-id'] as string)
    res.send(fileinfo)
  } else if (req.query._w_third_boolean == 'write') {
    const fileinfo = await writefile(req.headers['x-weboffice-file-id'] as string)
    // console.log(fileinfo)
    res.send(fileinfo)

  }
})
//新版本通知
app.post('/v1/3rd/file/notify', async (req, res) => {
  console.log(req.body)
  res.json({})
})
//用户权限校验
app.get('/v1/3rd/user/auth', async (req, res) => {
  //console.log(req.query.id)
  if (req.query._w_third_userid == '') {
    res.json({})
  } else {
    const query = {
      "id": req.query._w_third_userid
    }
    console.log(query)
    res.send(query)
  }
})
//新建文件
app.post('/createfile', async (req, res) => {
  const file = await createfile('276498957238272', '0', req.query.file_type as string, req.query.name as string)
  res.send(file.data)
})




//获取授权链接
app.get('/usercode', async (req, res) => {
  const usercode = await code(config.AccessKey, 'code', 'http://8.153.38.238:3000/user/token', 'kso.drive.as_user.manage,kso.file.write', 'userstate');
  // console.log(req.query.code)
  res.send(usercode)

})
//获取用户授权token
app.get('/user/token', async (req, res) => {
  const token = await usertoken(req.query.code as string)
  console.log(token.data.data)
  res.send(token.data.data)
})


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
