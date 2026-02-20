import { ChecklistItem } from "../types.js";

/** System-wide UI quality audit dimensions */
export const DIMENSIONS: ChecklistItem[] = [
    {
        id: "overlap",
        name: "Element Overlap & Safe Areas",
        description:
            "Focus ONLY on whether UI elements physically cover or obscure each other. " +
            "Examine the following in order:\n" +
            "1. STATUS BAR: Does any app content (header, button, text) intrude into the system status bar area (time, battery, signal icons)? Even 1px overlap is a critical failure.\n" +
            "2. NOTCH / DYNAMIC ISLAND: Is any content hidden behind the notch or Dynamic Island?\n" +
            "3. HOME INDICATOR: Does any bottom content overlap with the home indicator bar?\n" +
            "4. INTER-ELEMENT OVERLAP: Do any buttons, text fields, images, or cards overlap each other within the app content area?\n" +
            "5. MODAL / POPUP: If a modal or popup is present, does it unintentionally cover critical information behind it?\n" +
            "NOTE: Do NOT evaluate spacing aesthetics (that is layout), color choices (that is style), or text readability (that is info_clarity).",
        scoringGuide:
            "0-3: Critical overlap detected — elements cover system UI or each other, causing functional obstruction.\n" +
            "4-6: Minor overlap exists but does not block core functionality.\n" +
            "7-8: No overlap detected, but margins against safe areas are uncomfortably tight (< 4pt).\n" +
            "9-10: Perfect — all elements are fully within safe areas with comfortable margins, zero overlap.",
    },
    {
        id: "layout",
        name: "Layout & Spatial Balance",
        description:
            "Focus ONLY on how the screen space is utilized and whether elements are spatially well-arranged. " +
            "Examine the following in order:\n" +
            "1. LETTERBOXING: Does the app appear to run inside a smaller box with large black/empty bars at the top and bottom? This is a critical failure (score 0).\n" +
            "2. SCREEN FILL: Does the content naturally fill the available screen area without feeling cramped or empty?\n" +
            "3. WHITESPACE BALANCE: Is the whitespace distributed evenly? Are there large, unexplained empty gaps on one side while the other side is dense?\n" +
            "4. ALIGNMENT: Are related elements (labels, inputs, buttons) aligned to a consistent vertical or horizontal axis? Look for jagged left edges or uneven column widths.\n" +
            "5. SPACING CONSISTENCY: Are the gaps between similar elements (e.g., list items, card margins) uniform?\n" +
            "NOTE: Do NOT evaluate whether elements cover each other (that is overlap), color or font choices (that is style), or text meaning (that is info_clarity).",
        scoringGuide:
            "0-3: Letterboxing detected, or layout is severely broken (elements piled up, massive empty areas).\n" +
            "4-6: Layout is functional but has noticeable imbalance — uneven spacing, misaligned elements, or wasted space.\n" +
            "7-8: Generally well-structured, but minor spacing or alignment imperfections exist.\n" +
            "9-10: Perfect — balanced whitespace, consistent spacing, strong alignment, content fills screen naturally.",
    },
    {
        id: "info_clarity",
        name: "Information Clarity & Readability",
        description:
            "Focus ONLY on whether a user can quickly understand what this screen communicates and what action to take. " +
            "Examine the following in order:\n" +
            "1. PRIMARY CTA: Is there a clear primary call-to-action? Can the user instantly identify what to do next?\n" +
            "2. INFORMATION HIERARCHY: Are headings visually dominant over body text? Is the most important information the most prominent?\n" +
            "3. TEXT TRUNCATION: Is any text cut off with '...' or overflowing its container, losing meaningful content?\n" +
            "4. LABEL AMBIGUITY: Are button labels, icon meanings, or tab names confusing or misleading? Would a first-time user understand what each element does?\n" +
            "5. CONTRAST & READABILITY: Is text legible against its background? Are there low-contrast text areas that are hard to read?\n" +
            "NOTE: Do NOT evaluate spacing or alignment (that is layout), element overlap (that is overlap), or color harmony (that is style).",
        scoringGuide:
            "0-3: Key information is impossible to find, CTA is absent or hidden, or labels are severely misleading.\n" +
            "4-6: Information is present but requires effort to parse — weak hierarchy, some ambiguous labels, or minor truncation.\n" +
            "7-8: Generally clear with good hierarchy, but 1-2 minor issues (e.g., one slightly ambiguous icon).\n" +
            "9-10: Perfect — immediate clarity, strong hierarchy, unambiguous labels, fully legible text, obvious CTA.",
    },
    {
        id: "style",
        name: "Visual Style & Consistency",
        description:
            "Focus ONLY on the visual aesthetics and design consistency of this single screen. " +
            "Examine the following in order:\n" +
            "1. COLOR PALETTE: Are the colors harmonious? Do primary, secondary, and accent colors feel intentional and cohesive, or do they clash?\n" +
            "2. TYPOGRAPHY: Are font sizes, weights, and families consistent across the screen? Do headings, body text, and captions follow a clear typographic scale?\n" +
            "3. COMPONENT CONSISTENCY: Do similar components (buttons, cards, input fields) share the same visual treatment (corner radius, shadow, border style)?\n" +
            "4. ICONOGRAPHY: Do icons share a consistent style (outline vs filled, stroke width, size)?\n" +
            "5. OVERALL POLISH: Does the screen feel professionally designed, or does it look like a rough prototype with placeholder styling?\n" +
            "NOTE: Do NOT evaluate information meaning (that is info_clarity), spatial arrangement (that is layout), or element occlusion (that is overlap).",
        scoringGuide:
            "0-3: No coherent visual style — clashing colors, mixed icon styles, inconsistent component design.\n" +
            "4-6: A basic style exists but with noticeable inconsistencies (e.g., two different button styles, uneven font weights).\n" +
            "7-8: Mostly consistent and polished, with only minor deviations.\n" +
            "9-10: Perfect — unified color scheme, consistent typography, cohesive component design, professional polish.",
    },
];

export const REQUIRED_DIMS = DIMENSIONS.map(d => d.id);
export const PASSING_SCORE = 8;
