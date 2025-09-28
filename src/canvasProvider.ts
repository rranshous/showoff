import * as vscode from 'vscode';

export class ShowOffCanvasProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'showoff.canvasView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

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
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>ShowOff Canvas</title>
				<style>
					body {
						margin: 0;
						padding: 20px;
						font-family: var(--vscode-font-family);
						background-color: var(--vscode-editor-background);
						color: var(--vscode-editor-foreground);
					}
					h1 {
						margin-top: 0;
					}
				</style>
			</head>
			<body>
				<h1>ShowOff Canvas</h1>
				<p>Welcome to the ShowOff visual canvas! This is where Copilot will be able to draw and collaborate visually.</p>
				<p>Status: Ready for milestone 1 ✅</p>
			</body>
			</html>`;
    }
}