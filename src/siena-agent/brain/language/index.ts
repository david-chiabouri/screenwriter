import { GenerateContentResponse, GoogleGenAI, ThinkingLevel } from "@google/genai";

// namespace
import { Faculty } from "@siena-lib/primitives";
import { Semantify, type AbstractSemanticState, type SemanticMetadata } from "@siena-language-semantics/semantic-state";
import { ThoughtClarity, ThoughtEmbeddingModel, ThoughtSpeed } from "@siena-thought";
import type { BrainState, IGeminiBrainController } from "@siena-brain";

// local
import type { LanguageFaculty } from "./interface.d.ts";
import type { LanguageProcessContext } from "./type.d.ts";

//exports 
export type * from "./type.d.ts";
export type * from "./interface.d.ts";




/**
 * The Language faculty is responsible for the actual communication with the Google GenAI model.
 * It translates internal intent and "thought instructions" from the controller into API calls.
 * 
 * While the 'Thought' faculty plans *what* to say, the 'Language' faculty handles *how* to say it
 * (or rather, how to ask the model to say it), managing the configuration and context of the request.
 */
export class Language extends Faculty implements LanguageFaculty {

    public genai_controller_handle: IGeminiBrainController;
    protected brain_state: BrainState;

    constructor(genai_controller_handle: IGeminiBrainController) {
        super();
        this.genai_controller_handle = genai_controller_handle;
        this.brain_state = genai_controller_handle.state;
    }

    /**
     * Accessor for the underlying GoogleGenAI instance.
     */
    public get handle(): GoogleGenAI {
        return this.genai_controller_handle.instance;
    }

    /**
     * Accessor for the shared agent state.
     * This is crucial as the language generation needs to be aware of the current thinking configuration (speed, level).
     */
    public get state(): BrainState {
        return this.genai_controller_handle.state;
    }



    /**
     * Processes a request by wrapping the standard generateContent call with the agent's current cognitive state.
     * It automatically applies the configured 'thinking speed' (model) and 'thinking level' (depth of thought).
     * 
     * @param contents - The input content for the model.
     * @returns The raw response from the Google GenAI model.
     */
    public async detailedDescriptionOfAbstractState(state: AbstractSemanticState, metadata?: SemanticMetadata): Promise<string> {
        const semantified_abstract_state = Semantify.abstractState(state, metadata);
        const response = await this.process(semantified_abstract_state, { genai_state: this.state.genai_state });
        if (!response.text) {
            console.error("No text generated from the model.");
            return "";
        }
        return response.text;
    }

    public static ThoughtClairtyToThinkingLevel(thoughtClarity: ThoughtClarity): ThinkingLevel {
        switch (thoughtClarity) {
            case ThoughtClarity.CLEAR:
                return ThinkingLevel.HIGH;
            case ThoughtClarity.INTUITIVE:
                return ThinkingLevel.MEDIUM;
            case ThoughtClarity.IMPRESSIONISTIC:
                return ThinkingLevel.MINIMAL;
            case ThoughtClarity.CONFUSED:
                return ThinkingLevel.MINIMAL;
            case ThoughtClarity.UNSPECIFIED:
                return ThinkingLevel.THINKING_LEVEL_UNSPECIFIED;
            default:
                return ThinkingLevel.THINKING_LEVEL_UNSPECIFIED;
        }
    }

    /**
     * Internal helper to execute a function with exponential backoff retry logic.
     * Handles 503 (Service Unavailable) and 429 (Too Many Requests).
     */
    private async executeWithRetry<T>(operation: () => Promise<T>, retries: number = 5, initialDelay: number = 1000): Promise<T> {
        let currentDelay = initialDelay;
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error: any) {
                const isRetryable = error?.status === 503 || error?.status === 429 || error?.message?.includes("503") || error?.message?.includes("429") || error?.error?.code === 503;

                if (isRetryable && i < retries - 1) {
                    console.warn(`[Language Faculty] API Error ${error?.status || 'Unknown'} - Retrying in ${currentDelay}ms... (Attempt ${i + 1}/${retries})`);
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                    currentDelay *= 2; // Exponential backoff
                } else {
                    throw error;
                }
            }
        }
        throw new Error("Max retries exceeded"); // Should be unreachable given the loop logic
    }

    /**
     * Processes an agentic contextful request by wrapping the standard generateContent call with the agent's current cognitive state.
     * It automatically applies the configured 'thinking speed' (model) and 'thinking level' (depth of thought).
     * 
     * @param contents - The input content for the model.
     * @param context - The agentic context for the request.
     * @param model_override - The model to use for the request.
     * @returns The raw response from the Google GenAI model.
     */
    public async process(contents: any, context: LanguageProcessContext, model_override?: string): Promise<GenerateContentResponse> {
        const model = model_override ?? this.state.genai_state.current_thinking_shape.thoughtSpeed ?? ThoughtSpeed.EXTREME;

        return this.executeWithRetry(async () => {
            const response = await this.handle.models.generateContent({
                contents,
                model: model,
                config: {
                    systemInstruction: this.state.genai_state.systemInstruction,
                    // Only include thinkingConfig if strictly enabled, to support non-thinking models (e.g. flash)
                    thinkingConfig: this.state.genai_state.current_thinking_shape.includeThoughts ? {
                        includeThoughts: this.state.genai_state.current_thinking_shape.includeThoughts,
                        thinkingLevel: Language.ThoughtClairtyToThinkingLevel(this.state.genai_state.current_thinking_shape.thoughtClarity)
                    } : undefined
                }
            });
            // grab usage data
            const usage_data = response.usageMetadata;
            console.log(usage_data);
            return response;
        });
    }

    /**
     * Generates semantic embeddings for a list of strings.
     * Used for vector search and semantic similarity comparisons.
     * 
     * @param contents - Array of strings to embed.
     * @returns A promise resolving to the embeddings.
     */
    public async semanticEmbedding(contents: string[]) {
        const response = await this.handle.models.embedContent({
            contents: contents,
            model: ThoughtEmbeddingModel.STANDARD,

        });
        return response.embeddings;
    }



}