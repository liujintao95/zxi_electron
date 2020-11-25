
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData =require('form-data');

const BaseURL = process.env.VUE_APP_URL
const HashSize = 1024*1024


function getFileInfo(file_path, json) {
  return new Promise((resolve, reject) => {
    let state = fs.statSync(file_path)
    let stream = fs.createReadStream(file_path,  {highWaterMark: HashSize})
    let fsHash = crypto.createHash('sha256')

    stream.on('data', chunk=> {
      fsHash.update(chunk);
      stream.emit("end")
    });

    stream.on('end', ()=> {
      let res = {
        size: state.size,
        hash: fsHash.digest('hex'),
        name: path.basename(file_path),
        path: file_path
      }
      if (json) {
        resolve(JSON.stringify(res))
      } else {
        resolve(res)
      }
    });
  })
}

async function getFilesList(dir_path, json){
  let file_list = []
  let state = fs.statSync(dir_path)
  if(state.isFile()){
    file_list.push(await getFileInfo(dir_path, json))
  }else if (state.isDirectory()){
    let files = fs.readdirSync(dir_path)
    for(let file of files){
      file_list = file_list.concat(await getFilesList(path.join(dir_path, file), json))
    }
  }
  return file_list
}

function fileInfo(file_path){
  return fs.statSync(file_path)
}

async function readSmallFile(file_id, file_path){
  return fs.createReadStream(file_path)
}

function createFileStream(file_path, size){
  return  fs.createReadStream(file_path,  {highWaterMark: size})
}

function uploadFileStream(stream, upload_id, block_list){
  let offset_map = {}
  for(let block of block_list) {
    offset_map[block["Offset"]] = {
      id: block["Id"],
      complete: block["IsComplete"],
    }
  }

  return new Promise((resolve, reject) => {
    let i = 0
    stream.on('data',  block=> {
      if (offset_map[i] && offset_map[i]["complete"] === 0){
        stream.pause()
        let formData = new FormData()
        let headers = formData.getHeaders()

        formData.append('upload_id', upload_id)
        formData.append('block_id', offset_map[i]["id"])
        formData.append('block', block)
        axios.post(
            BaseURL+"/zxi/auth/upload/block",
            formData,
            {headers}
        ).then(res=>{
          stream.resume()
          // 修改进度条
        }).catch(err=>{
          reject(err)
          stream.emit("end")
        })
      }
      i++
    })

    stream.on('end', ()=> {
      resolve(upload_id)
    });
  })
}

async function pauseUploadFileStream(stream){
  return stream.emit("end")
}

module.exports = {
  getFileInfo: getFileInfo,
  getFilesList: getFilesList,
  fileInfo: fileInfo,
  readSmallFile: readSmallFile,
  createFileStream: createFileStream,
  uploadFileStream: uploadFileStream,
  pauseUploadFileStream: pauseUploadFileStream,
}