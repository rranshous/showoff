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
3. update the webpage to have a canvas and some random shapes
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