# Virtual Screens - IPI

## Introduce

What if we presented the model w/ virtual screens it could draw or put text on?

# Context
This is expiremental, exploratory work. keep it simple

## Project name
The project is named `virtual-screens`. Use that for any package names etc.

## Plan


### Technical 
add additional tools for this new featureset

We'll need to add another panel(s) to vscode in addition to the canvas we have now

We are only adding one new tool, it will support managing multiple virtual screens

### Milestones
- add additional panel in vscode
- update new panel to show a web page
- update the webpage to have a virtual screen (text)
- add a new tool so that the model can set it's content
- add two more virtual screens (one canvas one text?)
- refine the prompts
- have fun

### Refs 


## Progress

### 🚧 In Progress


### ✅ Completed Milestones

### ✅ Milestone 1: Add additional panel in VS Code
- Created VirtualScreensProvider webview provider class
- Added new view container "virtualscreens-sidebar" with desktop icon
- Registered virtualscreens.screensView in package.json views configuration  
- Updated extension.ts to register both canvas and virtual screens providers
- Extension compiles successfully with two separate panels available

**To test:** Press F5 to launch Extension Development Host. You should now see two icons in the activity bar - the original ShowOff canvas and the new Virtual Screens panel with a desktop icon.

### ✅ Milestone 2: Update new panel to show a web page
- Created dedicated virtual-screens.html file with professional structure and styling
- Updated VirtualScreensProvider to load HTML from file with proper error handling
- Added VS Code theme integration with consistent colors and typography
- Created screens-container layout ready for multiple virtual screens
- Implemented webview-extension communication foundation for future screen management
- Added placeholder content indicating readiness for screen management tool

**To test:** Press F5 to launch Extension Development Host. Click the Virtual Screens icon to see the professionally styled panel with header, screens container, and placeholder content ready for virtual screen implementation.

### ✅ Milestone 3: Update the webpage to have a virtual screen (text)
- Added first virtual text screen with proper HTML structure and styling
- Implemented JavaScript functions for screen management: updateTextScreen, createTextScreen, clearScreen
- Added VS Code theme-integrated styling for text screens with editor background and borders
- Created demo text screen showing concept with welcome content and instructions
- Added message handling for future tool integration (updateTextScreen, createTextScreen, clearScreen commands)
- Text screens support pre-formatted text, line breaks, and proper typography

**To test:** Press F5 to launch Extension Development Host. Click the Virtual Screens icon to see the first functional text screen displaying welcome content. The screen management functions are ready for AI tool integration.

### ✅ Milestone 4: Add a new tool so the model can set content
- Added "manage_virtual_screens" tool configuration to package.json languageModelTools
- Created VirtualScreensInput interface with action, screenId, content, and title properties
- Implemented tool handler supporting create, update, and clear actions for virtual screens
- Added updateScreen method to VirtualScreensProvider for webview communication
- Registered virtual screens management tool with VS Code language model API
- Tool supports multiple screen management with proper confirmation messages and error handling
- Extension now has both canvas drawing and virtual screens management tools available

**To test:** Press F5 to launch Extension Development Host. Use Copilot with #virtual_screens or let agent mode automatically invoke the tool. Copilot can now create, update, and clear virtual text screens with commands like "show my todo list on screen 2" or "create a new screen with project status".

### ✅ Milestone 5: Add two more virtual screens (one canvas one text?)
- Added canvas screen (#2) with HTML5 canvas element and drawing capabilities
- Added third text screen (#3) to demonstrate multiple text screen support
- Implemented JavaScript functions for canvas screen management (create, update, clear)
- Updated tool schema to support screenType parameter ('text' or 'canvas')
- Enhanced VirtualScreensProvider to handle both text and canvas screen types
- Added proper styling for canvas screens with responsive design and VS Code theme
- Canvas screens support JavaScript drawing code execution (like draw_canvas tool)
- Extension now supports mixed screen types for comprehensive AI interaction

**To test:** Press F5 to launch Extension Development Host. Open Virtual Screens panel to see 3 screens: text (#1), canvas (#2), and text (#3). Use Copilot with commands like "draw a chart on canvas screen 2" or "update text screen 3 with meeting notes". The tool now supports both text content and JavaScript drawing commands.
