import * as path from 'path'
import * as Mocha from 'mocha'
import * as glob from 'glob'

// const testFiles = '**/**.test.js'
const files = [
  // 'autoCloseTag',
  // 'closeTag',
  // 'wrapTag',
  'autoRenameTag',
  // 'expandTag',
]
const testFiles = `**/+(${files.join('|')}).test.js`

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'tdd',
    timeout: 1000000,
  })
  mocha.useColors(true)
  mocha.bail(true)

  const testsRoot = path.resolve(__dirname, '..')

  return new Promise((resolve, reject) => {
    glob(testFiles, { cwd: testsRoot }, (err, files) => {
      console.log(files)
      if (err) {
        return reject(err)
      }
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)))
      try {
        mocha.run(failures => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`))
          } else {
            resolve()
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  })
}
