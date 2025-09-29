import * as vscode from 'vscode';
import { ShowOffCanvasProvider } from './canvasProvider';
import { VirtualScreensProvider } from './virtualScreensProvider';
import { WindowManagerProvider } from './windowManagerProvider';

// Interface for our tool inputs
interface DrawCanvasInput {
    jsFunction: string;
}

interface VirtualScreensInput {
    action: 'create' | 'update' | 'clear' | 'read' | 'list';
    screenId?: number;
    screenType?: 'text' | 'canvas';
    content?: string;
    title?: string;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('ShowOff extension is now active!');

    // Register the webview providers
    const canvasProvider = new ShowOffCanvasProvider(context.extensionUri);
    const screensProvider = new VirtualScreensProvider(context.extensionUri);
    const windowManagerProvider = new WindowManagerProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('showoff.canvasView', canvasProvider),
        vscode.window.registerWebviewViewProvider('virtualscreens.screensView', screensProvider),
        vscode.window.registerWebviewViewProvider('windowmanager.managerView', windowManagerProvider)
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
            
            try {
                // Send the JavaScript function to the webview for execution
                canvasProvider.executeJavaScript(options.input.jsFunction);
                
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(`Successfully executed JavaScript on the ShowOff canvas. The drawing commands have been sent to the canvas webview.`)
                ]);
            } catch (error) {
                console.error('ShowOff: Error executing JavaScript on canvas:', error);
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(`Error executing JavaScript on canvas: ${error}`)
                ]);
            }
        },
        
        prepareInvocation: async (options, token) => {
            return {
                invocationMessage: 'Drawing on ShowOff canvas...'
            };
        }
    };

    // Register the virtual screens tool for managing multiple text screens
    const virtualScreensTool: vscode.LanguageModelTool<VirtualScreensInput> = {
        invoke: async (options: vscode.LanguageModelToolInvocationOptions<VirtualScreensInput>, token: vscode.CancellationToken) => {
            console.log('Virtual Screens: Tool invoked!');
            console.log('Virtual Screens: Action:', options.input.action, 'Screen:', options.input.screenId);
            
            try {
                const { action, screenId, screenType, content, title } = options.input;
                
                if (action === 'list') {
                    const screens = screensProvider.getAllScreens();
                    const screenList = screens.map(s => `Screen ${s.id} (${s.type}): "${s.title}"`).join(', ');
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(`Current screens: ${screenList || 'No screens active'}`)
                    ]);
                }
                
                if (!screenId) {
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(`Error: screenId is required for ${action} action`)
                    ]);
                }
                
                if (action === 'read') {
                    const screen = screensProvider.readScreen(screenId);
                    if (screen) {
                        const contentPreview = screen.type === 'canvas' 
                            ? `Canvas screen (${screen.content ? 'has drawing code' : 'empty'})`
                            : screen.content;
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Screen ${screenId} (${screen.type}): "${screen.title}"\nContent: ${contentPreview}`)
                        ]);
                    } else {
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Screen ${screenId} does not exist.`)
                        ]);
                    }
                } else {
                    // Handle create/update/clear actions
                    if (action === 'update' && !content && !title) {
                        // If update with no content/title, clear the screen
                        screensProvider.updateScreen('clear', screenId, screenType, content, title);
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Virtual Screens: Cleared screen ${screenId} (no content provided for update).`)
                        ]);
                    } else {
                        screensProvider.updateScreen(action, screenId, screenType, content, title);
                        
                        let actionDescription = '';
                        switch (action) {
                            case 'create':
                                actionDescription = `Created screen ${screenId}${title ? ` titled "${title}"` : ''}`;
                                break;
                            case 'update':
                                actionDescription = `Updated screen ${screenId} with new content`;
                                break;
                            case 'clear':
                                actionDescription = `Removed screen ${screenId}`;
                                break;
                        }
                        
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Virtual Screens: ${actionDescription}. Content has been updated in the virtual screens panel.`)
                        ]);
                    }
                }
            } catch (error) {
                console.error('Virtual Screens: Error managing screen:', error);
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(`Error managing virtual screen: ${error}`)
                ]);
            }
        },
        
        prepareInvocation: async (options, token) => {
            const { action, screenId, title } = options.input;
            return {
                invocationMessage: `Managing virtual screen ${screenId}: ${action}${title ? ` "${title}"` : ''}`
            };
        }
    };

    // Register the tools with VS Code
    const canvasToolRegistration = vscode.lm.registerTool('draw_canvas', drawCanvasTool);
    const screensToolRegistration = vscode.lm.registerTool('manage_virtual_screens', virtualScreensTool);
    context.subscriptions.push(canvasToolRegistration, screensToolRegistration);
    
    console.log('ShowOff: Canvas drawing tool registered successfully!');
    console.log('Virtual Screens: Management tool registered successfully!');
}

export function deactivate() {}