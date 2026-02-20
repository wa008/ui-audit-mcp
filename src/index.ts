#!/usr/bin/env node

/**
 * UI Audit MCP Server
 *
 * An MCP server for iOS app UI evaluation and testing.
 * Uses idb + xcrun simctl for device operations (launch, screenshot, tap, swipe)
 * and provides a rule-based, trackable evaluation workflow.
 *
 * Evaluation workflow for each step:
 *   1. Perform an action (tap / swipe / take_screenshot) — this auto-takes a screenshot and registers a step.
 *   2. For each required dimension (overlap, layout, info_clarity, style):
 *      a. Call get_evaluation_criteria(dimension) to read the scoring rubric.
 *      b. Visually inspect the screenshot.
 *      c. Call submit_dimension_score to record your score.
 *   3. Call get_audit_status to confirm all dimensions are complete before proceeding to the next action.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { launchAppSchema, launchApp } from "./tools/launch-app.js";
import { takeScreenshotSchema, takeScreenshot } from "./tools/take-screenshot.js";
import { tapSchema, tap } from "./tools/tap.js";
import { swipeSchema, swipe } from "./tools/swipe.js";
import { getEvaluationCriteriaSchema, getEvaluationCriteria } from "./tools/get-evaluation-criteria.js";
import { submitDimensionScoreSchema, submitDimensionScore } from "./tools/submit-dimension-score.js";
import { getAuditStatusSchema, getAuditStatus } from "./tools/get-audit-status.js";

const server = new McpServer({
    name: "ui-audit-mcp",
    version: "2.0.0",
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
    "get_evaluation_criteria",
    "Get UI evaluation dimensions and scoring rubrics. " +
    "Call without arguments to list all dimension IDs. Pass a dimension ID (e.g. 'overlap') to get its detailed prompt and scoring guide. " +
    "Required dimensions for every step: overlap, layout, info_clarity, style.",
    getEvaluationCriteriaSchema.shape,
    async (args) => getEvaluationCriteria(args)
);

server.tool(
    "submit_dimension_score",
    "Submit a score (0-10) and reason for one UI dimension on a specific step. " +
    "Every step requires scores for all four dimensions: overlap, layout, info_clarity, style. " +
    "After submitting, continue with the remaining dimensions, then call get_audit_status to confirm completion.",
    submitDimensionScoreSchema.shape,
    async (args) => submitDimensionScore(args)
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
