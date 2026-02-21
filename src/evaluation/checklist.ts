import { ChecklistItem } from "../types.js";

/** System-wide UI quality audit dimensions — strict scoring */
export const DIMENSIONS: ChecklistItem[] = [
    {
        id: "overlap",
        name: "Element Overlap & Safe Areas",
        description:
            "You are evaluating this screen as a real user trying to read content and tap buttons efficiently.\n" +
            "Assume there ARE overlap issues until you have visually scanned the entire screen.\n\n" +
            "CHECK FOR VISUAL INTERFERENCE & COGNITIVE NOISE:\n" +
            "1. SYSTEM EDGE INTERFERENCE (CRITICAL): Scan the very top, bottom, and corners of the screen. Do any app elements (buttons, icons, avatars, titles) visually touch, overlap with, or sit uncomfortably close to system indicators (time, battery, signal, notch/Dynamic Island, home indicator bar)? If a user might confuse an app element with a system element, or accidentally tap the wrong one, this is a CRITICAL BUG.\n" +
            "2. INTERACTIVE CROWDING: Are any two tappable elements (buttons, links, cards) so close together that a user with a normal-sized finger might accidentally tap the wrong one? Are touch targets dangerously close to screen edges where system gestures occur?\n" +
            "3. CONTENT COLLISION: Do any visible elements (text, images, floating buttons, badges) visually overlap each other, making any of them harder to read, recognize, or tap? Two elements occupying the same visual space is always a bug.\n" +
            "4. MODAL/POPUP OBSTRUCTION: If a popup, sheet, or overlay is present, does it cover essential information that the user still needs to see, such as the content they are acting upon?\n\n" +
            "SCORING ATTITUDE: Focus on what a real user would EXPERIENCE. If something 'feels' too close or visually confusing, it is an overlap failure. When in doubt, score LOW.\n" +
            "NOTE: Do NOT evaluate spacing consistency (layout), color choices (style), or text meaning (info_clarity).",
        scoringGuide:
            "0-2: Severe visual collision. Elements clearly overlap each other or invade system areas (e.g., a button sitting on top of the status bar), causing immediate confusion or making the interface unusable.\n" +
            "3-4: Elements don't directly collide, but are awkwardly close to each other or to system edges, creating noticeable visual noise or high accidental-tap risk.\n" +
            "5-6: All elements are visually separate, but some touch targets feel uncomfortably close. A careful user would be fine, but a hurried user might mis-tap.\n" +
            "7-8: Clean separation throughout. No visual interference. The app clearly respects system boundaries and provides comfortable touch targets.\n" +
            "9-10: Perfect separation — generous spacing between all interactive elements, completely unambiguous visual boundaries across the entire screen.",
    },
    {
        id: "layout",
        name: "Layout & Spatial Balance",
        description:
            "You are evaluating this screen as a real user who expects a well-organized, visually balanced interface.\n" +
            "Assume the layout has issues until you verify otherwise.\n\n" +
            "CHECK EACH ASPECT:\n" +
            "1. LETTERBOXING: Does the app appear to run inside a smaller box with black or empty bars on any side? This is score 0, no exceptions.\n" +
            "2. SCREEN UTILIZATION: Is there a large empty area that serves no purpose? Is content crammed into only part of the screen while the rest is wasted? A user should feel the app was designed for this exact screen size.\n" +
            "3. ALIGNMENT: Pick any two similar elements (e.g., two cards, two labels). Are their edges aligned? Are the gaps between them equal? Visible misalignment = deduction.\n" +
            "4. SPACING CONSISTENCY: Are gaps between elements consistent? If the space between Card A and Card B looks visibly different from the space between Card B and Card C, that is a problem.\n" +
            "5. RESPONSIVE FIT: Does the layout feel natural for this screen size, or does it look stretched, squished, or designed for a different device?\n" +
            "6. CONTENT OVERFLOW: Does any content look like it has outgrown its container? Look for: text that wraps unexpectedly causing one card to be noticeably taller than its neighbor in a grid, content that appears cut off at a container edge, or scrollable areas that clip content in a way that confuses the user about whether more content exists.\n\n" +
            "SCORING ATTITUDE: Do not be generous. A layout that 'looks fine at a glance' but has visible imperfections upon closer inspection is a 6, not an 8.\n" +
            "NOTE: Do NOT evaluate element collision (that is overlap), color choices (that is style), or text meaning (that is info_clarity).",
        scoringGuide:
            "0-2: Letterboxing detected, or layout is severely broken (elements piled on top of each other, massive unusable empty areas, content pushed off-screen).\n" +
            "3-4: Major layout issues — clearly uneven spacing, significant misalignment, or large wasted areas that make the app feel unfinished.\n" +
            "5-6: Layout is functional but has noticeable imperfections — some uneven spacing, minor alignment issues, or one area that feels out of balance.\n" +
            "7-8: Well-structured layout with only very minor imperfections that require careful inspection to notice.\n" +
            "9-10: Flawless — pixel-perfect alignment, perfectly consistent spacing, optimal screen utilization. Extremely rare.",
    },
    {
        id: "info_clarity",
        name: "Information Clarity & Readability",
        description:
            "You are evaluating this screen as a FIRST-TIME user who has never seen this app before.\n" +
            "Your goal is to determine how quickly and easily a new user could understand this screen.\n\n" +
            "CHECK EACH ASPECT:\n" +
            "1. FIRST IMPRESSION: Within 2 seconds of looking at this screen, can you tell what it does and what the main action is? If it takes effort to figure out the screen's purpose, that is a problem.\n" +
            "2. BUTTON & LABEL CLARITY: Read every button, link, and label. Would a first-time user immediately understand what each one does? Vague labels like 'Go' or unlabeled icon-only buttons are problematic.\n" +
            "3. VISUAL HIERARCHY: Is the most important element (page title, primary action button) visually the most prominent? Or do secondary elements compete for the user's attention?\n" +
            "4. TEXT COMPLETENESS: Is any text cut off with '...' (truncation), overflowing its container, or so small that a user would struggle to read it? Even one truncated label that hides meaningful information = deduction.\n" +
            "5. READABILITY & CONTRAST: Can all text be comfortably read against its background? Pay special attention to small text, light-colored text on light backgrounds, or text placed over images.\n" +
            "6. ICON MEANING: Are there any icons without text labels whose meaning might be ambiguous to a new user? A trash can icon is universally understood; a custom abstract icon is not.\n\n" +
            "SCORING ATTITUDE: If any single element would make a first-time user pause and wonder 'what does this do?', cap the score at 7. Multiple confusing elements = score 5 or below.\n" +
            "NOTE: Do NOT evaluate spacing (layout), visual collision (overlap), or color harmony (style).",
        scoringGuide:
            "0-2: The screen's purpose is unclear, the primary action is missing or hidden, or labels are severely misleading.\n" +
            "3-4: The core purpose is guessable but requires effort. Multiple labels or icons are ambiguous.\n" +
            "5-6: Generally understandable but 1-2 elements are confusing (ambiguous icon, truncated text hiding important info, weak visual hierarchy).\n" +
            "7-8: Clear and well-organized with only one very minor issue. A first-time user would understand the screen immediately.\n" +
            "9-10: Crystal clear — perfect hierarchy, every label self-explanatory, no truncation, excellent contrast. A user of any background would instantly understand this screen.",
    },
    {
        id: "style",
        name: "Visual Style & Consistency",
        description:
            "You are evaluating this screen as a user who expects a polished, professionally designed app.\n" +
            "Your job is to find visual inconsistencies and rendering defects that make the app look unfinished.\n\n" +
            "CHECK EACH ASPECT:\n" +
            "1. COLOR PALETTE: Count the number of distinct colors used. Do they feel intentional and harmonious, or random and clashing?\n" +
            "2. TYPOGRAPHY: Are font sizes used consistently? Are there mixed font weights that don't follow a clear hierarchy? More than 2-3 font sizes without a clear reason is a problem.\n" +
            "3. COMPONENT CONSISTENCY: Compare all elements of the same type. Do all buttons have the same shape, size, and styling? Do all cards have the same shadows, borders, and corner radius? Any difference between similar components = deduction.\n" +
            "4. ICONOGRAPHY: Are all icons visually consistent (all outline style OR all filled style, consistent stroke width and sizing)? Mixing styles within the same screen = deduction.\n" +
            "5. POLISH & FINISH: Does the app look professionally designed, or does it feel like an unfinished prototype? Placeholder content (e.g., 'Lorem ipsum', default system icons used inappropriately) = major deduction.\n" +
            "6. RENDERING INTEGRITY: Inspect each UI element individually for visual defects. Look for: a visible ring, halo, or unintended border of a different color around an element (e.g., a white circle visible behind a colored circular button — this means the element was not built cleanly), mismatched shapes within a single component, clipping artifacts that cut off part of an icon or image, or any visual glitch that makes a component look broken. Even 1-2 pixels of visible defect = deduction.\n\n" +
            "SCORING ATTITUDE: Consistency is binary — if two buttons of the same type look different, they are inconsistent, period. A single rendering defect on any element caps the score at 7.\n" +
            "NOTE: Do NOT evaluate text meaning (info_clarity), spatial arrangement (layout), or element collision (overlap).",
        scoringGuide:
            "0-2: No design system — clashing colors, random fonts, inconsistent components everywhere, or multiple rendering defects.\n" +
            "3-4: Some design intent visible but multiple clear inconsistencies (different button styles, mixed icon sets, visible rendering glitches).\n" +
            "5-6: Basic consistency exists but with noticeable deviations or at least one obvious rendering defect.\n" +
            "7-8: Strong consistency with only 1 minor deviation or subtle defect requiring careful inspection.\n" +
            "9-10: Pixel-perfect design system adherence. Every element cohesive and cleanly rendered. Extremely rare.",
    },
    {
        id: "action_result",
        name: "Action Result Verification",
        description:
            "You are evaluating whether the action the user just performed actually produced the expected result.\n" +
            "The step's expectedOutcome describes what SHOULD have happened. Compare the current screenshot against it.\n\n" +
            "CHECK EACH ASPECT:\n" +
            "1. CORRECT DESTINATION: If the user tapped a navigation element, did the correct screen appear? Landing on the wrong screen = score 0.\n" +
            "2. VISIBLE STATE CHANGE: If the action should have added, removed, toggled, or updated something, is that change clearly visible in the screenshot? The user should be able to confirm the action worked.\n" +
            "3. ERROR INDICATORS: Are there any error dialogs, crash screens, blank white screens, or infinite loading spinners? These all indicate the action failed.\n" +
            "4. NO VISIBLE RESPONSE: Does the screen look identical to before the action was performed? If nothing changed, the action likely failed or missed its target.\n\n" +
            "SCORING ATTITUDE: If the expectedOutcome is not clearly achieved in the screenshot, score LOW. Partial success is still a problem — the user expects the action to fully work.\n" +
            "If this step is a pure observation with no expectedOutcome specified, score 10.",
        scoringGuide:
            "0-2: Action clearly failed — wrong screen, error dialog, crash, blank screen, or no visible response at all.\n" +
            "3-4: Action had some effect but the result does not match the expectedOutcome (e.g., navigated to the wrong tab, wrong data displayed).\n" +
            "5-6: Action partially achieved the goal but with unexpected side effects, missing expected elements, or incomplete state changes.\n" +
            "7-8: Action succeeded — the expected screen or state is present but with minor discrepancies from the expectedOutcome.\n" +
            "9-10: Action fully succeeded — the screenshot clearly and completely matches the expectedOutcome. Or this is a pure observation step with no expectedOutcome.",
    },
];

export const REQUIRED_DIMS = DIMENSIONS.map(d => d.id);
export const PASSING_SCORE = 8;
