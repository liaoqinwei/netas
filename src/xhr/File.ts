const fs = require('fs')
const mime = require('mime')

const fileNameReg = /[\\/]/
// 读取文件时的类
class File{
    filename
    mime
    content
    constructor(path){
        fs.readFileSync(path)
    }

    parseFileName(){

    }
}