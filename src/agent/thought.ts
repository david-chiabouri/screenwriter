import { type GenerateContentResponse, type GoogleGenAI, ThinkingLevel } from "@google/genai";
import { IFaculty, type IGoogleGenAI } from "./lib/primitive";
import type { LanguageProcessCallable, LanguageProcessContext } from "./language";
import type { BrainState, IGeminiBrainController } from "./brain";
import type { IAbstractSemanticData } from "./semantics/semantic-state";


/**
 * Enum defining the thinking speeds (models) available to the brain.
 * Different models are chosen based on the complexity and urgency of the task.
 */
/**
 * Enum defining the thinking speeds (models) available to the brain.
 * Different models are chosen based on the complexity and urgency of the task.
 * 
 * Note: Uses specific versioned model names to ensure compatibility with Google GenAI API.
 */
export enum ThoughtSpeed {
    /** 
     * gemini-3-pro-preview
     * High capability, balanced speed. Excellent for deep reasoning and creative writing. 
     * Supports complex instruction following.
     */
    THOUGHTFUL = "gemini-3-pro-preview",

    /** 
     * gemini-3-flash-preview
     * The standard workhorse. Good balance of speed and reasoning for general tasks.
     */
    STANDARD = "gemini-3-flash-preview",

    /** 
     * gemini-2.5-flash
     * Optimized for maximum speed and lower latency. 
     * Ideal for quick validation or simple data processing.
     * Note: May not support advanced 'thinkingConfig' features like Chain of Thought.
     */
    FAST = "gemini-2.5-flash",

    /** 
     * gemini-2.5-flash (Experimental Alias)
     * Reserved for future extreme-speed or experimental model variants.
     */
    EXTREME = "gemini-2.5-flash", // Experimental
}

/**
 * Mapping of verbose thinking level descriptions to API constants.
 * Allows for more expressive control over the thinking depth.
 */
export enum ThoughtLevelVerboseAsClarity {
    CLEAR = "HIGH",
    INTUITIVE = "MEDIUM",
    IMPRESSIONISTIC = "MEDIUM",
    CONFUSED = "MINIMAL",
    UNSPECIFIED = "THINKING_LEVEL_UNSPECIFIED",
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
    rating: number;
    /** When the review was performed. */
    timestamp: number;
}

/**
 * Interface for any agent data that can be subject to review.
 */
export interface IReviewable {
    /** A collection of reviews attached to this item. */
    reviews: ReviewResult[];
    /** Optional evidence supporting the item's validity. */
    evidence?: any;
}

/**
 * Represents a specific subject or area of interest for the agent.
 * Topics are the building blocks of the agent's knowledge graph.
 */
export interface ITopic extends IAbstractSemanticData<string>, IReviewable {
    title: string;
    semantic_data: string;
    semantic_tags: string[];
    timestamp: number;
    description?: string;

    reviews: ReviewResult[];
    evidence?: any;
}

/**
 * Represents a working hypothesis or potential narrative structure.
 * This is where the agent formulates its creative ideas.
 */
export interface IHypothesis extends IReviewable {
    /** The central topic this hypothesis addresses. */
    topic: ITopic;
    /** The core argument or premise of the hypothesis. */
    thesis: string;
    /** The narrative structure developed from the thesis. */
    storyline: {
        // The abstract storyline components
        title: string;
        synopsis: string;
        tags: string[];

        // The concrete screenplay output components
        introduction: string;
        body: string[];
        conclusion: string;
    };
}

/**
 * Configuration for the agent's thought process.
 * Controls the depth and speed of the AI model's reasoning.
 * Equivalent to the "thinkingConfig" in the Vertex AI/Gemini API.
 */
export type ThoughtShape = {
    /** The clarity or depth of the thought process (e.g., HIGH, CHECK_YOUR_WORK). */
    thinkingLevel: ThoughtClarity;
    /** The speed/model to use (e.g., specific Gemini flash variants). */
    thinkingSpeed: ThoughtSpeed;
    /** Whether to include the raw thought trace in the output. */
    includeThoughts?: boolean;
}

/**
 * Interface for the thinking faculty, which coordinates language generation for cognitive tasks.
 */
export interface IThinkingFaculty extends IFaculty {
    /** A callable to process content through the language faculty. */
    language_callable: LanguageProcessCallable;
}

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
 * The Thought faculty represents the agent's higher-level cognitive functions.
 * It uses the underlying language processing capabilities directly to form queries,
 * analyze data, and generate creative content like hypotheses and storylines.
 */
export class Thought extends IFaculty implements IThinkingFaculty {
    public language_callable: LanguageProcessCallable;
    protected brain_state: BrainState;


    /**
     * Internal helper to route semantic processing through the language faculty.
     * @param contents - The thought or data to process.
     * @returns A promise with the generated content.
     */
    private process_semantic_language(contents: any): Promise<GenerateContentResponse> {
        return this.language_callable(contents, this.language_context);
    }

    private get language_context(): LanguageProcessContext {
        return this.brain_state.genai_state;
    }

    constructor(initial_state: ThoughtInitialState) {
        super();
        this.language_callable = initial_state.language_callable;
        this.brain_state = initial_state.brain_state;
    }

    /**
     * Public accessor for the brain state.
     */
    public get state(): BrainState {
        return this.brain_state;
    }
}