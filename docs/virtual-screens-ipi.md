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


### Milestones
- add additional panel in vscode
- update new panel to show a web page
- add a new tool so that the model can set it's content
- update the webpage to have a virtual screen (text)
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
