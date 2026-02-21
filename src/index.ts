#!/usr/bin/env node

/**
 * UI Audit MCP Server
 *
 * An MCP server for iOS app UI evaluation and testing.
 * Uses idb + xcrun simctl for device operations (launch, screenshot, tap, swipe)
 * and provides a rule-based, trackable evaluation workflow.
 *
 * Evaluation workflow for each step:
 *   1. Perform an action (tap / swipe / take_screenshot) — auto-takes a screenshot and registers a step.
 *   2. Call evaluate(caseName, stepIndex) — returns the first dimension prompt + token.
 *   3. Visually inspect the screenshot based on the prompt.
 *   4. Call evaluate(caseName, stepIndex, token, score, reason) — records the score, returns the next dimension prompt + new token.
 *   5. Repeat step 3-4 until all 5 dimensions are evaluated.
 *   6. Call get_audit_status to get the final markdown report.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { launchAppSchema, launchApp } from "./tools/launch-app.js";
import { takeScreenshotSchema, takeScreenshot } from "./tools/take-screenshot.js";
import { tapSchema, tap } from "./tools/tap.js";
import { swipeSchema, swipe } from "./tools/swipe.js";
import { evaluateSchema, evaluate } from "./tools/evaluate.js";
import { getAuditStatusSchema, getAuditStatus } from "./tools/get-audit-status.js";

const server = new McpServer({
    name: "ui-audit-mcp",
    version: "2.3.0",
});

// ─── Device operation tools ────────────────────────────────

server.tool(
    "launch_app",
    "Launch an iOS app on the simulator by its bundle ID.",
    launchAppSchema.shape,
    async (args) => launchApp(args)
);

server.tool(
    "take_screenshot",
    "Capture the current simulator screen and register it as a tracked evaluation step. " +
    "After this call, evaluate the screenshot across all required dimensions before moving to the next action.",
    takeScreenshotSchema.shape,
    async (args) => takeScreenshot(args)
);

server.tool(
    "tap",
    "Tap at a position on screen (ratio 0-1). Automatically captures a screenshot and registers a tracked step. " +
    "After this call, evaluate the screenshot across all required dimensions before moving to the next action.",
    tapSchema.shape,
    async (args) => tap(args)
);

server.tool(
    "swipe",
    "Swipe on screen (ratio 0-1). Automatically captures a screenshot and registers a tracked step. " +
    "After this call, evaluate the screenshot across all required dimensions before moving to the next action.",
    swipeSchema.shape,
    async (args) => swipe(args)
);

// ─── Evaluation tools ──────────────────────────────────────

server.tool(
    "evaluate",
    "Unified evaluation tool. Two modes:\n" +
    "1) INITIAL: Call with only caseName + stepIndex (omit score/reason/token) → returns the first pending dimension's prompt, scoring guide, and evaluationToken.\n" +
    "2) SUBMIT: Call with caseName + stepIndex + evaluationToken + score + reason → records the score, advances to the next dimension, and returns its prompt + new token (or completion message).\n" +
    "Required dimensions per step: overlap, layout, info_clarity, style, action_result.",
    evaluateSchema.shape,
    async (args) => evaluate(args)
);

server.tool(
    "get_audit_status",
    "Get the current dashboard or test case report. " +
    "Use this to see which dimensions are missing (Pending) or to get the final markdown report if all steps are fully evaluated.",
    getAuditStatusSchema.shape,
    async (args) => getAuditStatus(args)
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
