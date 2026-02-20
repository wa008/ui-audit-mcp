import { z } from "zod";
import * as device from "../device/adapter.js";
import { recordStep } from "../logger/audit-log.js";

export const tapSchema = z.object({
    x: z.number().min(0).max(1).describe("Horizontal position ratio (0 = left, 1 = right)"),
    y: z.number().min(0).max(1).describe("Vertical position ratio (0 = top, 1 = bottom)"),
    caseName: z.string().describe("Name of the test case"),
    stepIndex: z.number().int().positive().describe("Current step index (e.g. 1, 2)"),
    description: z.string().describe("Description of the action being performed"),
});

export async function tap(input: z.infer<typeof tapSchema>) {
    const result = await device.tap(input.x, input.y);
    if (!result.success) {
        return {
            content: [{ type: "text" as const, text: `Failed to tap: ${result.error}` }]
        };
    }

    // Wait for UI to settle before taking screenshot
    await new Promise(resolve => setTimeout(resolve, 1500));

    const screenshot = await device.takeScreenshot();
    recordStep(
        input.caseName,
        input.stepIndex,
        input.description,
        "tap",
        screenshot.filePath,
        { x: input.x, y: input.y }
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
                    message: `Step ${input.stepIndex} recorded. Please now evaluate this screenshot across all 4 dimensions (overlap, layout, info_clarity, style) using get_evaluation_criteria and submit_dimension_score before proceeding.`,
                    caseName: input.caseName,
                    stepIndex: input.stepIndex,
                    screenWidth: screenshot.width,
                    screenHeight: screenshot.height,
                }),
            },
        ],
    };
}
