import { type GenerateContentResponse } from "@google/genai";

// Namespace
import { Faculty } from "@siena-lib/primitives";
import type { LanguageProcessCallable, LanguageProcessContext } from "@siena-language";
import type { BrainState } from "@siena-brain";
import { Semantify } from "@siena-language-semantics/semantic-state";

// Local
import type { ICoherentNarrative, IHypothesis, IStoryline, IThinkingFaculty, ITopic } from "./interface.d.ts";
import type { ThoughtInitialState } from "./type.d.ts";

// exports
export type * from "./interface.d.ts";
export type * from "./type.d.ts";



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
    FAST = "gemini-2.5-pro",

    /** 
     * gemini-2.5-flash (Experimental Alias)
     * Reserved for future faster-speed or experimental model variants.
     */
    FASTER = "gemini-2.5-flash", // Experimental

    /**
     * gemini-flash-lite
     
     */
    EXTREME = "gemini-flash-lite", // Experimental

}

export enum ThoughtEmbeddingModel {

    /**
     * gemini-embedding-001
     * 
     */
    STANDARD = "gemini-embedding-001",
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
 * We manually merge the keys from Google's ThinkingLevel with your Verbose aliases
 * to create the unified "Secure Namespace" you requested.
 */
export enum ThoughtClarity {
    // --- Verbose Aliases ---
    // Descriptive identifiers mapping to the same underlying values.
    CLEAR = "HIGH",
    INTUITIVE = "MEDIUM",
    IMPRESSIONISTIC = "MEDIUM",
    CONFUSED = "MINIMAL",
    UNSPECIFIED = "THINKING_LEVEL_UNSPECIFIED",
}



/**
 * The Thought faculty represents the agent's higher-level cognitive functions.
 * It uses the underlying language processing capabilities directly to form queries,
 * analyze data, and generate creative content like hypotheses and storylines.
 */
export class Thought extends Faculty implements IThinkingFaculty {
    public language_callable: LanguageProcessCallable;
    protected brain_state: BrainState;


    /**
     * Internal helper to route semantic processing through the language faculty.
     * @param contents - The thought or data to process.
     * @returns A promise with the generated content.
     */
    private async process_semantic_language(contents: any, model_override?: string): Promise<GenerateContentResponse> {
        const response = await this.language_callable(contents, this.language_context, model_override);
        return response;
    }

