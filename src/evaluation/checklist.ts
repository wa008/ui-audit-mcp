import { ChecklistItem } from "../types.js";

/**
 * UI quality audit dimensions — 3 user-perspective dimensions, ordered easy → hard.
 *
 * Order: outcome → usability → aesthetics
 * - outcome is skipped for pure observation steps (no expectedOutcome).
 * - Each dimension must be completed before the next one is presented.
 */
export const DIMENSIONS: ChecklistItem[] = [
    {
        id: "outcome",
        name: "Action Result",
        description:
            "You just performed an action (tap or swipe). Now look at the screenshot and answer one question:\n" +
            "Did the action produce the result you expected?\n\n" +
            "CHECK:\n" +
            "1. CORRECT SCREEN: Is this the screen you expected to see after the action? If you tapped a settings icon, are you on the settings page? Landing on the wrong screen is a critical failure.\n" +
            "2. VISIBLE CONFIRMATION: Is there a clear visual change that confirms the action worked? For example: a new page appeared, a toggle changed state, an item was added/removed, or a form was submitted. The user should be able to tell at a glance that something happened.\n" +
            "3. NO ERRORS: Are there any error messages, crash screens, blank white screens, frozen loading spinners, or other signs that something went wrong?\n" +
            "4. COMPLETE RESPONSE: Did the action fully complete? Partial results (e.g., page loaded but key content is missing, or only half the expected change occurred) still count as a problem.\n\n" +
            "SCORING ATTITUDE: This is mostly a yes-or-no judgment. If the screen clearly matches the expectedOutcome, score high. If it clearly doesn't, score low. Partial success is still a failure from the user's perspective.",
        scoringGuide:
            "0-2: Action clearly failed — wrong screen, error/crash, blank screen, or zero visible response.\n" +
            "3-4: Something changed, but it's not the expected result (e.g., wrong page, wrong data displayed).\n" +
            "5-6: Action partially succeeded — the right screen appeared but with missing content, unexpected side effects, or incomplete state changes.\n" +
            "7-8: Action succeeded — the expected result is clearly present, with only very minor discrepancies.\n" +
            "9-10: Perfect — the screenshot fully and completely matches the expectedOutcome.",
    },
    {
        id: "usability",
        name: "Usability",
        description:
            "You are a first-time user who just opened this app. You have never seen it before.\n" +
            "Look at this screen and ask yourself: Can I use this screen smoothly and without confusion?\n\n" +
            "CHECK:\n" +
            "1. CONTENT VISIBILITY: Can you see ALL the content on screen completely? Look for:\n" +
            "   - Text that is cut off with '...' or overflows its container\n" +
            "   - Elements hidden behind other elements (a popup covering needed info, a floating button sitting on top of text)\n" +
            "   - Content pushed under the system status bar or behind the bottom home indicator\n" +
            "   - If a keyboard is visible, does it cover any input field or button the user needs right now?\n" +
            "2. COMPREHENSION: Within 2 seconds, can you tell what this screen is for and what you should do next?\n" +
            "   - Is the page title or header clear about the screen's purpose?\n" +
            "   - Is the most important element (primary action button, main content) the most visually prominent thing on screen?\n" +
            "3. LABEL CLARITY: Read every button, link, and label. Would a new user immediately understand what each one does?\n" +
            "   - Vague labels like 'Go', 'Submit', or 'OK' without context are confusing\n" +
            "   - Icon-only buttons without text labels: is the icon universally understood (e.g., trash can, magnifying glass) or ambiguous (abstract shapes)?\n" +
            "4. READABILITY: Can all text be comfortably read?\n" +
            "   - Check text against its background — is there enough contrast?\n" +
            "   - Is any text too small to read comfortably?\n" +
            "   - Pay special attention to text placed over images or colored backgrounds\n" +
            "5. TAP ACCURACY: Can you confidently tap each button without accidentally hitting the wrong one?\n" +
            "   - Are any two tappable elements so close together that a normal finger might hit the wrong one?\n" +
            "   - Are any buttons uncomfortably close to the screen edge where system gestures occur?\n\n" +
            "SCORING ATTITUDE: If any single element would make a new user pause and think 'what does this mean?' or 'where did that text go?', that is a usability problem. One confusing element caps the score at 7. Multiple issues = score 5 or below.",
        scoringGuide:
            "0-2: The screen is unusable — purpose unclear, critical content hidden or overlapping, major elements unreadable or unreachable.\n" +
            "3-4: The screen's purpose is guessable but requires effort. Multiple labels are confusing, or significant content is blocked/truncated.\n" +
            "5-6: Generally usable but with noticeable issues — one or two confusing labels, some truncated text, or a few elements that feel too close together.\n" +
            "7-8: Smooth experience with only one very minor issue (e.g., one slightly ambiguous icon that most users would still figure out).\n" +
            "9-10: Perfectly clear — every element is visible, readable, self-explanatory, and easy to interact with. A user of any background would have zero confusion.",
    },
    {
        id: "aesthetics",
        name: "Aesthetics",
        description:
            "You are a user who has seen many well-designed apps. You have basic aesthetic expectations.\n" +
            "Look at this screen and ask yourself: Does this look like a professionally designed, finished product?\n\n" +
            "CHECK:\n" +
            "1. LAYOUT BALANCE: Does the screen feel well-organized?\n" +
            "   - Is there a large empty area that serves no purpose, making the app feel unfinished?\n" +
            "   - Is content crammed into one part of the screen while the rest is wasted?\n" +
            "   - Does the layout feel natural for this phone screen, or does it look like it was designed for a different device?\n" +
            "2. ALIGNMENT & SPACING: Are elements neatly arranged?\n" +
            "   - Pick any two similar elements (e.g., two cards, two list items). Are their edges aligned? Are the gaps between them equal?\n" +
            "   - If the gap between element A and B looks visibly different from the gap between B and C, that is a problem.\n" +
            "3. COLOR & TYPOGRAPHY: Do colors and fonts feel intentional and harmonious?\n" +
            "   - Do the colors look like they belong together, or do some feel random/clashing?\n" +
            "   - Are font sizes and weights used consistently? (e.g., all section titles same size, all body text same size)\n" +
            "4. COMPONENT CONSISTENCY: Do similar elements look the same?\n" +
            "   - Compare all buttons — same shape, size, and style?\n" +
            "   - Compare all cards — same shadows, borders, and corner radius?\n" +
            "   - Compare all icons — same visual style (all outline or all filled, similar sizing)?\n" +
            "   - Any visible difference between elements that should be identical is a consistency failure.\n" +
            "5. OVERALL POLISH: Does the app feel 'finished'?\n" +
            "   - Does it look like a real product someone would download from the App Store?\n" +
            "   - Or does it feel like an unfinished prototype with placeholder content, mismatched pieces, or rough edges?\n\n" +
            "SCORING ATTITUDE: Trust your gut. If your first impression is 'this looks a bit rough', it is. A screen that passes a quick glance but has visible imperfections on closer look is a 6, not an 8. Consistency is binary — if two cards of the same type look different, they are inconsistent, period.",
        scoringGuide:
            "0-2: No visual coherence — clashing colors, random fonts, messy layout, clearly unfinished or broken appearance.\n" +
            "3-4: Some design effort visible but multiple obvious issues — uneven spacing, inconsistent components, large wasted areas, or mixed visual styles.\n" +
            "5-6: Decent overall but with noticeable imperfections — some uneven spacing, a few inconsistent elements, or one area that feels out of balance.\n" +
            "7-8: Polished and professional with only very minor imperfections that require careful inspection to notice.\n" +
            "9-10: Flawless — perfectly balanced layout, fully consistent components, harmonious colors and typography. Feels like a top-tier app. Extremely rare.",
    },
];

export const ALL_DIMS = DIMENSIONS.map(d => d.id);

/** Get the applicable dimension IDs for a given step. */
export function getRequiredDimsForStep(hasExpectedOutcome: boolean): string[] {
    if (hasExpectedOutcome) {
        return ALL_DIMS;
    }
    return ALL_DIMS.filter(d => d !== "outcome");
}

export const PASSING_SCORE = 8;
