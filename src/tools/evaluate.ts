/**
 * Tool: evaluate
 *
 * Unified evaluation tool that combines get_pending_task and submit_evaluation.
 *
 * Two modes:
 *   1. Initial mode (score/reason/token omitted):
 *      Returns the first pending dimension's prompt, scoring guide, and a token.
 *
 *   2. Submit-and-advance mode (score + reason + token all provided):
 *      Validates the token, records the score, advances to the next dimension.
 *      If more dimensions remain, returns the next prompt + new token.
 *      If all done, returns a completion message.
 */

import { z } from "zod";
import { getPendingTaskState, validateAndAdvanceState } from "../evaluation/state-machine.js";

export const evaluateSchema = z.object({
    caseName: z.string().describe("Name of the test case"),
    stepIndex: z.number().int().positive().describe("Step index to evaluate"),
    // Optional: omit all three for initial query, provide all three to submit
    evaluationToken: z.string().optional().describe(
        "The exact token from the previous evaluate call. Omit on the first call to get the initial dimension."
    ),
    score: z.number().int().min(0).max(10).optional().describe(
        "Score from 0 (worst) to 10 (perfect). Required when submitting an evaluation."
    ),
    reason: z.string().optional().describe(
        "Analysis and reason for this score. Required when submitting an evaluation."
    ),
});

function renderDimensionPrompt(state: {
    dimensionId?: string;
    dimensionName?: string;
    description?: string;
    scoringGuide?: string;
    token?: string;
}, prefix: string): string {
    return `${prefix}\n\n` +
        `🔴 CURRENT TASK: ${state.dimensionName}\n\n` +
        `PROMPT: ${state.description}\n\n` +
        `SCORING GUIDE: \n${state.scoringGuide}\n\n` +
        `⚠️ ACTION REQUIRED:\n` +
        `Inspect the screenshot specifically for this dimension. Then call \`evaluate\` with:\n` +
        `  "evaluationToken": "${state.token}"\n` +
        `  "score": <your score 0-10>\n` +
        `  "reason": "<your analysis>"\n\n` +
        `Do NOT evaluate other dimensions until you finish this one.`;
}

export async function evaluate(input: z.infer<typeof evaluateSchema>) {
    const hasScore = input.score !== undefined;
    const hasReason = input.reason !== undefined;
    const hasToken = input.evaluationToken !== undefined;

    const submissionFieldCount = [hasScore, hasReason, hasToken].filter(Boolean).length;

    // Validate: all three must be present or all absent
    if (submissionFieldCount > 0 && submissionFieldCount < 3) {
        return {
            content: [{
                type: "text" as const,
                text: "❌ Error: `evaluationToken`, `score`, and `reason` must ALL be provided together, or ALL be omitted.\n" +
                    "- Omit all three to get the first pending dimension.\n" +
                    "- Provide all three to submit an evaluation and advance."
            }]
        };
    }

    // ── Mode 1: Initial query (no score/reason/token) ──
    if (submissionFieldCount === 0) {
        const state = getPendingTaskState(input.caseName, input.stepIndex);

        if (state.completed) {
            return {
                content: [{
                    type: "text" as const,
                    text: state.message || "✅ All dimensions for this step are fully evaluated."
                }]
            };
        }

        const markdown = renderDimensionPrompt(state, `📋 Starting evaluation for Step ${input.stepIndex}:`);
        return {
            content: [{ type: "text" as const, text: markdown }],
        };
    }

    // ── Mode 2: Submit score and advance ──
    const result = validateAndAdvanceState(
        input.caseName,
        input.stepIndex,
        input.evaluationToken!,
        input.score!,
        input.reason!
    );

    const nextState = result.nextState;

    if (nextState.completed) {
        return {
            content: [{
                type: "text" as const,
                text: `✅ Score ${result.score} recorded for [${result.completedDimId}].\n\n` +
                    `🎉 All dimensions for Step ${input.stepIndex} are fully evaluated!\n` +
                    `You may now proceed to interact with the device (tap, swipe) or call get_audit_status.`
            }]
        };
    }

    const markdown = renderDimensionPrompt(nextState,
        `✅ Score ${result.score} recorded for [${result.completedDimId}].\n\n➡️ Next dimension:`
    );

    return {
        content: [{ type: "text" as const, text: markdown }],
    };
}
