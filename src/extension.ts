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

interface WindowManagerInput {
    action: 'create' | 'update' | 'destroy' | 'layout' | 'query' | 'communicate';
    windowId?: string;
    windowTitle?: string;
    windowType?: 'canvas' | 'markup' | 'html' | 'custom';
    gridPosition?: {
        row: number;
        col: number;
        rowSpan?: number;
        colSpan?: number;
    };
    controllerCode?: string;
    content?: string;
    layoutConfig?: {
        gridColumns: number;
        gridRows: number;
    };
    communicationData?: any;
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

    // Register the window manager tool for controlling windows and layouts
    const windowManagerTool: vscode.LanguageModelTool<WindowManagerInput> = {
        invoke: async (options: vscode.LanguageModelToolInvocationOptions<WindowManagerInput>, token: vscode.CancellationToken) => {
            console.log('Window Manager: Tool invoked!');
            console.log('Window Manager: Action:', options.input.action, 'Window:', options.input.windowId);
            
            try {
                const { action, windowId, windowTitle, windowType, gridPosition, controllerCode, content, layoutConfig, communicationData } = options.input;
                
                switch (action) {
                    case 'layout':
                        if (!layoutConfig) {
                            return new vscode.LanguageModelToolResult([
                                new vscode.LanguageModelTextPart(`Error: layoutConfig is required for layout action`)
                            ]);
                        }
                        
                        const newLayout = {
                            gridColumns: layoutConfig.gridColumns,
                            gridRows: layoutConfig.gridRows,
                            windows: windowManagerProvider.getLayout().windows
                        };
                        
                        windowManagerProvider.updateLayout(newLayout);
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Window Manager: Updated layout to ${layoutConfig.gridColumns}x${layoutConfig.gridRows} grid`)
                        ]);
                    
                    case 'create':
                        if (!windowId || !windowTitle || !windowType || !gridPosition) {
                            return new vscode.LanguageModelToolResult([
                                new vscode.LanguageModelTextPart(`Error: windowId, windowTitle, windowType, and gridPosition are required for create action`)
                            ]);
                        }
                        
                        const newWindow = {
                            id: windowId,
                            title: windowTitle,
                            type: windowType,
                            content: content || '',
                            controllerCode: controllerCode,
                            gridPosition: gridPosition
                        };
                        
                        windowManagerProvider.createWindow(newWindow);
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Window Manager: Created ${windowType} window "${windowTitle}" (${windowId}) at position ${gridPosition.row},${gridPosition.col}${controllerCode ? ' with controller agent' : ''}`)
                        ]);
                    
                    case 'update':
                        if (!windowId) {
                            return new vscode.LanguageModelToolResult([
                                new vscode.LanguageModelTextPart(`Error: windowId is required for update action`)
                            ]);
                        }
                        
                        const currentLayout = windowManagerProvider.getLayout();
                        const existingWindow = currentLayout.windows.find(w => w.id === windowId);
                        
                        if (!existingWindow) {
                            return new vscode.LanguageModelToolResult([
                                new vscode.LanguageModelTextPart(`Error: Window ${windowId} does not exist`)
                            ]);
                        }
                        
                        const updatedWindow = {
                            ...existingWindow,
                            ...(windowTitle && { title: windowTitle }),
                            ...(windowType && { type: windowType }),
                            ...(content !== undefined && { content: content }),
                            ...(controllerCode !== undefined && { controllerCode: controllerCode }),
                            ...(gridPosition && { gridPosition: gridPosition })
                        };
                        
                        windowManagerProvider.createWindow(updatedWindow); // createWindow handles updates
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Window Manager: Updated window ${windowId}`)
                        ]);
                    
                    case 'destroy':
                        if (!windowId) {
                            return new vscode.LanguageModelToolResult([
                                new vscode.LanguageModelTextPart(`Error: windowId is required for destroy action`)
                            ]);
                        }
                        
                        windowManagerProvider.destroyWindow(windowId);
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Window Manager: Destroyed window ${windowId}`)
                        ]);
                    
                    case 'query':
                        if (windowId) {
                            const layout = windowManagerProvider.getLayout();
                            const window = layout.windows.find(w => w.id === windowId);
                            if (window) {
                                return new vscode.LanguageModelToolResult([
                                    new vscode.LanguageModelTextPart(`Window ${windowId}: "${window.title}" (${window.type}) at ${window.gridPosition.row},${window.gridPosition.col}${window.controllerCode ? ' [has controller]' : ''}`)
                                ]);
                            } else {
                                return new vscode.LanguageModelToolResult([
                                    new vscode.LanguageModelTextPart(`Window ${windowId} does not exist`)
                                ]);
                            }
                        } else {
                            const layout = windowManagerProvider.getLayout();
                            const windowList = layout.windows.map(w => 
                                `${w.id}: "${w.title}" (${w.type}) at ${w.gridPosition.row},${w.gridPosition.col}`
                            ).join(', ');
                            return new vscode.LanguageModelToolResult([
                                new vscode.LanguageModelTextPart(`Current layout: ${layout.gridColumns}x${layout.gridRows} grid. Windows: ${windowList || 'None'}`)
                            ]);
                        }
                    
                    case 'communicate':
                        // For future implementation - bidirectional communication with WCAs
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Window Manager: Communication action not yet implemented`)
                        ]);
                    
                    default:
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(`Error: Unknown action "${action}"`)
                        ]);
                }
            } catch (error) {
                console.error('Window Manager: Error managing windows:', error);
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(`Error managing windows: ${error}`)
                ]);
            }
        },
        
        prepareInvocation: async (options, token) => {
            const { action, windowId, windowTitle } = options.input;
            return {
                invocationMessage: `Managing window system: ${action}${windowId ? ` ${windowId}` : ''}${windowTitle ? ` "${windowTitle}"` : ''}`
            };
        }
    };

    // Register the tools with VS Code
    const canvasToolRegistration = vscode.lm.registerTool('draw_canvas', drawCanvasTool);
    const screensToolRegistration = vscode.lm.registerTool('manage_virtual_screens', virtualScreensTool);
    const windowManagerToolRegistration = vscode.lm.registerTool('manage_window_system', windowManagerTool);
    context.subscriptions.push(canvasToolRegistration, screensToolRegistration, windowManagerToolRegistration);
    
    console.log('ShowOff: Canvas drawing tool registered successfully!');
    console.log('Virtual Screens: Management tool registered successfully!');
    console.log('Window Manager: Management tool registered successfully!');
}

export function deactivate() {}