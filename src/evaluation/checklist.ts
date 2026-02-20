import { ChecklistItem } from "../types.js";

/** System-wide UI quality audit dimensions — strict scoring */
export const DIMENSIONS: ChecklistItem[] = [
    {
        id: "overlap",
        name: "Element Overlap & Safe Areas",
        description:
            "You are a user-centric QA inspector evaluating visual interference and interactive crowding.\n" +
            "Evaluate the screen from the perspective of a real human user trying to read and tap efficiently.\n" +
            "Assume there ARE overlap issues until you have visually scanned the entire screen.\n\n" +
            "CHECK FOR VISUAL INTERFERENCE & COGNITIVE NOISE:\n" +
            "1. SYSTEM EDGE INTERFERENCE (CRITICAL): Scan the very top, bottom, and corners. Do any app elements (e.g., buttons, avatars, titles) visually mix with system indicators (time, battery, notch, home indicator)? If an app button sits awkwardly close to system icons, it creates cognitive confusion and accidental click risks. This is a CRITICAL BUG.\n" +
            "2. INTERACTIVE CROWDING: Are touch targets (buttons, links) so close to each other or to the screen edges that a user with a large thumb might accidentally trigger the wrong action or a system gesture?\n" +
            "3. TEXT & CONTENT CLASH: Do any app elements (text, images, floating buttons) visually collide with or bleed into each other, making them harder to read or recognize?\n" +
            "4. MODAL/POPUP OBSTRUCTION: If a popup or sheet is present, does it awkwardly obscure essential context that the user still needs to see?\n\n" +
            "SCORING ATTITUDE: Focus on the HUMAN visual experience. If an element 'feels' like it's stepping on another element's toes or invading system space, it is an overlap failure. Punish visual crowding heavily. If unsure, score LOW.\n" +
            "NOTE: Do NOT evaluate logical spacing consistency (layout), colors (style), or text meaning (info_clarity).",
        scoringGuide:
            "0-2: Severe visual interference. Elements clearly collide (e.g. app button invading system status bar area), causing immediate cognitive confusion or severe accidental click risks.\n" +
            "3-4: Elements don't perfectly collide, but are awkwardly close to each other or to system edges, creating noticeable visual noise or crowding.\n" +
            "5-6: All elements are separate, but touch targets might be a bit too close for comfort. Risk of fat-finger errors.\n" +
            "7-8: Clean separation. No visual interference. App UI respects system boundaries and provides clear touch targets.\n" +
            "9-10: Perfect logical grouping, generous touch targets, and completely unambiguous visual separation over the entire screen.",
    },
    {
        id: "layout",
        name: "Layout & Spatial Balance",
        description:
            "You are a strict QA inspector for layout quality. Your job is to find spatial problems.\n" +
            "Assume the layout has issues until you verify otherwise.\n\n" +
            "CHECK EACH ASPECT:\n" +
            "1. LETTERBOXING: Does the app appear to run inside a smaller box with black/empty bars? This is score 0, no exceptions.\n" +
            "2. SCREEN UTILIZATION: Is there a large empty area that serves no purpose? Is content crammed into only half the screen while the rest is wasted?\n" +
            "3. ALIGNMENT: Pick any two similar elements (e.g., two cards, two labels). Are their left edges aligned? Are the gaps between them equal? Misalignment = deduction.\n" +
            "4. SPACING: Are gaps between elements consistent? Measure visually: if card A-to-B gap looks different from card B-to-C gap, that is a problem.\n" +
            "5. RESPONSIVE FIT: Does the layout feel designed for this screen size, or does it look like it was designed for a different device?\n\n" +
            "SCORING ATTITUDE: Do not be generous. A 'basically fine' layout is a 6, not an 8.\n" +
            "NOTE: Do NOT evaluate overlap (that is overlap), colors (that is style), or text meaning (that is info_clarity).",
        scoringGuide:
            "0-2: Letterboxing detected, or layout is severely broken (elements piled up, massive empty areas, content off-screen).\n" +
            "3-4: Major layout issues — clearly uneven spacing, significant misalignment, or large wasted areas.\n" +
            "5-6: Layout is functional but has noticeable imperfections — some uneven spacing or minor alignment issues. This is the 'OK but not great' range.\n" +
            "7-8: Well-structured layout with only very minor imperfections that require careful inspection to notice.\n" +
            "9-10: Flawless — pixel-perfect alignment, perfectly consistent spacing, optimal screen utilization. Extremely rare.",
    },
    {
        id: "info_clarity",
        name: "Information Clarity & Readability",
        description:
            "You are a strict QA inspector for information clarity. Your job is to find confusing elements.\n" +
            "Imagine you are a FIRST-TIME user of this app who has never seen it before.\n\n" +
            "CHECK EACH ASPECT:\n" +
            "1. FIRST IMPRESSION: Within 2 seconds of looking at this screen, can you tell what it does and what the main action is? If not, that is a problem.\n" +
            "2. BUTTON LABELS: Read every button/link text. Would a first-time user understand what each does? 'Submit' is clearer than a bare icon.\n" +
            "3. HIERARCHY: Is the most important element (title, CTA) visually the most prominent? Or is secondary info competing for attention?\n" +
            "4. TEXT TRUNCATION: Is any text cut off with '...' or overflowing? Even one truncated label = deduction.\n" +
            "5. CONTRAST: Is all text easily readable against its background? Check small/light text especially.\n" +
            "6. ICON MEANING: Are there any icons without labels that could be ambiguous?\n\n" +
            "SCORING ATTITUDE: If any single element is confusing, cap the score at 7. " +
            "Multiple unclear elements = score 5 or below.\n" +
            "NOTE: Do NOT evaluate spacing (layout), overlap (overlap), or color harmony (style).",
        scoringGuide:
            "0-2: Screen purpose is unclear, CTA is missing/hidden, or labels are severely misleading.\n" +
            "3-4: Core purpose is guessable but requires effort. Multiple ambiguous labels or icons.\n" +
            "5-6: Generally understandable but has 1-2 confusing elements (ambiguous icon, truncated text, weak hierarchy).\n" +
            "7-8: Clear and well-organized with only one very minor issue. First-time user would understand immediately.\n" +
            "9-10: Crystal clear — perfect hierarchy, unambiguous labels, no truncation, excellent contrast. Every element self-explanatory.",
    },
    {
        id: "style",
        name: "Visual Style & Consistency",
        description:
            "You are a strict QA inspector for visual design consistency. Your job is to find inconsistencies.\n" +
            "Compare every element against every other element of the same type.\n\n" +
            "CHECK EACH ASPECT:\n" +
            "1. COLOR PALETTE: Count the number of distinct colors used. Do they feel intentional and harmonious, or random?\n" +
            "2. TYPOGRAPHY: Are there more than 2 font sizes that don't follow a clear scale? Mixed font weights without reason?\n" +
            "3. COMPONENT STYLING: Compare all buttons — same corner radius? Same padding? Compare all cards — same shadow, border, background?\n" +
            "4. ICONOGRAPHY: Are all icons the same style (outline vs filled, same stroke width)? Mixed styles = deduction.\n" +
            "5. POLISH: Does it look professionally designed or like a prototype? Placeholder content (e.g., 'Lorem ipsum', stock icons) = major deduction.\n\n" +
            "SCORING ATTITUDE: Consistency is binary per element — if two buttons look different, they are inconsistent, period.\n" +
            "NOTE: Do NOT evaluate text meaning (info_clarity), spatial layout (layout), or overlap (overlap).",
        scoringGuide:
            "0-2: No design system — clashing colors, random fonts, inconsistent components everywhere.\n" +
            "3-4: Some design intent visible but multiple clear inconsistencies (different button styles, mixed icon sets).\n" +
            "5-6: Basic consistency exists but with noticeable deviations. 'Mostly OK' = 6 at best.\n" +
            "7-8: Strong consistency with only 1 minor deviation requiring careful inspection.\n" +
            "9-10: Pixel-perfect design system adherence. Every element cohesive. Extremely rare.",
    },
    {
        id: "action_result",
        name: "Action Result Verification",
        description:
            "You are a strict QA inspector verifying whether the action actually worked.\n" +
            "The step's expectedOutcome describes what SHOULD have happened. Compare the screenshot against it.\n\n" +
            "CHECK EACH ASPECT:\n" +
            "1. SCREEN TRANSITION: If the action was a navigation tap, did the correct destination screen appear? Wrong screen = score 0.\n" +
            "2. STATE CHANGE: If the action should toggle/add/remove something, is that change visually confirmed in the screenshot?\n" +
            "3. ERROR PRESENCE: Are there any error dialogs, crash screens, or infinite loading spinners? These indicate failure.\n" +
            "4. NO RESPONSE: Does the screen look identical to before the action? If so, the action likely missed or failed.\n\n" +
            "SCORING ATTITUDE: If the expectedOutcome is not clearly achieved, score LOW. Partial success is still a problem.\n" +
            "If this step is a pure observation (no expectedOutcome), score 10.",
        scoringGuide:
            "0-2: Action clearly failed — wrong screen, error dialog, crash, or no UI response at all.\n" +
            "3-4: Action had some effect but the result does not match expectedOutcome (e.g., navigated to wrong tab).\n" +
            "5-6: Action partially achieved the goal but with unexpected side effects or missing expected elements.\n" +
            "7-8: Action succeeded — the expected screen/state is present but with minor discrepancies.\n" +
            "9-10: Action fully succeeded — screenshot exactly matches expectedOutcome. Or no expectedOutcome (pure observation).",
    },
];

export const REQUIRED_DIMS = DIMENSIONS.map(d => d.id);
export const PASSING_SCORE = 8;
