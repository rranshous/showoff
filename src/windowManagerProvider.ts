import * as vscode from 'vscode';

interface Window {
    id: string;
    title: string;
    type: 'canvas' | 'markup' | 'html' | 'custom';
    content?: string;
    controllerCode?: string; // WCA JavaScript
    gridPosition: {
        row: number;
        col: number;
        rowSpan?: number;
        colSpan?: number;
    };
}

interface WindowLayout {
    gridColumns: number;
    gridRows: number;
    windows: Window[];
}

export class WindowManagerProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'windowmanager.managerView';

    private _view?: vscode.WebviewView;
    private _currentLayout: WindowLayout = {
        gridColumns: 1,
        gridRows: 1,
        windows: []
    };

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

        // Listen for messages from the webview
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'webview-ready':
                        console.log('Window Manager webview is ready!');
                        // Send initial layout when webview is ready
                        this._syncLayoutToWebview();
                        return;
                }
            },
            undefined,
            []
        );
    }

    // Layout management methods
    public updateLayout(layout: WindowLayout): void {
        this._currentLayout = layout;
        console.log(`Window Manager: Updated layout to ${layout.gridColumns}x${layout.gridRows} grid with ${layout.windows.length} windows`);
        this._syncLayoutToWebview();
    }

    public createWindow(window: Window): void {
        // Remove existing window with same ID if it exists
        this._currentLayout.windows = this._currentLayout.windows.filter(w => w.id !== window.id);
        // Add new window
        this._currentLayout.windows.push(window);
        console.log(`Window Manager: Created window ${window.id} at grid position ${window.gridPosition.row},${window.gridPosition.col}`);
        this._syncLayoutToWebview();
    }

    public destroyWindow(windowId: string): void {
        this._currentLayout.windows = this._currentLayout.windows.filter(w => w.id !== windowId);
        console.log(`Window Manager: Destroyed window ${windowId}`);
        this._syncLayoutToWebview();
    }

    public getLayout(): WindowLayout {
        return { ...this._currentLayout };
    }

    private _syncLayoutToWebview(): void {
        if (this._view) {
            this._view.webview.postMessage({
                command: 'updateLayout',
                layout: this._currentLayout
            });
            console.log(`Window Manager: Synced layout to webview (${this._currentLayout.windows.length} windows)`);
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'window-manager.html'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        // Read the HTML file
        const fs = require('fs');
        const path = vscode.Uri.joinPath(this._extensionUri, 'media', 'window-manager.html').fsPath;
        let html = fs.readFileSync(path, 'utf8');
        
        // Replace the nonce placeholder if we had one
        // html = html.replace(/{{nonce}}/g, nonce);
        
        return html;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}