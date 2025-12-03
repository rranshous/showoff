import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ShowOffCanvasProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'showoff.canvasView';

    private _view?: vscode.WebviewView;
    private _lastExecutedJS: string | null = null;
    private _screenshotResolver: ((data: string | null) => void) | null = null;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public executeJavaScript(jsFunction: string): void {
        if (this._view) {
            this._lastExecutedJS = jsFunction;
            this._view.webview.postMessage({
                command: 'executeJS',
                jsFunction: jsFunction
            });
        } else {
            console.error('ShowOff: Cannot execute JavaScript - webview not available');
        }
    }

    public getLastExecutedJS(): string | null {
        return this._lastExecutedJS;
    }

    public async captureScreenshot(): Promise<Uint8Array | null> {
        if (!this._view) {
            console.error('ShowOff: Cannot capture screenshot - webview not available');
            return null;
        }

        return new Promise((resolve) => {
            // Set up resolver for when webview responds
            this._screenshotResolver = (dataUrl: string | null) => {
                if (dataUrl) {
                    // Convert base64 data URL to Uint8Array
                    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
                    const binaryString = atob(base64Data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    resolve(bytes);
                } else {
                    resolve(null);
                }
                this._screenshotResolver = null;
            };

            // Request screenshot from webview
            this._view!.webview.postMessage({ command: 'captureScreenshot' });

            // Timeout after 5 seconds
            setTimeout(() => {
                if (this._screenshotResolver) {
                    console.error('ShowOff: Screenshot capture timed out');
                    this._screenshotResolver(null);
                }
            }, 5000);
        });
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
                        console.log('ShowOff webview is ready!');
                        return;
                    case 'screenshotCaptured':
                        console.log('ShowOff: Screenshot captured');
                        if (this._screenshotResolver) {
                            this._screenshotResolver(message.dataUrl);
                        }
                        return;
                }
            },
            undefined,
            []
        );
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the path to the HTML file
        const htmlPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'canvas.html');
        
        try {
            // Read the HTML file
            const htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');
            return htmlContent;
        } catch (error) {
            console.error('Error loading HTML file:', error);
            // Fallback HTML if file can't be loaded
            return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ShowOff Canvas - Error</title>
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
                    <h1>ShowOff Canvas</h1>
                    <p>Error loading canvas.html file. Using fallback content.</p>
                    <p>Error: ${error}</p>
                </body>
                </html>`;
        }
    }
}