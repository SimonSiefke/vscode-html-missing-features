import * as path from 'path'
import * as Mocha from 'mocha'
import * as fs from 'fs'

export const createRunner: (
  dirname: string
) => () => Promise<void> = dirname => () => {
  const mocha = new Mocha({
    ui: 'tdd',
    timeout: 1000000,
  })
  mocha.useColors(true)
  mocha.bail(true)

  return new Promise((resolve, reject) => {
    const fileNames = fs
      .readdirSync(dirname)
      .filter(fileName => fileName.endsWith('.test.js'))
    for (const fileName of fileNames) {
      mocha.addFile(path.join(dirname, fileName))
    }
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
}
