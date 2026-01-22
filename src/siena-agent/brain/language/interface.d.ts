import type { GenerateContentResponse, GoogleGenAI } from "@google/genai";

// namespace
import type { IGeminiBrainController } from "@siena-brain";
import type { Faculty } from "@siena-lib/primitives";

// local
import type { LanguageProcessContext } from "./type.d.ts";

export interface LanguageFaculty extends Faculty {
    genai_controller_handle: IGeminiBrainController;

    /**
     * Processes an agentic contextful request by wrapping the standard generateContent call with the agent's current cognitive state.
     * It automatically applies the configured 'thinking speed' (model) and 'thinking level' (depth of thought).
     * 
     * @param contents - The input content for the model.
     * @param context - The agentic context for the request.
     * @param model_override - The model to use for the request.
     * @returns The raw response from the Google GenAI model.
     */
    process(contents: any, context: LanguageProcessContext, model_override?: string): Promise<GenerateContentResponse>

    /** 
     * Public accessor for the raw GenAI instance.
     */
    get handle(): GoogleGenAI;
}