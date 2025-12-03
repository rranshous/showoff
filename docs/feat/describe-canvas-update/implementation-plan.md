# Implementation Plan: Describe Canvas Update Tool

## Milestone 1: Register No-Op Tool

Register a new language model tool called `describe_canvas_update` that accepts a description string parameter. The tool does nothing with the input but returns a success message indicating it received the description. This validates the tool registration and parameter handling.

**Expected Outcome**: Copilot can call `describe_canvas_update` with a description string and receives a success response. The tool appears in available tools list.

---

## Milestone 2: Call Language Model

Update the tool to call the VS Code Language Model API, targeting Claude Sonnet 4.5. Pass the description string to the model. Return whatever response the model provides (even if not useful yet).

**Expected Outcome**: Tool successfully selects and calls Claude Sonnet 4.5 via VS Code LM API. Response from model is returned to Copilot.

---

## Milestone 3: Generate and Render Canvas JS

Craft a prompt that instructs the model to generate JavaScript code for the canvas based on the description. The prompt must include the canvas environment details currently documented in the `draw_canvas` tool description: available libraries (GSAP, PIXI.js, MotionPathPlugin, Draggable), context variables (`ctx`, `canvas`), WebGL limitations, best practices, and expected code format. Parse the JS from the model response and execute it on the canvas via the existing canvas provider.

**Expected Outcome**: Describing a simple visual (e.g., "draw a red circle") results in that visual appearing on the canvas.

---

## Milestone 4: Include Current JS in Context

Capture the current JavaScript code from the canvas and include it in the model prompt. The model still returns complete replacement JS, but having the current code as context allows it to incorporate or modify existing elements in the new output.

**Expected Outcome**: Describing an update (e.g., "make the circle blue") results in new complete JS that reflects the change while preserving other existing elements from the previous code.

---

## Milestone 5: Include Screenshot in Context

Capture a screenshot of the rendered canvas from the webview and include it as an image in the model prompt. This provides visual context to the model about what's currently displayed.

**Expected Outcome**: Model receives both the current JS and a visual screenshot, enabling more accurate updates based on what's actually rendered.

---

## Stretch Goals

### Stretch A: Include Canvas Dimensions in Context

Query the current canvas size from the webview and include the actual width/height values in the model prompt. This allows the model to generate code with accurate positioning rather than relying on canvas.width/height at runtime.

**Expected Outcome**: Model knows exact canvas dimensions (e.g., "Canvas is 400x300 pixels") and can position elements precisely.
