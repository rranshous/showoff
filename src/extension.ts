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

interface DescribeCanvasUpdateInput {
    description: string;
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
                                let result = `Window ${windowId}: "${window.title}" (${window.type}) at ${window.gridPosition.row},${window.gridPosition.col}`;
                                if (window.controllerCode) {
                                    result += `\nWindow Controller Agent:\n${window.controllerCode}`;
                                }
                                if (window.content) {
                                    result += `\nContent: ${window.content}`;
                                }
                                return new vscode.LanguageModelToolResult([
                                    new vscode.LanguageModelTextPart(result)
                                ]);
                            } else {
                                return new vscode.LanguageModelToolResult([
                                    new vscode.LanguageModelTextPart(`Window ${windowId} does not exist`)
                                ]);
                            }
                        } else {
                            const layout = windowManagerProvider.getLayout();
                            const windowList = layout.windows.map(w => 
                                `${w.id}: "${w.title}" (${w.type}) at ${w.gridPosition.row},${w.gridPosition.col}${w.controllerCode ? ' [WCA]' : ''}`
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

    // Register the describe canvas update tool for natural language canvas modifications
    const describeCanvasUpdateTool: vscode.LanguageModelTool<DescribeCanvasUpdateInput> = {
        invoke: async (options: vscode.LanguageModelToolInvocationOptions<DescribeCanvasUpdateInput>, token: vscode.CancellationToken) => {
            console.log('ShowOff: Describe canvas update tool invoked!');
            console.log('ShowOff: Description:', options.input.description);
            
            try {
                // Debug: List all available models
                const allModels = await vscode.lm.selectChatModels();
                console.log('ShowOff: Available models:');
                for (const m of allModels) {
                    console.log(`  - id: ${m.id}, vendor: ${m.vendor}, family: ${m.family}, name: ${m.name}`);
                }
                
                // Filter for Claude models
                const claudeModels = allModels.filter(m => 
                    m.id.toLowerCase().includes('claude') || 
                    m.family.toLowerCase().includes('claude') ||
                    m.name.toLowerCase().includes('claude')
                );
                console.log('ShowOff: Claude models found:', claudeModels.map(m => m.id));
                
                // Try exact match for claude-sonnet-4.5 first
                let models = allModels.filter(m => m.id === 'claude-sonnet-4.5');
                
                if (models.length === 0) {
                    // Fall back to highest numbered claude-sonnet model
                    const claudeSonnetModels = allModels.filter(m => 
                        m.id.toLowerCase().startsWith('claude-sonnet-')
                    );
                    if (claudeSonnetModels.length > 0) {
                        // Sort by version number (extract number after 'claude-sonnet-')
                        claudeSonnetModels.sort((a, b) => {
                            const versionA = parseFloat(a.id.replace('claude-sonnet-', '')) || 0;
                            const versionB = parseFloat(b.id.replace('claude-sonnet-', '')) || 0;
                            return versionB - versionA; // Descending order
                        });
                        console.log('ShowOff: claude-sonnet-4.5 not found, using highest version:', claudeSonnetModels[0].id);
                        models = [claudeSonnetModels[0]];
                    }
                }
                
                if (models.length === 0 && claudeModels.length > 0) {
                    console.log('ShowOff: No claude-sonnet models, using first available Claude model');
                    models = [claudeModels[0]];
                }
                
                if (models.length === 0) {
                    console.log('ShowOff: No Claude models found, using any available model');
                    models = allModels;
                }
                
                if (models.length === 0) {
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart('Error: No language models available. Please ensure you have access to GitHub Copilot or another LM provider.')
                    ]);
                }
                
                const model = models[0];
                console.log(`ShowOff: Using model: ${model.id} (${model.vendor}/${model.family})`);
                
                // Detailed prompt with canvas environment info (matching draw_canvas tool description)
                const systemPrompt = `You are a JavaScript code generator for an HTML5 canvas visualization system.

ENVIRONMENT:
- ctx: 2D canvas rendering context
- canvas: The canvas element (access .width and .height for dimensions)
- gsap: GSAP animation library (prefer this over requestAnimationFrame)
- PIXI: PIXI.js renderer (use forceCanvas:true - WebGL not supported)
- MotionPathPlugin: GSAP plugin for path animations
- Draggable: GSAP plugin for drag interactions

RULES:
1. Output ONLY raw JavaScript code - no markdown, no code blocks, no explanations
2. Provide function body code only, NOT a function declaration
3. ALWAYS use GSAP for animations - avoid manual requestAnimationFrame loops
4. For complex motion, use MotionPathPlugin
5. For user interaction, use Draggable
6. When updating existing canvas, incorporate relevant elements from the current code

EXAMPLES:
- Simple shape: ctx.fillStyle = "red"; ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 50, 0, Math.PI*2); ctx.fill();
- Animation: const ball = {x: 50, y: 50}; gsap.to(ball, {x: 200, duration: 2, onUpdate: () => { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.beginPath(); ctx.arc(ball.x, ball.y, 20, 0, Math.PI*2); ctx.fill(); }});`;

                // Get current canvas JS if available
                const currentJS = canvasProvider.getLastExecutedJS();
                let userPrompt = options.input.description;
                
                if (currentJS) {
                    userPrompt = `CURRENT CANVAS CODE:
\`\`\`javascript
${currentJS}
\`\`\`

REQUEST: ${options.input.description}

Generate complete replacement JavaScript that fulfills the request while preserving relevant elements from the current code.`;
                } else {
                    userPrompt = `REQUEST: ${options.input.description}

Generate JavaScript for this canvas visualization.`;
                }

                const messages = [
                    vscode.LanguageModelChatMessage.User(systemPrompt + '\n\n' + userPrompt)
                ];
                
                // Send request to the model
                const response = await model.sendRequest(messages, {}, token);
                
                // Collect the response
                let responseText = '';
                for await (const chunk of response.text) {
                    responseText += chunk;
                }
                
                console.log('ShowOff: Model response:', responseText);
                
                // Clean up the response - remove markdown code blocks if present
                let jsCode = responseText.trim();
                
                // Remove ```javascript or ```js code blocks if the model included them despite instructions
                if (jsCode.startsWith('```')) {
                    jsCode = jsCode.replace(/^```(?:javascript|js)?\n?/, '').replace(/\n?```$/, '');
                }
                
                console.log('ShowOff: Executing JS on canvas:', jsCode);
                
                // Execute the JavaScript on the canvas
                canvasProvider.executeJavaScript(jsCode);
                
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(`Canvas updated successfully. Generated and executed JavaScript based on: "${options.input.description}"`)
                ]);
            } catch (error) {
                console.error('ShowOff: Error in describe canvas update:', error);
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(`Error processing canvas update description: ${error}`)
                ]);
            }
        },
        
        prepareInvocation: async (options, token) => {
            return {
                invocationMessage: 'Processing canvas update description...'
            };
        }
    };

    // Register the tools with VS Code
    const canvasToolRegistration = vscode.lm.registerTool('draw_canvas', drawCanvasTool);
    const screensToolRegistration = vscode.lm.registerTool('manage_virtual_screens', virtualScreensTool);
    const windowManagerToolRegistration = vscode.lm.registerTool('manage_window_system', windowManagerTool);
    const describeCanvasUpdateToolRegistration = vscode.lm.registerTool('describe_canvas_update', describeCanvasUpdateTool);
    context.subscriptions.push(canvasToolRegistration, screensToolRegistration, windowManagerToolRegistration, describeCanvasUpdateToolRegistration);
    
    console.log('ShowOff: Canvas drawing tool registered successfully!');
    console.log('ShowOff: Describe canvas update tool registered successfully!');
    console.log('Virtual Screens: Management tool registered successfully!');
    console.log('Window Manager: Management tool registered successfully!');
}

export function deactivate() {}