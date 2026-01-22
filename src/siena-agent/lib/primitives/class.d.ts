import type { GoogleGenAI } from "@google/genai";
import type { ISemanticState } from "@siena-language-semantics/semantic-state";
import type { BrainState } from "@siena-brain";



/**
 * Abstract class representing a "faculty" or capability of the agent's brain.
 * Faculties are modules that use the GenAI instance to perform specific cognitive tasks.
 */
export abstract class IFaculty {
    /** The handle to the GenAI instance and state. */
    protected abstract brain_state: BrainState;

    /**
     * Public accessor for the brain state.
     */
    public abstract get state(): BrainState;
}

