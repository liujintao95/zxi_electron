
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


async function getFileInfo(filePath, json) {
  const buffer = fs.readFileSync(filePath);
  const fsHash = crypto.createHash('sha256');
  fsHash.update(buffer);

  let res = {
    size: buffer.length,
    hash: fsHash.digest('hex'),
    name: path.basename(filePath),
    path: filePath
  }
  if (json) {
    return JSON.stringify(res);
  } else {
    return res
  }
}

async function getFilesList(dirPath, json){
  let file_list = []
  let state = fs.statSync(dirPath);
  if(state.isFile()){
    file_list.push(await getFileInfo(dirPath, json))
  }else if (state.isDirectory()){
    let files = fs.readdirSync(dirPath);
    for(let i = 0; i < files.length; i++){
      file_list = file_list.concat(await getFilesList(path.join(dirPath, files[i]), json))
    }
  }
  return file_list
}

module.exports = {
  getFileInfo: getFileInfo,
  getFilesList: getFilesList,
}