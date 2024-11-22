import axios from "axios";
import crypto from 'crypto';
import moment from 'moment-timezone';
import config from '../config.js';


export function formatToRFC2822(date: any) {
  // 获取英文星期几的缩写
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // 获取英文月份的缩写
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = days[date.getUTCDay()];
  const dateNum = padZero(date.getUTCDate());
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());

  return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}

export function padZero(num: any) {
  // 如果数字小于10，在前面补0
  return (num < 10 ? '0' : '') + num;
}

function sha256(sha: string) {
  const hash = crypto.createHash('sha256');
  hash.update(sha);
  return hash.digest('hex'); // 返回十六进制格式的哈希值
}


function hmacsha256h(data: string) {
  const hmac = crypto.createHmac('sha256', config.SecretKey);
  hmac.update(data);
  return hmac.digest('hex'); // 返回十六进制格式的签名
}

export function getSignature(url: string, WpsDocsDate: string) {
  //Signature：hmac-sha256(secret_key, Ver + HttpMethod + URI + Content-Type + Wps-Docs-Date + sha256(HttpBody))
  const str = `${config.Ver}GET${url}${config.ContentType}${WpsDocsDate}`
  const sign = hmacsha256h(str)
  const authorization = `WPS-4 ${config.AccessKey}:${sign}`
  return authorization
}

// export function postSignature(url: string, WpsDocsDate: string, body: string) {
//   //Signature：hmac-sha256(secret_key, Ver + HttpMethod + URI + Content-Type + Wps-Docs-Date + sha256(HttpBody))
//   let shaBody = ''
//   if (body !== '') {
//     shaBody = sha256(body)
//   }
//   const str = `${config.Ver}POST${url}${config.ContentType}${WpsDocsDate}${shaBody}`
//   const sign = hmacsha256h(str)
//   const authorization = `WPS-4 ${config.AccessKey}:${sign}`
//   return authorization
// }

// export function postTokenSignature(perams: { url: string, WpsDocsDate: string, body: string, ContentType: string }) {
//   //Signature：hmac-sha256(secret_key, Ver + HttpMethod + URI + Content-Type + Wps-Docs-Date + sha256(HttpBody))
//   const { url, WpsDocsDate, body, ContentType = 'application/json' } = perams
//   //const ContentType = 'application/x-www-form-urlencoded'
//   let shaBody = ''
//   if (body !== '') {
//     shaBody = sha256(body)
//   }
//   const str = `${config.Ver}POST${url}${ContentType}${WpsDocsDate}${shaBody}`
//   const sign = hmacsha256h(str)
//   const authorization = `WPS-4 ${config.AccessKey}:${sign}`
//   return authorization
// }


export function postSignature(perams: { url: string, WpsDocsDate: string, body: string, ContentType: string }) {
  //Signature：hmac-sha256(secret_key, Ver + HttpMethod + URI + Content-Type + Wps-Docs-Date + sha256(HttpBody))
  const { url, WpsDocsDate, body, ContentType = 'application/json' } = perams
  //const ContentType = 'application/x-www-form-urlencoded'
  let shaBody = ''
  if (body !== '') {
    shaBody = sha256(body)
  }
  const str = `${config.Ver}POST${url}${ContentType}${WpsDocsDate}${shaBody}`
  const sign = hmacsha256h(str)
  const authorization = `WPS-4 ${config.AccessKey}:${sign}`
  return authorization
}