/**
 * Tool: evaluate_style_consistency
 *
 * Takes screenshots of multiple screens (navigated to by the agent beforehand)
 * and creates a style-consistency evaluation session. The agent provides
 * the screen names it has already captured via take_screenshot, and this
 * tool returns the checklist for scoring.
 *
 * Workflow:
 *   1. Agent navigates to each screen and calls take_screenshot for each
 *   2. Agent calls evaluate_style_consistency with the screen names
 *   3. Agent scores the consistency across the screenshots it already has
 *   4. Agent calls submit_evaluation with the sessionId and scores
 */

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
    STYLE_CHECKLIST,
    DEFAULT_PASSING_SCORE,
} from "../evaluation/checklist.js";
import { sessions } from "./get-checklist.js";
import { EvaluationSession } from "../types.js";

export const evaluateStyleSchema = z.object({
    screenNames: z
        .array(z.string())
        .min(2)
        .describe(
            "Names of the screens to compare (e.g. ['LoginScreen', 'HomeScreen', 'SettingsScreen']). " +
            "You should have already taken screenshots of these screens using take_screenshot."
        ),
});

export type EvaluateStyleInput = z.infer<typeof evaluateStyleSchema>;

export async function evaluateStyleConsistency(input: EvaluateStyleInput) {
    const sessionId = uuidv4();
    const compositeScreenName = input.screenNames.join(" vs ");

    const session: EvaluationSession = {
        sessionId,
        type: "style",
        screenName: compositeScreenName,
        checklist: STYLE_CHECKLIST,
        passingScore: DEFAULT_PASSING_SCORE,
        createdAt: new Date().toISOString(),
    };

    sessions.set(sessionId, session);

    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(
                    {
                        sessionId,
                        screensCompared: input.screenNames,
                        checklist: STYLE_CHECKLIST,
                        passingScore: DEFAULT_PASSING_SCORE,
                        instruction:
                            "Review the screenshots you have already taken for the screens listed above. " +
                            "Compare them across the 3 consistency dimensions in the checklist. " +
                            "Score each dimension from 1 to 5. For any item scoring below 3, " +
                            "identify which screens are inconsistent and suggest how to unify them. " +
                            "Then call submit_evaluation with this sessionId and your scores.",
                    },
                    null,
                    2
                ),
            },
        ],
    };
}
