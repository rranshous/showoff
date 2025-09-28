import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class VirtualScreensProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'virtualscreens.screensView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public updateScreen(action: string, screenId: number, content?: string, title?: string): void {
        if (this._view) {
            const message: any = {
                command: action === 'update' ? 'updateTextScreen' : action === 'create' ? 'createTextScreen' : 'clearScreen',
                screenId: screenId
            };
            
            if (content !== undefined) {
                message.content = content;
            }
            
            if (title !== undefined) {
                message.title = title;
            }
            
            this._view.webview.postMessage(message);
            console.log(`Virtual Screens: ${action} screen ${screenId}`);
        } else {
            console.error('Virtual Screens: Cannot update screen - webview not available');
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