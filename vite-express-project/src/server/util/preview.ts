import axios from "axios";
import { formatToRFC2822, getSignature } from "./wps-4.js";
import config from "../config.js";


const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzA3OTU1OTQsImNvbXBfaWQiOiIxIiwiY2xpZW50X2lkIjoiQ0hCSVJaWVJPWVZEWEhNQiIsInRrX3R5cGUiOiJhcHAiLCJzY29wZSI6Imtzby5hcHBmaWxlLnJlYWR3cml0ZSxrc28uZHJpdmUucmVhZHdyaXRlIiwiY29tcGFueV9pZCI6MSwiY2xpZW50X3ByaW5jaXBhbF9pZCI6IjQwNTkzIn0.ebr23gBzKZ8wHoOmN1-ECYOOVB03w0gHP5kyBRcHM6E'
export async function preview_url(drive_id: string, file_id: string, type: string, _w_third_boolean: string) {
  const ContentType = 'application/json'
  const api = `/v7/drives/${drive_id}/files/${file_id}/preview_url?type=${type}&_w_third_boolean=${_w_third_boolean}`
  const WpsDocsDate = formatToRFC2822(new Date());
  const getpreview = await axios.get(`${config.url}${api}`, {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': getSignature(api, WpsDocsDate),
      'Authorization': `Bearer ${access_token}`
    }
  })
  return getpreview;
}

//获取编辑链接
export async function edit_url(drive_id: string, file_id: string, type: string, _w_third_boolean: string, expire_time: number, _w_third_userid: string) {
  const ContentType = 'application/json'
  const api = `/v7/drives/${drive_id}/files/${file_id}/edit_url?type=${type}&_w_third_boolean=${_w_third_boolean}&expire_time=${expire_time}&_w_third_userid=${_w_third_userid}`
  const WpsDocsDate = formatToRFC2822(new Date());
  const getpreview = await axios.get(`${config.url}${api}`, {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': getSignature(api, WpsDocsDate),
      'Authorization': `Bearer ${access_token}`
    }
  })
  return getpreview;
} 