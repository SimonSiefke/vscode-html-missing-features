import * as path from 'path'
import {
  runTests,
  downloadAndUnzipVSCode,
  resolveCliPathFromVSCodeExecutablePath,
} from 'vscode-test'
import * as cp from 'child_process'
import * as fs from 'fs-extra'

const extensionRoot = path.join(__dirname, '../../')
const vscodeVersion = '1.40.1'

const extensionDevelopmentPath = path.resolve(__dirname, '../../')

interface Test {
  path: string
  only?: boolean
  skip?: boolean
}

const run = async (test: Test) => {
  try {
    const testWorkspacePath = test.path.includes('/')
      ? test.path.split('/')[test.path.split('/').length - 1]
      : test.path
    const workspacePathSrc = path.join(
      extensionRoot,
      `src/test/${test.path}/${testWorkspacePath}-workspace`
    )
    const workspacePathDist = path.join(
      extensionRoot,
      `dist/test/${test.path}/${testWorkspacePath}-workspace-dist`
    )
    await fs.copy(workspacePathSrc, workspacePathDist)
    const extensionTestsPath = path.join(__dirname, test.path, 'run')
    const vscodeExecutablePath = await downloadAndUnzipVSCode(vscodeVersion)
    // const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath)

    // cp.spawnSync(cliPath, ['--install-extension', 'SimonSiefke.ddev'], {
    //   encoding: 'utf-8',
    //   stdio: 'inherit',
    // })

    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ['--disable-extensions', workspacePathDist],
    })
  } catch (err) {
    console.error('Failed to run tests')
    process.exit(1)
  }
}

const tests: Test[] = [
  {
    path: 'basic',
  },
  {
    path: 'advanced/language-javascriptreact',
  },
  {
    path: 'advanced/language-php',
  },
  {
    path: 'advanced/language-ruby',
  },
]
;(async () => {
  const onlyTest = tests.find(test => test.only)
  if (onlyTest) {
    await run(onlyTest)
    return
  }
  for (const test of tests) {
    if (test.skip) {
      continue
    }
    await run(test)
  }
})()
