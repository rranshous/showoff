import * as vscode from 'vscode';
import { ShowOffCanvasProvider } from './canvasProvider';

// Interface for our tool input
interface DrawCanvasInput {
    jsFunction: string;
}

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

    // Register the language model tool for drawing on canvas
    const drawCanvasTool: vscode.LanguageModelTool<DrawCanvasInput> = {
        invoke: async (options: vscode.LanguageModelToolInvocationOptions<DrawCanvasInput>, token: vscode.CancellationToken) => {
            console.log('ShowOff: Draw canvas tool invoked!');
            console.log('ShowOff: Received JavaScript function:', options.input.jsFunction);
            
            // For Milestone 4, we just log to console
            // In Milestone 5, we'll execute this in the webview
            
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`Successfully received JavaScript function for canvas drawing. Function logged to console: ${options.input.jsFunction.substring(0, 100)}...`)
            ]);
        },
        
        prepareInvocation: async (options, token) => {
            return {
                invocationMessage: 'Drawing on ShowOff canvas...'
            };
        }
    };

    // Register the tool with VS Code
    const toolRegistration = vscode.lm.registerTool('showoff_draw_canvas', drawCanvasTool);
    context.subscriptions.push(toolRegistration);
    
    console.log('ShowOff: Canvas drawing tool registered successfully!');
}

export function deactivate() {}