import { z } from "zod";
import * as device from "../device/adapter.js";
import { recordStep } from "../logger/audit-log.js";

export const takeScreenshotSchema = z.object({
    caseName: z.string().describe("Name of the test case"),
    stepIndex: z.number().int().positive().describe("Current step index (e.g. 1, 2)"),
    description: z.string().describe("Description of the observed state"),
    expectedOutcome: z.string().optional().describe("Optional: what you expect to see on screen. Omit for pure observation steps."),
});

export async function takeScreenshot(input: z.infer<typeof takeScreenshotSchema>) {
    const screenshot = await device.takeScreenshot();

    recordStep(
        input.caseName,
        input.stepIndex,
        input.description,
        "screenshot",
        screenshot.filePath,
        undefined,
        input.expectedOutcome
    );

    return {
        content: [
            {
                type: "image" as const,
                data: screenshot.imageBase64,
                mimeType: "image/png" as const,
            },
            {
                type: "text" as const,
                text: JSON.stringify({
                    message: `Step ${input.stepIndex} recorded. Please now evaluate this screenshot across all 5 dimensions (overlap, layout, info_clarity, style, action_result) using submit_dimension_score before proceeding.`,
                    caseName: input.caseName,
                    stepIndex: input.stepIndex,
                    expectedOutcome: input.expectedOutcome ?? "(pure observation)",
                    screenWidth: screenshot.width,
                    screenHeight: screenshot.height,
                }),
            },
        ],
    };
}
