import * as vscode from 'vscode';
import { ShowOffCanvasProvider } from './canvasProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('ShowOff extension is now active!');

    // Register the webview provider
    const provider = new ShowOffCanvasProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('showoff.canvasView', provider)
    );

    // Register the show canvas command
    context.subscriptions.push(
        vscode.commands.registerCommand('showoff.showCanvas', () => {
            vscode.commands.executeCommand('workbench.view.extension.showoff-sidebar');
        })
    );
}

export function deactivate() {}