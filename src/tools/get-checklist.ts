/**
 * Tool: get_checklist
 *
 * Return the evaluation checklist for either single-screen UI quality
 * or multi-screen style consistency. Creates a new evaluation session.
 */

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
    SCREEN_CHECKLIST,
    STYLE_CHECKLIST,
    DEFAULT_PASSING_SCORE,
} from "../evaluation/checklist.js";
import { EvaluationSession } from "../types.js";

// In-memory session store (keyed by sessionId)
export const sessions = new Map<string, EvaluationSession>();

export const getChecklistSchema = z.object({
    type: z
        .enum(["screen", "style"])
        .describe(
            "'screen' for single-screen UI quality evaluation, " +
            "'style' for multi-screen style consistency evaluation"
        ),
    screenName: z
        .string()
        .optional()
        .describe(
            "Name of the screen being evaluated (e.g. 'LoginScreen'). " +
            "Required for screen evaluation; for style evaluation, use a descriptive name like 'AllScreens'."
        ),
});

export type GetChecklistInput = z.infer<typeof getChecklistSchema>;

export async function getChecklist(input: GetChecklistInput) {
    const sessionId = uuidv4();
    const screenName = input.screenName ?? "unnamed";
    const checklist =
        input.type === "screen" ? SCREEN_CHECKLIST : STYLE_CHECKLIST;

    const session: EvaluationSession = {
        sessionId,
        type: input.type,
        screenName,
        checklist,
        passingScore: DEFAULT_PASSING_SCORE,
        createdAt: new Date().toISOString(),
    };

    sessions.set(sessionId, session);

    const instruction =
        input.type === "screen"
            ? "Review the screenshot you captured via take_screenshot. Score each checklist item from 0 to 10. " +
            "For any item scoring below 8, you MUST provide a specific reason and an actionable improvement suggestion."
            : "Review ALL screenshots you have captured. Score each consistency dimension from 0 to 10. " +
            "For any item scoring below 8, identify which screens are inconsistent and suggest how to unify them.";

    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(
                    {
                        sessionId,
                        type: input.type,
                        screenName,
                        checklist,
                        passingScore: DEFAULT_PASSING_SCORE,
                        instruction,
                    },
                    null,
                    2
                ),
            },
        ],
    };
}
