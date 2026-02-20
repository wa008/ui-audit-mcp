import { z } from "zod";
import * as device from "../device/adapter.js";
import { recordStep } from "../logger/audit-log.js";

export const takeScreenshotSchema = z.object({
    caseName: z.string().describe("Name of the test case"),
    stepIndex: z.number().int().positive().describe("Current step index (e.g. 1, 2)"),
    description: z.string().describe("Description of the observed state"),
});

export async function takeScreenshot(input: z.infer<typeof takeScreenshotSchema>) {
    const screenshot = await device.takeScreenshot();

    recordStep(
        input.caseName,
        input.stepIndex,
        input.description,
        "screenshot",
        screenshot.filePath
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
