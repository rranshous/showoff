# Idea

Expirement w/ giving copilot another visual sub-frame

## Specifics

Create a VSCode extension which allows copilot (model) to draw things in vscode (via tool use)

## Impl idea

VSCode extension with it's own side panel.

The extension registers a tool which lets copilot draw on an HTML canvas

When the model "calls" the tool is sends as an arg the JS function to run in the side panel

## Goals

See if giving the model more space to "draw" and be more visual helps in collaboration

## Future musings
What if it could register click maps and recieve back events?