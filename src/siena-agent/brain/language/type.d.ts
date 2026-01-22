import type { GenerateContentResponse } from "@google/genai";

// namespace
import type { GoogleGenAIState } from "@siena-brain";

export type LanguageProcessContext = {
    genai_state: GoogleGenAIState
}


/**
 * Type definition for a callable function that processes content through the language faculty.
 * This abstracts the direct call to the GenAI model, allowing for middleware or alternative implementations.
 * @param contents - The input contents (text, images, etc.) to be processed.
 * @returns A promise resolving to the GenAI response.
 */
export type LanguageProcessCallable = (contents: any, context: LanguageProcessContext, model_override?: string) => Promise<GenerateContentResponse>;
