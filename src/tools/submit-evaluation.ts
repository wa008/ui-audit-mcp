/**
 * Tool: submit_evaluation
 *
 * Accept the agent's scores for each checklist item, determine pass/fail,
 * persist the result to the evaluation log, and return the outcome.
 */

import { z } from "zod";
import { sessions } from "./get-checklist.js";
import { evaluateScores } from "../evaluation/scorer.js";
import { saveLog, countScreenAttempts } from "../logger/evaluation-logger.js";
import { ScoreEntry } from "../types.js";

const scoreEntrySchema = z.object({
    id: z.string().describe("Checklist item ID (e.g. 'overlap', 'layout')"),
    score: z
        .number()
        .int()
        .min(0)
        .max(10)
        .describe("Score from 0 (worst) to 10 (best). Standard is high; 8 is passing."),
    reason: z
        .string()
        .describe("Why this score was given. REQUIRED for all scores, whether passing or failing."),
    suggestion: z
        .string()
        .optional()
        .describe(
            "Actionable improvement suggestion. Required if score < passing threshold."
        ),

});

export const submitEvaluationSchema = z.object({
    sessionId: z
        .string()
        .describe("The session ID returned by get_checklist"),
    scores: z
        .array(scoreEntrySchema)
        .describe("Array of score entries, one per checklist item"),
});

export type SubmitEvaluationInput = z.infer<typeof submitEvaluationSchema>;

export async function submitEvaluation(input: SubmitEvaluationInput) {
    const session = sessions.get(input.sessionId);
    if (!session) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify({
                        error: `Session '${input.sessionId}' not found. Call get_checklist first to create a session.`,
                    }),
                },
            ],
            isError: true,
        };
    }

    // Validate that all checklist items have scores
    const missingIds = session.checklist
        .filter((item) => !input.scores.find((s) => s.id === item.id))
        .map((item) => item.id);

    if (missingIds.length > 0) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify({
                        error: `Missing scores for checklist items: ${missingIds.join(", ")}`,
                        expectedIds: session.checklist.map((c) => c.id),
                    }),
                },
            ],
            isError: true,
        };
    }

    // Determine attempt number for this screen
    const attemptNumber = countScreenAttempts(session.screenName) + 1;

    // Evaluate
    const scores: ScoreEntry[] = input.scores;
    const outcome = evaluateScores(
        session.sessionId,
        session.type,
        session.screenName,
        session.checklist,
        scores,
        session.passingScore,
        attemptNumber
    );

    // Persist to log
    const logPath = saveLog(outcome, session.checklist, scores);

    // Clean up session
    sessions.delete(input.sessionId);

    // Build response
    const response: Record<string, unknown> = {
        sessionId: outcome.sessionId,
        screenName: outcome.screenName,
        overallPassed: outcome.overallPassed,
        averageScore: outcome.averageScore,
        attemptNumber: outcome.attemptNumber,
        results: outcome.results,
        logPath,
    };

    if (!outcome.overallPassed) {
        response.failedItems = outcome.failedItems;
        response.nextSteps =
            "The evaluation did NOT pass. Review the failed items above — each includes a reason and suggestion. " +
            "Please fix the identified issues in the code, rebuild, and re-evaluate the screen.";
    } else {
        response.nextSteps =
            "All checklist items passed! You may proceed to evaluate the next screen or run style consistency checks.";
    }

    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(response, null, 2),
            },
        ],
    };
}
