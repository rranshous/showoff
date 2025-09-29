import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface VirtualScreen {
    id: number;
    type: 'text' | 'canvas';
    title: string;
    content: string;
}

export class VirtualScreensProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'virtualscreens.screensView';

    private _view?: vscode.WebviewView;
    private _screens: Map<number, VirtualScreen> = new Map();

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public updateScreen(action: string, screenId: number, screenType?: string, content?: string, title?: string): void {
        // Update backend state
        if (action === 'create' || action === 'update') {
            if (!screenType && !this._screens.has(screenId)) {
                throw new Error(`Cannot ${action} screen ${screenId}: screenType required for new screens`);
            }
            
            const existingScreen = this._screens.get(screenId);
            const finalType = screenType || existingScreen?.type || 'text';
            const finalTitle = title || existingScreen?.title || `${finalType === 'canvas' ? '🎨 Canvas' : '📄 Text'} Screen #${screenId}`;
            const finalContent = content || existingScreen?.content || '';
            
            const screen: VirtualScreen = {
                id: screenId,
                type: finalType as 'text' | 'canvas',
                title: finalTitle,
                content: finalContent
            };
            
            this._screens.set(screenId, screen);
            console.log(`Virtual Screens: ${action} ${finalType} screen ${screenId} in backend state`);
            
            // Send selective update to preserve other screen animations
            this._updateSingleScreen(screen);
        } else if (action === 'clear') {
            this._screens.delete(screenId);
            console.log(`Virtual Screens: removed screen ${screenId} from backend state`);
            
            // Send selective removal
            this._removeSingleScreen(screenId);
        }
    }

    public readScreen(screenId: number): VirtualScreen | null {
        return this._screens.get(screenId) || null;
    }

    public getAllScreens(): VirtualScreen[] {
        return Array.from(this._screens.values()).sort((a, b) => a.id - b.id);
    }

    private _syncToWebview(): void {
        if (this._view) {
            const screens = this.getAllScreens();
            this._view.webview.postMessage({
                command: 'syncScreens',
                screens: screens
            });
            console.log(`Virtual Screens: synced ${screens.length} screens to webview`);
        }
    }

    private _updateSingleScreen(screen: VirtualScreen): void {
        if (this._view) {
            this._view.webview.postMessage({
                command: 'updateSingleScreen',
                screen: screen
            });
            console.log(`Virtual Screens: sent single update for screen ${screen.id}`);
        }
    }

    private _removeSingleScreen(screenId: number): void {
        if (this._view) {
            this._view.webview.postMessage({
                command: 'removeSingleScreen',
                screenId: screenId
            });
            console.log(`Virtual Screens: sent removal for screen ${screenId}`);
        }
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Listen for messages from the webview
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'webview-ready':
                        console.log('Virtual Screens webview is ready!');
                        // Send initial sync when webview is ready
                        this._syncToWebview();
                        return;
                }
            },
            undefined,
            []
        );
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the path to the HTML file
        const htmlPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'virtual-screens.html');
        
        try {
            // Read the HTML file
            const htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');
            return htmlContent;
        } catch (error) {
            console.error('Error loading virtual-screens.html file:', error);
            // Fallback HTML if file can't be loaded
            return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Virtual Screens - Error</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: var(--vscode-font-family);
                            background-color: var(--vscode-editor-background);
                            color: var(--vscode-editor-foreground);
                        }
                    </style>
                </head>
                <body>
                    <h1>Virtual Screens</h1>
                    <p>Error loading virtual-screens.html file. Using fallback content.</p>
                    <p>Error: ${error}</p>
                </body>
                </html>`;
        }
    }
}