import * as vscode from 'vscode'

type AutoDispose<Fn extends (...args: any) => vscode.Disposable> = (
  ...args: Parameters<Fn>
) => void

export interface VscodeProxy {
  readonly extensions: {
    onDidChange: AutoDispose<typeof vscode.extensions['onDidChange']>
  }
  readonly commands: {
    readonly registerTextEditorCommand: AutoDispose<
      typeof vscode.commands.registerTextEditorCommand
    >
    readonly registerCommand: AutoDispose<
      typeof vscode.commands.registerCommand
    >
  }
  readonly languages: {
    readonly setLanguageConfiguration: AutoDispose<
      typeof vscode.languages.setLanguageConfiguration
    >
  }
  readonly workspace: {
    readonly onDidChangeTextDocument: AutoDispose<
      typeof vscode.workspace.onDidChangeTextDocument
    >
  }
  readonly window: {
    readonly onDidChangeTextEditorSelection: AutoDispose<
      typeof vscode.window.onDidChangeTextEditorSelection
    >
    readonly onDidChangeActiveTextEditor: AutoDispose<
      typeof vscode.window.onDidChangeActiveTextEditor
    >
  }
}

export const createVscodeProxy: (
  context: vscode.ExtensionContext
) => VscodeProxy = context => {
  const autoDispose: <Fn extends (...args: any[]) => vscode.Disposable>(
    fn: Fn
  ) => (...args: Parameters<Fn>) => void = fn => (...args) => {
    context.subscriptions.push(fn(...args))
  }
  return {
    extensions: {
      onDidChange: autoDispose(vscode.extensions.onDidChange),
    },
    languages: {
      setLanguageConfiguration: autoDispose(
        vscode.languages.setLanguageConfiguration
      ),
    },
    window: {
      onDidChangeTextEditorSelection: autoDispose(
        vscode.window.onDidChangeTextEditorSelection
      ),
      onDidChangeActiveTextEditor: autoDispose(
        vscode.window.onDidChangeActiveTextEditor
      ),
    },
    workspace: {
      onDidChangeTextDocument: autoDispose(
        vscode.workspace.onDidChangeTextDocument
      ),
    },
    commands: {
      registerTextEditorCommand: autoDispose(
        vscode.commands.registerTextEditorCommand
      ),
      registerCommand: autoDispose(vscode.commands.registerCommand),
    },
  }
}
