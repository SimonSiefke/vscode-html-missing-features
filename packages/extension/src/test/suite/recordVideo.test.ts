import { TestCase, createTestFile, run, activateExtension } from '../test-utils'
import { before, after } from 'mocha'
import * as vscode from 'vscode'

suite('Emmet Complete Tag', () => {
  before(async () => {
    await createTestFile('index.html')
    await activateExtension()
    vscode.commands.executeCommand('chronicler.record')
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  after(async () => {
    await vscode.commands.executeCommand('chronicler.stop')
  })

  test('basic', async () => {
    const testCases: TestCase[] = [
      {
        input: '|',
        type:
          '<!DOCTYPE html>\nh{tab}h{tab}t{tab}Page Title{down}\nb{tab}h1{tab}This is a heading{end}\np{tab}This is a paragraph',
        expect: '<!DOCTYPE html>\n<html>\n  \n</html>',
        speed: 100,
      },
      // {
      //   input: '|',
      //   type:
      //     '<!DOCTYPE html>\nh{tab}h{tab}m{tab}\nl{tab}\nt{tab}Hello World{down}\nb{tab}d{tab}u{tab}l{tab}1{copyLineDown}{backspace}2{copyLineDown}{backspace}3{copyLineDown}{backspace}4{copyLineDown}{backspace}5',
      //   expect: '<!DOCTYPE html>\n<html>\n  \n</html>',
      //   speed: 100,
      // },
    ]
    await run(testCases)
  })
})
