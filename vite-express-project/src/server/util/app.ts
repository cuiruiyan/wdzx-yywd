
import axios from "axios";
import { formatToRFC2822, getSignature, postSignature } from "./wps-4.js";
import config from "../config.js";
import qs from 'qs';
import { json } from "stream/consumers";

const url = 'http://202.121.141.87/o/oauth'

const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzA3OTU1OTQsImNvbXBfaWQiOiIxIiwiY2xpZW50X2lkIjoiQ0hCSVJaWVJPWVZEWEhNQiIsInRrX3R5cGUiOiJhcHAiLCJzY29wZSI6Imtzby5hcHBmaWxlLnJlYWR3cml0ZSxrc28uZHJpdmUucmVhZHdyaXRlIiwiY29tcGFueV9pZCI6MSwiY2xpZW50X3ByaW5jaXBhbF9pZCI6IjQwNTkzIn0.ebr23gBzKZ8wHoOmN1-ECYOOVB03w0gHP5kyBRcHM6E'
//获取应用授权
export async function token() {
  const ContentType = 'application/x-www-form-urlencoded'
  const api = '/v1/token'
  const body = {
    'grant_type': 'client_credentials',
    'scope': 'kso.appfile.readwrite,kso.drive.readwrite'
  }
  // const bo = qs.stringify(body)
  //xwconsole.log(bo)
  const WpsDocsDate = formatToRFC2822(new Date());
  const access_token = await axios.post(`${url}${api}`, qs.stringify(body), {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': postSignature({ url: api, WpsDocsDate, body: qs.stringify(body), ContentType }),
    }
  })
  // console.log('access_token', access_token)
  return access_token.data.data;
}

//新建驱动盘
export async function createdisk(allotee_id: string, allotee_type: string, name: string) {
  const ContentType = 'application/json'
  const api = `/v7/drives/create`
  const WpsDocsDate = formatToRFC2822(new Date());
  const body = {
    'allotee_id': allotee_id,
    'allotee_type': allotee_type,
    'name': name
  }
  const createdisk = await axios.post(`${config.url}${api}`, body, {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': postSignature({ url: api, WpsDocsDate, body: JSON.stringify(body), ContentType }),
      'Authorization': `Bearer ${access_token}`
    }
  })
  return createdisk;
}

//新建目录
export async function createcatalogue(drive_id: string, parent_id: string, file_type: string, name: string) {
  const ContentType = 'application/json'
  const api = `/v7/drives/${drive_id}/files/${parent_id}/creat`
  const WpsDocsDate = formatToRFC2822(new Date());
  const body = {
    'file_type': drive_id,
    'name': parent_id,

  }
  const createdisk = await axios.post(`${config.url}${api}`, body, {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': postSignature({ url: api, WpsDocsDate, body: JSON.stringify(body), ContentType }),
      'Authorization': `Bearer ${access_token}`
    }
  })
  return createdisk;
}

//获取盘列表
export async function disk(allotee_type: string, page_size: number) {
  const api = `/v7/drives?allotee_type=${allotee_type}&page_size=${page_size}`
  const WpsDocsDate = formatToRFC2822(new Date());
  const disk = await axios.get(`${config.url}${api}`, {
    headers: {
      'Content-Type': 'application/json',
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': getSignature(api, WpsDocsDate),
      'Authorization': `Bearer ${access_token}`
    }
  })
  return disk;
}

//获取文件信息
export async function filemeta(drive_id: string, file_id: string) {
  const api = `/v7/drives/${drive_id}/files/${file_id}/meta`
  const WpsDocsDate = formatToRFC2822(new Date());
  const file = await axios.get(`${config.url}${api}`, {
    headers: {
      'Content-Type': 'application/json',
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': getSignature(api, WpsDocsDate),
      'Authorization': `Bearer ${access_token}`
    }
  })
  return file;
}

//删除文件
export async function filedelete(drive_id: string, file_id: string) {
  const ContentType = 'application/json'
  const api = `/v7/drives/${drive_id}/files/${file_id}/delete`
  const WpsDocsDate = formatToRFC2822(new Date());
  const body = {
    'file_type': drive_id,
    'name': file_id,

  }
  const filedelete = await axios.post(`${config.url}${api}`, body, {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': postSignature({ url: api, WpsDocsDate, body: JSON.stringify(body), ContentType }),
      'Authorization': `Bearer ${access_token}`
    }
  })
  return filedelete;
}

//获取盘信息
export async function diskmeta(drive_id: string) {
  const ContentType = 'application/json'
  const api = `/v7/drives/${drive_id}/meta`
  const WpsDocsDate = formatToRFC2822(new Date());
  const findmeta = await axios.get(`${config.url}${api}`, {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': getSignature(api, WpsDocsDate),
      'Authorization': `Bearer ${access_token}`
    }
  })
  return findmeta;
}

//单步上传文件
export async function fileupload(drive_id: string, parent_id: string, file: any, name: string, size: number) {
  const ContentType = 'application/-stream'
  const api = `/v7/drives/${drive_id}/files/${parent_id}/upload?name=${name}&size=${size}`
  const WpsDocsDate = formatToRFC2822(new Date());
  const upload = await axios.post(`${config.url}${api}`, file, {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': postSignature({ url: api, WpsDocsDate, body: '', ContentType }),
      'Authorization': `Bearer ${access_token}`
    },
    //responseType: 'stream' // 设置响应类型为 stream. 将结果响应给开发者，设置了此类型后axios将不会解析响应体。直接响应给开发者
  })
  return upload
}

//277711855583232
//v1/3rd/edit/info  获取预览文件信息
export async function readfile(file_id: string) {
  const body = {
    "file": {
      "id": file_id,
      "preview_pages": 0,
      "user_acl": {
        "rename": 1,
        "history": 1,
        "copy": 1,
        "export": 1,
        "print": 1,
        "comment": 1,
        "copy_control": 1
      }
    },
    "user": {
      "id": "1",
      "name": "admin",
      "permission": "read",
    }
  }
  return body;
}

//编辑回调信息
export async function writefile(file_id: string) {
//  console.log('file_id', file_id)
  const body = {
    "file": {
      "id": file_id,
      "preview_pages": 0,
      "user_acl": {
        "rename": 1,
        "history": 1,
        "copy": 1,
        "export": 1,
        "print": 1,
        "comment": 1,
        "copy_control": 1
      }
    },
    "user": {
      "id": "CHBIRZYROYVDXHMB",
      "name": "admin",
      "permission": "write",
    }
  }
  return body;
}

//新建文件
export async function createfile(drive_id:string,parent_id:string,file_type:string,name:string){
  const ContentType = 'application/json'
  const api = `/v7/drives/${drive_id}/files/${parent_id}/create`
  const WpsDocsDate = formatToRFC2822(new Date());
  const body={
      "file_type":file_type,
      "name":name
  }
  const file = await axios.post(`${config.url}${api}`,body, {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': postSignature({ url: api, WpsDocsDate, body:JSON.stringify(body), ContentType }),
      'Authorization': `Bearer ${access_token}`
    },
    //responseType: 'stream' // 设置响应类型为 stream. 将结果响应给开发者，设置了此类型后axios将不会解析响应体。直接响应给开发者
  })
  return file
}






// //用户
// export async function userinfo() {
  
// }