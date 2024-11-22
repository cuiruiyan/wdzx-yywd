import axios from "axios"
import { formatToRFC2822, postSignature } from "./wps-4.js"
import config from "../config.js"
import qs from "qs"

//构造授权跳转链接，用户授权，获取临时授权码code
export async function code(client_id: string, response_type: string, redirect_uri: string, scope: string, state: string) {
  const url = 'http://202.121.141.87'
  const api = `/o/oauth/v1/authorize?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`
  //const usercode = await axios.get(`${url}${api}`)
  //return usercode
  const codeurl = `${url}${api}`
  return codeurl
}

//获取用户授权token
export async function usertoken(code: string) {
  const url = 'http://202.121.141.87/o/oauth'
  const ContentType = 'application/x-www-form-urlencoded'
  const api = `/v1/token`
  const WpsDocsDate = formatToRFC2822(new Date());
  const body = {
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': 'http://8.153.38.238:3000/user/token',
    'scope': 'kso.drive.as_user.manage,kso.file.write'
  }
  const token = await axios.post(`${url}${api}`, qs.stringify(body), {
    headers: {
      'Content-Type': ContentType,
      'Wps-Docs-Date': WpsDocsDate,
      'Wps-Docs-Authorization': postSignature({ url: api, WpsDocsDate, body: qs.stringify(body), ContentType }),
    },

  })
  return token
}