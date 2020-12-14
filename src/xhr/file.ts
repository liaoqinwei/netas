const fs = require('fs')
const mime = require('mime')

class File {
  mime: string
  filename: string
  suffix: string
  path: string

  content: Buffer

  constructor(path) {
    this.path = path

    this.init()
  }

  init(): void {
    this.readFile()
    this.parseFile()
  }

  readFile(): void {
    this.content = fs.readFileSync(this.path)
  }

  parseFile(): void {
    // filename
    this.filename = this.path.substring(this.path.lastIndexOf('/') + 1)
    // suffix
    this.suffix = this.path.substring(this.path.lastIndexOf('.') + 1)
    // mime
    this.mime = mime.getType(this.suffix)
  }
}


module.exports = File
