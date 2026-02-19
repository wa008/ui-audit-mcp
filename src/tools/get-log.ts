/**
 * Tool: get_evaluation_log
 *
 * Query past evaluation results for review and summary.
 * Useful for tracking improvement across multiple evaluation attempts.
 */

import { z } from "zod";
import { queryLogs } from "../logger/evaluation-logger.js";

export const getEvaluationLogSchema = z.object({
    sessionId: z
        .string()
        .optional()
        .describe("Optional session ID to look up a specific evaluation. If omitted, returns the most recent evaluations."),
    limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Maximum number of log entries to return (default: 10)"),
});

export type GetEvaluationLogInput = z.infer<typeof getEvaluationLogSchema>;

export async function getEvaluationLog(input: GetEvaluationLogInput) {
    const { logs, summary } = queryLogs(input.sessionId, input.limit ?? 10);

    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify({ logs, summary }, null, 2),
            },
        ],
    };
}
