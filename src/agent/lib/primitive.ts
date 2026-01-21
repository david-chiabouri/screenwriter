import type { GoogleGenAI } from "@google/genai";
import type { IAbstractSemanticData, ISemanticGoal, ISemanticMetaGoal, ISemanticState } from "../semantics/semantic-state";
import type { BrainState } from "../brain";



/**
 * Interface for any container that holds the semantic state of the agent.
 */
export interface IAbstractStateContainer {
    /** The core semantic state of the agent. */
    semantic_state: ISemanticState;
    /** Allow for other dynamic properties in the state container. */
    [key: string]: any;
}



/**
 * Interface for wrappers around the Google GenAI instance.
 * Provides access to the raw instance and the agent's state.
 */
export interface IGoogleGenAI {
    /** 
     * Direct public access to the Google GenAI instance.
     * We expose this directly to allow for maximum flexibility ("not ur dad bro").
     */
    instance: GoogleGenAI;
    /** The state container associated with this GenAI instance. */
    state: IAbstractStateContainer;
}

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




export class PrimitiveFactory {

}