const fs = require('fs')
const mime = require('mime')


// @ts-ignore
class File {
  mime: any
  filename: string
  suffix: string
  path: string

  content: Buffer=null

  constructor(path) {
    this.path = path
    this.init()
  }

  init(): void {
    this.readFile()
    this.parseFile()
  }

  readFile(): void {
    try {
      this.content = fs.readFileSync(this.path)
    }catch (e) {
      console.log(e.message)
    }
  }

  parseFile(): void {
    // filename
    this.filename = this.path.substring(this.path.lastIndexOf('/') + 1)
    // suffix
    let suffixIndex = this.path.lastIndexOf('.')
    if (suffixIndex !== -1)
      this.suffix = this.path.substring(suffixIndex + 1)
    // mime
    this.mime = mime.getType(this.suffix)
  }
}

// @ts-ignore
module.exports = File