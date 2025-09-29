# Window Manager - IPI

## Introduce

What if we gave the model a sophisticated window manager where it can define window layouts, positions, and Window Controller Agents (WCAs) through JavaScript? Each window would have a model-defined JavaScript agent controlling its content and behavior.

## Context
This is experimental, exploratory work. Keep it simple.

## Core Concept
- **Model defines window layout and positioning** (grid positions, sizes, arrangements)
- **Model supplies Window Controller Agent (WCA)** - JavaScript code for each window
- **WCA controls window content and title** - Dynamic updates, rendering, interactions
- **Model-to-window communication** - Tools to query/interact with running WCAs

## Plan

### Milestone 1: Create new panel that takes most screen real estate
- Full-height panel in VS Code
- Basic container for window manager

### Milestone 2: Implement model-controlled window layout
- Model defines window positions and sizes (grid coordinates, percentages)
- Window creation/destruction based on model layout specifications
- Basic container layout system

### Milestone 3: Single Window Manager Tool
- Create unified tool: `manage_window_system`
- Actions: create, update, destroy, layout, query, communicate
- Tool handles window positioning, WCA deployment, and communication
- Model uses one tool for all window management operations

### Milestone 4: Window Controller Agents (WCAs)
- Tool deploys custom JavaScript Window Controller Agents
- Model supplies WCA JavaScript that controls window content, title, and type
- WCA manages window behavior: (canvas, markup, html, custom rendering)
- WCA has full control over window content updates

### Milestone 5: Advanced window features
- Model-controlled window properties (name, size, position) via layout updates
- Dynamic window type switching through WCA updates
- Window persistence and state management

### Milestone 5: Model-to-Window Communication
- Extend tool with `query` and `communicate` actions
- Model can poll/query information from running WCAs via tool
- WCA can expose data/state back to model for decision making

### Milestone 6: Advanced window features
- Model-controlled window properties (name, size, position) via layout updates
- Dynamic window type switching through WCA updates
- Window persistence and state management

### Milestone 7: Polish and documentation
- Smooth animations/transitions
- Complete tool documentation
- Usage examples

## Success Criteria
- Model defines window layout and positioning programmatically
- Model creates Window Controller Agents (WCAs) with custom JavaScript  
- WCAs control window content, title, and rendering type dynamically
- Model can communicate with/query running WCAs
- Sophisticated layout management with most screen real estate utilized

## Key Innovation
Moving from fixed screen types to:
1. **Model-controlled layout system** - positioning and sizing
2. **Window Controller Agents** - model-supplied JavaScript per window  
3. **Bidirectional communication** - model ↔ WCA interaction