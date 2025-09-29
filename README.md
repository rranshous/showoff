# ShowOff - Visual Copilot Workspace

Give Copilot visual canvases and multiple screens to draw, display, and collaborate! 🎨🖥️

<img width="1966" height="803" alt="Screenshot from 2025-09-28 18-35-41" src="https://github.com/user-attachments/assets/7128ee5a-f45c-481e-ab9a-5e65005ec3d5" />

## Overview

ShowOff is a VS Code extension that provides Copilot with both a dedicated visual canvas AND multiple virtual screens for comprehensive visual collaboration. Instead of being limited to text responses, Copilot can now:

- Draw shapes, charts, and diagrams on a full-screen canvas  
- Create and manage multiple virtual screens (text and canvas types)
- Organize information across multiple persistent displays
- Read back content from screens for continued collaboration

## Features

### Canvas Drawing
- **Full-screen canvas** that fills the entire panel and automatically resizes
- **Real-time drawing** - Copilot executes JavaScript directly on the canvas
- **Persistent canvas** - Drawings remain visible as you continue your conversation

### Virtual Screens  
- **Multiple screen types** - Text screens for content, Canvas screens for drawings
- **Dynamic management** - Create, update, read, and remove screens on demand
- **Organized workspace** - Each screen has unique ID and title for easy reference
- **Backend state management** - Robust architecture with persistent content storage
- **Responsive design** - Screens adapt to content with proper overflow handling

### Integration
- **Seamless Copilot integration** - Works with tool references and automatic agent mode
- **Error handling** - Clear error messages and graceful failure handling  
- **VS Code theme integration** - Clean, professional UI that matches your editor

## How It Works

### Canvas Drawing
1. **Open the ShowOff panel** by clicking the canvas icon in the activity bar  
2. **Ask Copilot to draw** using natural language or `#draw_canvas`:
   - "Draw a red circle"
   - "Create a bar chart showing sales data"
   - "Visualize a binary tree"

### Virtual Screens
1. **Open the Virtual Screens panel** by clicking the desktop icon in the activity bar
2. **Ask Copilot to manage screens** using natural language or `#virtual_screens`:
   - "Create a todo list on screen 1"
   - "Show project status on a new screen"  
   - "Draw a flowchart on canvas screen 2"
   - "Read what's on screen 3"
3. **Organize information** across multiple persistent screens
4. **Mix content types** - text screens for lists/info, canvas screens for diagrams

## Installation

1. Clone this repository
2. Open in VS Code
3. Run `npm install`
4. Press `F5` to launch Extension Development Host
5. Click the ShowOff icon in the activity bar

## Technical Details

- **Language Model Tool**: Registered as `draw_canvas` tool for Copilot integration
- **Canvas API**: Full HTML5 Canvas support with `ctx` and `canvas` objects
- **Security**: Content Security Policy allows safe JavaScript execution
- **Responsive**: Canvas automatically resizes to match panel dimensions

## Examples

Copilot can draw anything using standard Canvas API methods:

```javascript
// Draw a simple chart
ctx.fillStyle = 'blue';
ctx.fillRect(50, 100, 30, 100);
ctx.fillStyle = 'red';
ctx.fillRect(100, 80, 30, 120);
ctx.fillText('Sales Data', 50, 50);
```

## Development

Built following the Introduce, Plan, Implement pattern:

### Completed Milestones
- ✅ **Milestone 1**: Basic extension with activity button and panel
- ✅ **Milestone 2**: Panel shows proper web page
- ✅ **Milestone 3**: Canvas with Hello World text
- ✅ **Milestone 4**: Registered Copilot tool for JavaScript execution
- ✅ **Milestone 5**: Execute JavaScript in webview canvas
- ✅ **Milestone 6**: Test and refine with polished UI

## Repository

- **GitHub**: [rranshous/showoff](https://github.com/rranshous/showoff)
- **Language**: TypeScript
- **Platform**: VS Code Extension API

## Future Ideas

- Click maps and event handling for interactive canvases
- Multiple canvas support
- Export drawings as images
- Canvas history and undo functionality
- Animation and real-time updates

---

**Give Copilot more space to show off its visual capabilities!** 🚀
