# UI Audit MCP

> Let AI agents evaluate your iOS app's UI — screenshots, taps, swipes, and a 3-dimension scoring system, all from your MCP client.

## Features
- **Device Control**: Launch apps, take screenshots, tap, and swipe on iOS Simulators.
- **UI Evaluation**: 3-dimension user-perspective evaluation (outcome, usability, aesthetics).

## Prerequisites
- **macOS** (required for iOS Simulator)
- **Node.js 18+**
- **Xcode CLI Tools**: `xcode-select --install`
- **idb** (required for tap/swipe):
  ```bash
  brew install idb-companion
  pip3 install fb-idb
  ```

## Install
Add to your MCP client config (Claude Desktop, Cursor, etc.):
```json
{
  "mcpServers": {
    "ui-audit": {
      "command": "npx",
      "args": ["-y", "@wa008/ui-audit-mcp"]
    }
  }
}
```

## Tools
| Tool | Purpose |
|---|---|
| `launch_app` | Launch app by Bundle ID |
| `take_screenshot` | Capture screen & track evaluation step |
| `tap` / `swipe` | Interact with UI (ratio coordinates), screenshot, and track step |
| `input_text` | Type text into the focused field, screenshot, and track step |
| `evaluate` | Get dimension prompt or submit score + get next |
| `get_audit_status` | View missing evaluations or final markdown report |

## Typical Workflow
1. `launch_app("com.example.app")`
2. `take_screenshot("MyTestCase", 1, "Verify Initial Screen")`
3. `evaluate("MyTestCase", 1)` → Returns first dimension prompt
4. Agent analyzes UI → submits score → repeats until all dimensions done
5. `get_audit_status(["MyTestCase"])` → Full markdown report

## Evaluation Dimensions
Each step is scored on up to 3 dimensions (score ≥ 8 to pass):
1. **Outcome** — Did the action produce the expected result? *(action steps only)*
2. **Usability** — Is everything visible, understandable, and interactive?
3. **Aesthetics** — Does it look professional and polished?

## Data
- Logs: `~/.ui-audit-mcp/logs/`
- Screenshots: `~/.ui-audit-mcp/screenshots/`

## License
MIT
