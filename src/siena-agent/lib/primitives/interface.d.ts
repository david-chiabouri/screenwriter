
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
export interface ILargeLanguageModelController {
    /** 
     * Direct public access to the Google GenAI instance.
     * We expose this directly to allow for maximum flexibility ("not ur dad bro").
     */
    instance: GoogleGenAI;
    /** The state container associated with this GenAI instance. */
    state: IAbstractStateContainer;
}
