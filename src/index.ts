#!/usr/bin/env node

/**
 * UI Audit MCP Server
 *
 * An MCP server for iOS app UI evaluation and testing.
 * Uses idb + xcrun simctl for device operations (launch, screenshot, tap, swipe)
 * and provides a structured checklist-based evaluation workflow.
 *
 * Tools:
 *   Device operations:
 *     - launch_app          Launch an iOS app by bundle ID
 *     - take_screenshot     Capture the current screen as base64 PNG
 *     - tap                 Tap at ratio coordinates (0-1)
 *     - swipe               Swipe between ratio coordinates (0-1)
 *
 *   Evaluation:
 *     - get_checklist        Get the evaluation checklist and create a session
 *     - submit_evaluation    Submit scores and get pass/fail result
 *     - evaluate_style_consistency  Compare multiple screenshots for style consistency
 *     - get_evaluation_log   Query past evaluation results
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { launchAppSchema, launchApp } from "./tools/launch-app.js";
import { takeScreenshotSchema, takeScreenshot } from "./tools/take-screenshot.js";
import { tapSchema, tap } from "./tools/tap.js";
import { swipeSchema, swipe } from "./tools/swipe.js";
import { getChecklistSchema, getChecklist } from "./tools/get-checklist.js";
import { submitEvaluationSchema, submitEvaluation } from "./tools/submit-evaluation.js";
import { evaluateStyleSchema, evaluateStyleConsistency } from "./tools/evaluate-style.js";
import { getEvaluationLogSchema, getEvaluationLog } from "./tools/get-log.js";
import { listApps, listAppsSchema } from "./tools/list-apps.js";

const server = new McpServer({
    name: "ui-audit-mcp",
    version: "1.0.0",
});

// ─── Device operation tools ────────────────────────────────

server.tool(
    "launch_app",
    "Launch an iOS app on the simulator by its bundle ID.",
    launchAppSchema.shape,
    async (args) => launchApp(args)
);

server.tool(
    "list_apps",
    "List installed apps on the booted simulator using 'idb list-apps'. " +
    "Useful for finding bundle IDs. Returns an array of { name, bundleId, type, state }.",
    listAppsSchema.shape,
    async (args) => listApps(args)
);

server.tool(
    "take_screenshot",
    "Capture the current simulator screen as a base64 PNG image. " +
    "Returns the image for visual inspection along with screen metadata.",
    takeScreenshotSchema.shape,
    async (args) => takeScreenshot(args)
);

server.tool(
    "tap",
    "Tap at a specific position on the screen. " +
    "Uses ratio coordinates (0-1): x=0 is left edge, x=1 is right edge, y=0 is top, y=1 is bottom.",
    tapSchema.shape,
    async (args) => tap(args)
);

server.tool(
    "swipe",
    "Swipe from one point to another on the screen. " +
    "Uses ratio coordinates (0-1) for both start and end positions.",
    swipeSchema.shape,
    async (args) => swipe(args)
);

// ─── Evaluation tools ──────────────────────────────────────

server.tool(
    "get_checklist",
    "Get the UI evaluation checklist and create an evaluation session. " +
    "Use type='screen' for single-screen quality evaluation (4 items: overlap, layout, info clarity, ambiguity). " +
    "Use type='style' for multi-screen style consistency evaluation (3 items: color, component, typography).",
    getChecklistSchema.shape,
    async (args) => getChecklist(args)
);

server.tool(
    "submit_evaluation",
    "Submit scores for each checklist item. Determines pass/fail (passing score >= 8) " +
    "and persists the result. Failed items include reasons and suggestions for improvement.",
    submitEvaluationSchema.shape,
    async (args) => submitEvaluation(args)
);

server.tool(
    "evaluate_style_consistency",
    "Compare multiple screenshots for visual style consistency. " +
    "Provide at least 2 screenshots. Returns all images alongside a style consistency checklist. " +
    "After analyzing, call submit_evaluation with the returned sessionId and your scores.",
    evaluateStyleSchema.shape,
    async (args) => evaluateStyleConsistency(args)
);

server.tool(
    "get_evaluation_log",
    "Query past evaluation results and summary statistics. " +
    "Use to review improvement across attempts or generate a final report.",
    getEvaluationLogSchema.shape,
    async (args) => getEvaluationLog(args)
);

import { preflight } from "./device/adapter.js";

// ─── Start server ──────────────────────────────────────────

async function main() {
    // Check for required CLI tools (non-blocking — warn only)
    const check = await preflight();
    if (!check.ok) {
        console.error("[ui-audit-mcp] ⚠️  Missing dependencies:");
        for (const m of check.missing) {
            console.error(`  - ${m}`);
        }
        console.error("[ui-audit-mcp] Some tools (tap, swipe) may not work.");
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[ui-audit-mcp] Server started on stdio transport.");
}

main().catch((err) => {
    console.error("[ui-audit-mcp] Fatal error:", err);
    process.exit(1);
});
