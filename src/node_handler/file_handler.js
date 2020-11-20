
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData =require('form-data');

const baseURL = process.env.VUE_APP_URL


async function getFileInfo(file_path, json) {
  const buffer = fs.readFileSync(file_path)
  const fsHash = crypto.createHash('sha256')
  fsHash.update(buffer)

  let res = {
    size: buffer.length,
    hash: fsHash.digest('hex'),
    name: path.basename(file_path),
    path: file_path
  }
  if (json) {
    return JSON.stringify(res)
  } else {
    return res
  }
}

async function getFilesList(dir_path, json){
  let file_list = []
  let state = fs.statSync(dir_path);
  if(state.isFile()){
    file_list.push(await getFileInfo(dir_path, json))
  }else if (state.isDirectory()){
    let files = fs.readdirSync(dir_path);
    for(let i = 0; i < files.length; i++){
      file_list = file_list.concat(await getFilesList(path.join(dir_path, files[i]), json))
    }
  }
  return file_list
}

function fileInfo(file_path){
  return fs.statSync(file_path)
}

async function uploadSmallFile(file_id, file_path){
  let localFile = fs.createReadStream(file_path)
  let formData = new FormData()
  formData.append('id',file_id)
  formData.append('file',localFile)
  let headers = formData.getHeaders()
  await axios.post(
      baseURL+"/zxi/auth/upload/file",
      formData,
      {headers}
  )
}

async function uploadFileBlock(file_id, file_path){
  const buffer = fs.readFileSync(file_path)
}

module.exports = {
  getFileInfo: getFileInfo,
  getFilesList: getFilesList,
  fileInfo: fileInfo,
  uploadSmallFile: uploadSmallFile,
  uploadFileBlock: uploadFileBlock,
}