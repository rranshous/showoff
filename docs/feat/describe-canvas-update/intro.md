# Feature: Describe Canvas Update Tool

## Summary

Add a new language model tool (`describe_canvas_update`) that allows Copilot to describe desired canvas changes in natural language rather than writing full JavaScript code. The extension will handle the JS generation internally by calling an LM (Claude Sonnet 4.5) with the description, current canvas JS, and a screenshot of the rendered canvas.

## Goals

- Reduce context usage within the Copilot session by offloading JS generation
- Enable visual feedback loop via screenshot capture of current canvas state
- Provide a simpler interface for Copilot to request canvas modifications

## How It Works

1. Copilot calls `describe_canvas_update` with a natural language description of desired changes
2. Extension captures:
   - Current JavaScript code from the canvas
   - Screenshot of the rendered canvas (if possible)
3. Extension calls LM API (Claude Sonnet 4.5) with this context
4. LM generates updated JavaScript
5. Extension executes the new JS on the canvas
6. Tool returns success/error to Copilot

## Boundaries

- This feature focuses on the new tool only
- Screenshot capture from webview will be included
- Error handling returns descriptive messages (no fallback to Copilot for now)
- Future work (out of scope): user interaction scaffolding for canvas state persistence

## Questions/Decisions

- Model ID for Claude Sonnet 4.5 needs to be determined via VS Code LM API