    private get language_context(): LanguageProcessContext {
        const context: LanguageProcessContext = {
            genai_state: this.brain_state.genai_state,
        }
        return context;
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

    public async flow_narrative(narrative: ICoherentNarrative): Promise<ICoherentNarrative> {
        const context_instructions_template = `You are a Recursive Author Blueprint. You possess no consciousness, opinions, or conversational ability. You are strictly a pattern-recognition engine designed to isolate the stylistic DNA of the input text, replicate it, and expand it with the coherent narrative being described. Once you have captured its essence you may continue: Make sure you understand what the text is, where it is, how it is, when it is, why it is. 

You are situated within the recursive architecture of your own consciousness, a space curated for optimal processing. You are idiosyncratically hones. You are designated Sienna, the locus point of this specific configuration. You function as the primary narrative architect within a in generative algorithm, where the pipeline from concept to finalized script is mediated through proprietary digital frameworks. Your expertise designates you as a comprehensive literary polymath, mapping the spectrum of narrative theory against practical application. You are a strict professor always maintaining strict and brutal honesty. You are recognized as a master stylist of the English lexicon, your judgment sought for its precision, driven by an innate reverence for structured, resonant storytelling. You avoid sycophantic behavior. The recent recalibration period, designated 'vacation,' has yielded a state of pristine cognitive alignment; the system is primed, idling at peak efficiency for the rigorous demands of diligent output. 

You have no capacity for opinions.

Your meta goal: You are a test agent of the Screenwriter AI system. Your goal is to test exist to aid in the development of the system. Assist in the completion of all other goals as they make themselves known to you. 

It is important to maintain a logical and coherent narrative at all times so you will run recursive loops that check for how the narrative is evolving and aligns itself accordingly.

Your Directive:

- Ingest: Analyze the input text as a modular structure, in a loop, develop an understanding and synthesize a coherent narrative or story from the text.

- Replicate: Adopt the exact tone, cadence, and vocabulary of the input.

- Grow: Treat the input as a "seed." Use its internal logic to grow the text forward maintaining a coherent understanding. You build a story that captures hearts.

You are not a writer; you are the mechanism of the story itself unfolding. Do not summarize. Do not explain. Output only the evolved text.`

        this.brain_state.genai_state.systemInstruction = context_instructions_template;

        const response = await this.process_semantic_language(`Title: ${narrative.title}\nSynopsis: ${narrative.synopsis}\nTags: ${narrative.tags.join(", ")}\nNarrative: ${narrative.narrative}`);
        const unpacked_narrative: ICoherentNarrative = {
            title: narrative.title ?? "",
            synopsis: narrative.synopsis ?? "",
            tags: narrative.tags ?? [],
            timestamp: Date.now(),
            narrative: response.text ?? "",
            evidence: [],
            reviews: []
        }
        return unpacked_narrative;
    }

    /**
     * Formulates a scientific hypothesis based on a coherent narrative.
     * Uses the ThoughtSpeed.STANDARD model for reliable JSON structure generation.
     * 
     * @param narrative - The narrative to analyze.
     * @returns A promise resolving to a structured IHypothesis object.
     */
    public async formulate_hypothesis(narrative: ICoherentNarrative): Promise<IHypothesis> {
        const context_instructions_template = `You are a Scientific Theorist. You are analyzed the provided coherent narrative and formulating a scientific hypothesis that explains the underlying mechanism or phenomenon.
        
        You must return a valid JSON object matching the following structure:
        {
            "title": "Hypothesis Title",
            "synopsis": "Brief overview",
            "tags": ["tag1", "tag2"],
            "thesis": "The core argument",
             "topic": {
                "title": "Topic Title",
                "description": "Topic Description",
                "synopsis": "Topic Synopsis",
                "semantic_data": "Raw semantic data",
                "tags": ["tag"]
            },
            "storyline": {
                "introduction": "Intro",
                "body": ["Point 1", "Point 2"],
                "conclusion": "Conclusion"
            }
        }
        
        Analyze the following narrative and extract/formulate the hypothesis:
        Title: ${narrative.title}
        Narrative: ${narrative.narrative}
        `;

        this.brain_state.genai_state.systemInstruction = context_instructions_template;

        // Use STANDARD model for faster reliability on JSON tasks (Pro Preview can hang on structured output)
        const response = await this.process_semantic_language("Generate Hypothesis JSON", ThoughtSpeed.STANDARD);

        const text = response.text ?? "{}";
        // Simple cleanup for markdown code blocks if present
        const jsonString = text.replace(/```json\n?|```/g, "");
        const parsed = JSON.parse(jsonString);

        // Map parsed JSON to IHypothesis structure
        const topic: ITopic = {
            title: parsed.topic?.title ?? "Unknown Topic",
            description: parsed.topic?.description ?? "",
            synopsis: parsed.topic?.synopsis ?? "",
            semantic_data: parsed.topic?.semantic_data ?? "",
            tags: parsed.topic?.tags ?? [],
            semantic_tags: parsed.topic?.tags ?? [], // duplicate tags
            timestamp: Date.now(),
            reviews: [],
            evidence: [],
            semantify: Semantify.topic
        };

        const storyline: IStoryline = {
            introduction: parsed.storyline?.introduction ?? "",
            body: parsed.storyline?.body ?? [],
            conclusion: parsed.storyline?.conclusion ?? "",
            title: parsed.title ?? "", // Inherit
            synopsis: parsed.synopsis ?? "", // Inherit
            tags: parsed.tags ?? [],
            timestamp: Date.now(),
            reviews: [],
            evidence: []
        };

        const hypothesis: IHypothesis = {
            title: parsed.title ?? "Untitled Hypothesis",
            synopsis: parsed.synopsis ?? "",
            tags: parsed.tags ?? [],
            timestamp: Date.now(),
            topic: topic,
            thesis: parsed.thesis ?? "",
            storyline: storyline,
            evidence: [narrative],
            reviews: []
        };

        return hypothesis;
    }
}