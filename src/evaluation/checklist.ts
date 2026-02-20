import { ChecklistItem } from "../types.js";

/** System-wide UI quality audit dimensions — strict scoring */
export const DIMENSIONS: ChecklistItem[] = [
    {
        id: "overlap",
        name: "Element Overlap & Safe Areas",
        description:
            "You are a strict QA inspector. Your job is to find overlap problems, not to praise the UI.\n" +
            "Assume there ARE problems until you have carefully verified every region.\n\n" +
            "CHECK EACH REGION METHODICALLY — report what you see in each:\n" +
            "1. TOP-RIGHT & TOP-LEFT CORNERS (CRITICAL): Look at the black pill-shaped camera cutout (Dynamic Island) or the notch at the top center. Draw an imaginary horizontal line across the VERY BOTTOM EDGE of that cutout. Are there ANY interactive elements (like a '+' button, settings icon, profile picture) that are positioned at the same height or ABOVE this line on the left or right sides? If YES, this is a CRITICAL UI BUG. Score this 0-2 immediately.\n" +
            "2. STATUS BAR ZONE: Does ANY app content extend behind the system time (top left), battery, or signal indicators (top right)? Look extremely closely. Even partial intrusion = failure.\n" +
            "3. BOTTOM SAFE AREA: Does any content overlap with the horizontal home indicator bar at the very bottom?\n" +
            "4. INTER-ELEMENT: Do any two app elements (buttons, text, images, cards) visually overlap each other?\n" +
            "5. MODAL/POPUP: If present, does it unintentionally cover critical content?\n\n" +
            "SCORING ATTITUDE: Visual AI models often miss top-corner overlaps. Be explicitly paranoid about buttons placed too high up near the battery or time icons. If you are unsure whether something overlaps or is too close, score LOW.\n" +
            "NOTE: Do NOT evaluate spacing aesthetics (layout), colors (style), or text meaning (info_clarity).",
        scoringGuide:
            "0-2: Any element overlaps the status bar zone (e.g. above the bottom of the Dynamic Island/notch), touches the battery/time, overlaps the home indicator, or covers another element.\n" +
            "3-4: An element is dangerously close to a safe area boundary (e.g. just barely below the Dynamic Island with no breathing room).\n" +
            "5-6: All elements are within safe areas but margins are uncomfortably tight.\n" +
            "7-8: All elements are clearly within safe areas with comfortable margins. No inter-element overlap detected.\n" +
            "9-10: Perfect — generous safe area margins on all sides, zero overlap risk. ONLY give 9-10 if you are ABSOLUTELY CERTAIN the top corners are completely clear of buttons.",
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
