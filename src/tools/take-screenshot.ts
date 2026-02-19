/**
 * Tool: take_screenshot
 * Capture the current simulator screen and return it as a base64 PNG image.
 */

import { z } from "zod";
import * as device from "../device/adapter.js";

export const takeScreenshotSchema = z.object({
    screenName: z.string().optional().describe("Label for this screen (e.g. 'LoginScreen'). Used for logging."),
});

export async function takeScreenshot(input: z.infer<typeof takeScreenshotSchema>) {
    const screenshot = await device.takeScreenshot();
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
                    screenName: input.screenName ?? "unnamed",
                    screenWidth: screenshot.width,
                    screenHeight: screenshot.height,
                    timestamp: new Date().toISOString(),
                    hint: "Use ratio coordinates (0-1) when calling tap or swipe.",
                }),
            },
        ],
    };
}
