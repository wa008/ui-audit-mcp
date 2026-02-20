import { z } from "zod";
import { recordScore, readLog } from "../logger/audit-log.js";
import { REQUIRED_DIMS } from "../evaluation/checklist.js";

export const submitDimensionScoreSchema = z.object({
    caseName: z.string().describe("Name of the test case"),
    stepIndex: z.number().int().positive().describe("Step index this evaluation belongs to"),
    dimension: z.string().describe(`The dimension ID (must be one of: ${REQUIRED_DIMS.join(", ")})`),
    score: z.number().int().min(0).max(10).describe("Score from 0 (worst) to 10 (perfect)"),
    reason: z.string().describe("Analysis and reason for this score"),
});

export async function submitDimensionScore(input: z.infer<typeof submitDimensionScoreSchema>) {
    if (!REQUIRED_DIMS.includes(input.dimension)) {
        throw new Error(`Invalid dimension '${input.dimension}'. Must be one of: ${REQUIRED_DIMS.join(", ")}`);
    }

    recordScore(input.caseName, input.stepIndex, input.dimension, input.score, input.reason);

    // After writing, calculate remaining dimensions for this step to provide a helpful hint
    const log = readLog(input.caseName);
    const step = log?.steps[input.stepIndex];
    const evaluated = step ? Object.keys(step.evaluations || {}) : [];
    const remaining = REQUIRED_DIMS.filter(d => !evaluated.includes(d));

    let hint: string;
    if (remaining.length === 0) {
        hint = `All 4 dimensions for Step ${input.stepIndex} are complete. You may call get_audit_status to review progress or proceed to the next action.`;
    } else {
        hint = `${remaining.length} dimension(s) still needed for Step ${input.stepIndex}: ${remaining.join(", ")}. Please evaluate them before moving to the next action.`;
    }

    return {
        content: [{
            type: "text" as const,
            text: `Recorded [${input.dimension}] for ${input.caseName} Step ${input.stepIndex} — Score: ${input.score}. ${hint}`
        }]
    };
}
