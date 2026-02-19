/**
 * Tool: launch_app
 * Launch an iOS app on the simulator by its bundle ID.
 */

import { z } from "zod";
import * as device from "../device/adapter.js";

export const launchAppSchema = z.object({
    appId: z.string().describe("The bundle ID of the iOS app, e.g. 'com.example.myapp'"),
});

export async function launchApp(input: z.infer<typeof launchAppSchema>) {
    const result = await device.launchApp(input.appId);
    return {
        content: [{
            type: "text" as const,
            text: JSON.stringify({
                success: result.success,
                ...(result.success
                    ? { message: `App '${input.appId}' launched.` }
                    : { error: result.error, hint: "Ensure the app is installed and the simulator is booted." }),
            }),
        }],
    };
}
