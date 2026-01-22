import type { LanguageProcessCallable } from "@language";
import type { BrainState } from "@brain";
import { ThinkingLevel } from "@google/genai";
import { ThoughtSpeed, ThoughtLevelVerboseAsClarity } from "./enum";
/**
 * Initialization parameters for the Thought faculty.
 */
export type ThoughtInitialState = {
    /** Callable to invoke the language faculty. */
    language_callable: LanguageProcessCallable;
    /** The brain state associated with this faculty. */
    brain_state: BrainState;
}

/**
 * Configuration for the agent's thought process.
 * Controls the depth and speed of the AI model's reasoning.
 * Equivalent to the "thinkingConfig" in the Vertex AI/Gemini API.
 */
export type ThoughtShape = {
    /** The clarity or depth of the thought process. */
    thinkingLevel: ThoughtClarity;
    /** The speed/model to use (e.g., specific Gemini flash variants). */
    thinkingSpeed: ThoughtSpeed;
    /** Whether to include the raw thought trace in the output. */
    includeThoughts?: boolean;
}

/**
 * Union type for thinking clarity, accepting either direct ThinkingLevel enums or verbose string aliases.
 * Controls the depth of the "Chain of Thought" reasoning process if supported by the model.
 */
export const ThoughtClarity = {
    ...ThinkingLevel,
    ...ThoughtLevelVerboseAsClarity,
} as const;

export type ThoughtClarity = (typeof ThoughtClarity)[keyof typeof ThoughtClarity];


/**
 * Represents the result of a review process by a model.
 * Reviews help validate and refine topics and hypotheses.
 */
export type ReviewResult = {
    /** The name of the model performing the review. */
    model_name: string;
    /** The text content of the review. */
    review: string;
    /** A numerical rating of the reviewed item (e.g., 0-10 or 0-5). */
    rating: number; // are normalized to 
    /** When the review was performed. */
    timestamp: number;
}


