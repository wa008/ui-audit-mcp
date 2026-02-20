import { z } from "zod";
import * as device from "../device/adapter.js";
import { recordStep } from "../logger/audit-log.js";

export const swipeSchema = z.object({
    startX: z.number().min(0).max(1).describe("Start horizontal ratio (0-1)"),
    startY: z.number().min(0).max(1).describe("Start vertical ratio (0-1)"),
    endX: z.number().min(0).max(1).describe("End horizontal ratio (0-1)"),
    endY: z.number().min(0).max(1).describe("End vertical ratio (0-1)"),
    caseName: z.string().describe("Name of the test case"),
    stepIndex: z.number().int().positive().describe("Current step index (e.g. 1, 2)"),
    description: z.string().describe("Description of the action being performed"),
    expectedOutcome: z.string().describe("What should happen after this swipe (e.g. 'List should scroll down to show more items')"),
});

export async function swipe(input: z.infer<typeof swipeSchema>) {
    const result = await device.swipe(input.startX, input.startY, input.endX, input.endY);
    if (!result.success) {
        return {
            content: [{ type: "text" as const, text: `Failed to swipe: ${result.error}` }],
        };
    }

    // Wait for UI to settle before taking screenshot
    await new Promise(resolve => setTimeout(resolve, 2000));

    const screenshot = await device.takeScreenshot();
    recordStep(
        input.caseName,
        input.stepIndex,
        input.description,
        "swipe",
        screenshot.filePath,
        { x: input.startX, y: input.startY },
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
                    message: `Step ${input.stepIndex} recorded. Expected: "${input.expectedOutcome}". Please now evaluate this screenshot across all 5 dimensions (overlap, layout, info_clarity, style, action_result) using submit_dimension_score before proceeding.`,
                    caseName: input.caseName,
                    stepIndex: input.stepIndex,
                    expectedOutcome: input.expectedOutcome,
                    screenWidth: screenshot.width,
                    screenHeight: screenshot.height,
                }),
            },
        ],
    };
}
