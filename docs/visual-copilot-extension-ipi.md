# Visual Copilot Extension - IPI

## Introduce

I want to give copilot more space for collaboration

Create a VSCode extension which hooks in a tool so that copilot can draw on a canvas in a side panel using a js function

## Project name
The project is named `showoff`. use that for any package names etc.

## Plan

### Technical 
Typescript

### Milestones
1. basic extension which has an activity button which opens a panel
2. Update the panel to show a web page
3. update the webpage to have a canvas with hello world text on it
4. register a tool with copilot that takes a js function as arg and prints it to console
5. have the tool run the js function in the side panel and draw on the canvas
6. test and refine

### Refs 
[VSCode guide on ai tools](https://code.visualstudio.com/api/extension-guides/ai/tools)

## Progress

### ✅ Milestone 1: Basic extension with activity button and panel
- Created VS Code extension structure with package.json and TypeScript setup
- Added ShowOff activity bar button with canvas icon
- Implemented webview provider that shows basic HTML content in side panel
- Extension compiles successfully and ready for testing

**To test:** Press F5 to launch Extension Development Host, then click the ShowOff icon in the activity bar to see the panel with "Welcome to the ShowOff visual canvas!" message.

### ✅ Milestone 2: Panel shows proper web page
- Created dedicated HTML file (`media/canvas.html`) with proper structure
- Updated canvasProvider to load HTML from file instead of inline strings
- Added professional CSS styling with VS Code theme integration
- Implemented webview-extension communication with message handling
- Enhanced UI with status cards, proper layout, and milestone progress tracking

**To test:** Press F5 to launch Extension Development Host. The ShowOff panel now shows a professionally styled web page with extension status, progress indicators, and a reserved canvas area.

### ✅ Milestone 3: Canvas with Hello World text
- Added HTML5 canvas element (400x300px) to the webview panel
- Implemented JavaScript canvas initialization with "Hello World!" text drawing
- Added VS Code blue styling (#007ACC) with decorative underline
- Updated status indicators to show active canvas capabilities
- Canvas renders text centered with professional typography

**To test:** Press F5 to launch Extension Development Host. Click the ShowOff icon in the activity bar to see the panel with an active canvas displaying "Hello World!" text in VS Code blue with a decorative underline.

### ✅ Milestone 4: Register Copilot tool for JavaScript execution
- Added `languageModelTools` contribution point to package.json for "showoff_draw_canvas" tool
- Implemented LanguageModelTool interface with invoke() and prepareInvocation() methods
- Created tool handler that accepts JavaScript function string as input parameter
- Added console logging functionality to capture and display received JS functions
- Updated VS Code API version to ^1.90.0 to support language model tools
- Tool registration includes proper TypeScript typing with DrawCanvasInput interface

**To test:** Press F5 to launch Extension Development Host. The tool is now registered and available to Copilot. When Copilot calls the "showoff_draw_canvas" tool with a JavaScript function, it will be logged to the console with confirmation message returned.