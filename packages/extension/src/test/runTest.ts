import * as path from 'path'
import {
  runTests,
  downloadAndUnzipVSCode,
  resolveCliPathFromVSCodeExecutablePath,
} from 'vscode-test'
import * as cp from 'child_process'

const extensionRoot = path.join(__dirname, '../../')
const vscodeVersion = '1.40.1'
;(async () => {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../')
    const extensionTestsPath = path.resolve(__dirname, './suite/index')
    const workspace = path.join(extensionRoot, `src/test/suite/workspace`)

    const vscodeExecutablePath = await downloadAndUnzipVSCode(vscodeVersion)
    const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath)

    cp.spawnSync(cliPath, ['--install-extension', 'SimonSiefke.ddev'], {
      encoding: 'utf-8',
      stdio: 'inherit',
    })

    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ['--disable-extensions', workspace],
    })
  } catch (err) {
    console.error('Failed to run tests')
    process.exit(1)
  }
})()
