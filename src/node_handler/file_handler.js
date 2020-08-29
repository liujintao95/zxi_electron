
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


async function getFileInfo(filePath) {
  const buffer = fs.readFileSync(filePath);
  const fsHash = crypto.createHash('sha256');
  let res = {}

  res.size = buffer.length
  fsHash.update(buffer);
  return {
    size: buffer.length,
    hash: fsHash.digest('hex'),
    name: path.basename(filePath),
    path: filePath
  }
}

async function getFilesList(dirPath){
  let file_list = []
  let state = fs.statSync(dirPath);
  if(state.isFile()){
    file_list.push(await getFileInfo(dirPath))
  }else if (state.isDirectory()){
    let files = fs.readdirSync(dirPath);
    for(let i = 0; i < files.length; i++){
      file_list = file_list.concat(await getFilesList(path.join(dirPath, files[i])))
    }
  }
  return file_list
}

module.exports = {
  getFileInfo: getFileInfo,
  getFilesList: getFilesList,
}