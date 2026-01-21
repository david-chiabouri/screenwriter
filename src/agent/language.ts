import { GenerateContentResponse, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { IFaculty, type IAbstractStateContainer, type IGoogleGenAI } from "./lib/primitive";
import { Semantify, type AbstractSemanticState, type ISemanticState, type SemanticMetadata } from "./semantics/semantic-state";
import { ThoughtSpeed } from "./thought";
import type { BrainState, IGeminiBrainController } from "./brain";


export type LanguageProcessContext = {
    systemInstruction: string;
}


/**
 * Type definition for a callable function that processes content through the language faculty.
 * This abstracts the direct call to the GenAI model, allowing for middleware or alternative implementations.
 * @param contents - The input contents (text, images, etc.) to be processed.
 * @returns A promise resolving to the GenAI response.
 */
export type LanguageProcessCallable = (contents: any, context: LanguageProcessContext) => Promise<GenerateContentResponse>;


export interface LanguageFaculty extends IFaculty {
    genai_handle: IGeminiBrainController;
    /** 
     * Public accessor for the raw GenAI instance.
     */
    get handle(): GoogleGenAI;
}


/**
 * The Language faculty is responsible for the actual communication with the Google GenAI model.
 * It translates internal intent and "thought instructions" from the controller into API calls.
 * 
 * While the 'Thought' faculty plans *what* to say, the 'Language' faculty handles *how* to say it
 * (or rather, how to ask the model to say it), managing the configuration and context of the request.
 */
export class Language extends IFaculty implements LanguageFaculty {

    public genai_handle: IGeminiBrainController;
    protected brain_state: BrainState;

    constructor(genai_handle: IGeminiBrainController) {
        super();
        this.genai_handle = genai_handle;
        this.brain_state = genai_handle.state;
    }

    /**
     * Accessor for the underlying GoogleGenAI instance.
     */
    public get handle(): GoogleGenAI {
        return this.genai_handle.instance;
    }

    /**
     * Accessor for the shared agent state.
     * This is crucial as the language generation needs to be aware of the current thinking configuration (speed, level).
     */
    public get state(): BrainState {
        return this.genai_handle.state;
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
        const response = await this.process(semantified_abstract_state);
        if (!response.text) {
            console.error("No text generated from the model.");
            return "";
        }
        return response.text;
    }

    /**
     * Processes a request by wrapping the standard generateContent call with the agent's current cognitive state.
     * It automatically applies the configured 'thinking speed' (model) and 'thinking level' (depth of thought).
     * 
     * @param contents - The input content for the model.
     * @returns The raw response from the Google GenAI model.
     */
    public async process(contents: any): Promise<GenerateContentResponse> {
        const response = await this.handle.models.generateContent({
            contents,
            model: this.state.genai_state.current_thinking_shape.thinkingSpeed ?? ThoughtSpeed.THOUGHTFUL,
            config: {
                systemInstruction: this.state.genai_state.systemInstruction,
                // Only include thinkingConfig if strictly enabled, to support non-thinking models (e.g. flash)
                thinkingConfig: this.state.genai_state.current_thinking_shape.includeThoughts ? {
                    includeThoughts: this.state.genai_state.current_thinking_shape.includeThoughts,
                    thinkingLevel: this.state.genai_state.current_thinking_shape.thinkingLevel as ThinkingLevel,
                } : undefined
            }
        });
        return response;
    }



}