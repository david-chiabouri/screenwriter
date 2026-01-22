
import type { BrainState } from "@siena-brain";

import type { Primitive } from "./type.d.ts";


/**
 * Abstract class representing a "faculty" or capability of the agent's brain.
 * Faculties are modules that use the GenAI instance to perform specific cognitive tasks.
 */
export abstract class Faculty implements Primitive {
    /** The handle to the GenAI instance and state. */
    protected abstract brain_state: BrainState;

    /**
     * Public accessor for the brain state.
     */
    public abstract get state(): BrainState;
}

