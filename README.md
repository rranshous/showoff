# ShowOff - Visual Copilot Canvas

Give Copilot a visual canvas to draw and collaborate! 🎨

## Overview

ShowOff is a VS Code extension that provides Copilot with a dedicated visual canvas for drawing, charting, and creating visualizations. Instead of being limited to text responses, Copilot can now draw shapes, create diagrams, build charts, and visualize data directly on an interactive HTML5 canvas.

## Features

- **Full-screen canvas** that fills the entire panel and automatically resizes
- **Real-time drawing** - Copilot executes JavaScript directly on the canvas
- **Seamless integration** - Works with both `#draw_canvas` references and automatic agent mode
- **Persistent canvas** - Drawings remain visible as you continue your conversation
- **Error handling** - Clear error messages displayed on canvas when code fails
- **VS Code theme integration** - Clean, professional UI that matches your editor

## How It Works

1. **Open the ShowOff panel** by clicking the canvas icon in the activity bar
2. **Ask Copilot to draw something** using natural language:
   - "Draw a red circle"
   - "Create a bar chart showing sales data"
   - "Visualize a binary tree"
   - "Make a flowchart for the login process"
3. **Reference explicitly** with `#draw_canvas` or let agent mode automatically use it
4. **Watch Copilot create** real-time visualizations using JavaScript and HTML5 Canvas API

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