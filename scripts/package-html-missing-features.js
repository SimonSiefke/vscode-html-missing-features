const path = require('path')
const fs = require('fs-extra')

const root = path.join(__dirname, '..')

if (!fs.existsSync(path.join(root, 'dist'))) {
  fs.mkdirSync(path.join(root, 'dist'))
}

// @ts-ignore
const pkg = require('../packages/html-missing-features-extension/package.json')

pkg.main = './packages/html-missing-features-extension/dist/extensionMain.js'

delete pkg.dependencies
delete pkg.devDependencies
delete pkg.scripts
delete pkg.enableProposedApi

fs.writeFileSync(
  path.join(root, 'dist/package.json'),
  `${JSON.stringify(pkg, null, 2)}\n`
)

fs.copyFileSync(path.join(root, 'README.md'), path.join(root, 'dist/README.md'))

let extensionMain = fs
  .readFileSync(
    path.join(
      root,
      `dist/packages/html-missing-features-extension/dist/extensionMain.js`
    )
  )
  .toString()

extensionMain = extensionMain.replace(
  '../html-language-server/dist/htmlLanguageServerMain.js',
  './packages/html-language-server/dist/htmlLanguageServerMain.js'
)

fs.writeFileSync(
  path.join(
    root,
    `dist/packages/html-missing-features-extension/dist/extensionMain.js`
  ),
  extensionMain
)
