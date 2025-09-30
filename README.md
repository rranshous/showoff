# ShowOff - Visual Copilot Workspace

Give Copilot visual canvases and multiple screens to draw, display, and collaborate! 🎨🖥️

<img width="2495" height="1023" alt="Screenshot from 2025-09-30 07-34-11" src="https://github.com/user-attachments/assets/4722a273-2e31-492f-8831-cb72e8da63e8" />


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
- **Markdown support** - Rich text formatting with headers, bold, italic, code blocks, lists, and links
- **Dynamic management** - Create, update, read, and remove screens on demand
- **Animation preservation** - Selective updates maintain canvas animations when other screens change
- **Organized workspace** - Each screen has unique ID and title for easy reference
- **Backend state management** - Robust architecture with persistent content storage
- **Responsive design** - Screens adapt to content with proper overflow handling

### Window Manager System 🆕
- **AI-controlled window layouts** - Copilot defines grid-based window positioning and sizing
- **Window Controller Agents (WCAs)** - Deploy custom JavaScript agents to control window behavior
- **Multiple window types** - Canvas, markup, HTML, and custom content types
- **Dynamic layouts** - Flexible grid system with configurable rows and columns
- **Real-time management** - Create, update, destroy, and query windows programmatically
- **Advanced positioning** - Grid coordinates with row/column spanning support
- **Professional UI** - Clean window frames with titles and responsive content areas

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
   - "Create a **todo list** with `#priorities` on screen 1" (markdown formatting)
   - "Show project status on a new screen"  
   - "Draw a flowchart on canvas screen 2"
   - "Read what's on screen 3"
3. **Organize information** across multiple persistent screens
4. **Mix content types** - text screens with markdown formatting, canvas screens with preserved animations

### Window Manager System
1. **Open the Window Manager panel** by clicking the window icon in the activity bar
2. **Ask Copilot to manage windows** using natural language or `#window_system`:
   - "Create a 3x2 grid layout"
   - "Add a canvas window at position 0,0 with a bouncing ball animation"
   - "Create a markup window showing project status at row 1, column 0"
   - "Deploy a Window Controller Agent that updates the title every second"
   - "Query all current windows and their positions"
3. **Advanced layouts** - Multi-row, multi-column grids with spanning support
4. **Window Controller Agents** - Custom JavaScript that controls window behavior dynamically

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

### Canvas Drawing
Copilot can create visualizations and animations:

```javascript
// Animated bouncing ball
let x = 50, y = 50, dx = 2, dy = 3;
function animate() {
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  x += dx; y += dy;
  if (x > canvas.width || x < 0) dx = -dx;
  if (y > canvas.height || y < 0) dy = -dy;
  requestAnimationFrame(animate);
}
animate();
```

### Virtual Screens with Markdown
Rich text formatting in text screens:

```markdown
# Project Dashboard
## Current Status: ✅ **On Track**

### 🎯 Goals
- **Phase 1**: Core features ✅
- **Phase 2**: *Testing & refinement* 🔄  
- **Phase 3**: Deployment planning 📋

### 💻 Technical Notes
```typescript
// Key implementation detail
function processData() { return results; }
```

**Next meeting**: [Calendar Link](https://calendar.app)
```

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
