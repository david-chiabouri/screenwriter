import { GoogleGenAI } from "@google/genai";

// Namespace
import { Language } from "@siena-language";
import { Thought, ThoughtSpeed, type ThoughtClarity } from "@siena-thought";
import { Memory } from "@siena-memory";
import type { MemoryInitialState } from "@siena-memory/type.d.ts";

import { type ILargeLanguageModelController } from "@siena-lib/primitives";
import { SemanticStateFactory, type IContexedSemanticData, type ISemanticGoal, type ISemanticMetaGoal, type ISemanticState } from "@siena-language-semantics/semantic-state";




export type GoogleGenAIState = {
    /**
     * The current configuration of the agent's thinking process.
     * Determines which models are used and how deep the reasoning goes.
     */
    current_thinking_shape: {
        thoughtSpeed: ThoughtSpeed,
        thoughtClarity: ThoughtClarity,
        includeThoughts?: boolean,
    },
    /**
     * The system instruction (prompt) currently active for the GenAI model.
     */
    systemInstruction: string,
}

export type BrainInitialState = {
    /** The initial GenAI configuration. */
    genai_state: GoogleGenAIState;
    /** The initial meta-goal for the agent. */
    metagoal: ISemanticMetaGoal;
}

/**
 * The complete state of the Brain.
 * Stores the semantic memory, current GenAI configuration, and the actor's current operational state (goals/plans).
 */
export type BrainState = {

    /** The deep semantic understanding of the world. */
    semantic_state: ISemanticState;
    /** Configuration state for the GenAI model (e.g., current thinking depth). */
    genai_state: GoogleGenAIState;
    /**
     * operational state of the agent as an actor.
     * Tracks what it is trying to achieve (goals) and how (types of plans).
     */
    actor_state: {
        /** The overarching goal driving the agent. */
        _metagoal: ISemanticMetaGoal;
        /** The specific plan currently being executed. */
        current_plan: BrainStatePlan;
        /** List of active goals derived from the metagoal. */
        current_goals: ISemanticGoal[];

    };
}

/**
 * Represents a concrete plan of action for the brain.
 */
export type BrainStatePlan = {
    /** Contextual data supporting the plan. */
    data: IContexedSemanticData<string>;
    /** Description of the action to be taken. */
    action: string;
    /** Priority/Salience of this plan (0.0 to 1.0). */
    salience: number;
}





/**
 * Interface for the Brain controller, exposing the GenAI instance and its state.
 */
export interface IGeminiBrainController extends ILargeLanguageModelController {
    instance: GoogleGenAI;
    state: BrainState;
}


/**
 * The Brain is the central controller of the agent.
 * It coordinates the faculties (Thought, Language) to perceive, plan, and act.
 * It maintains the central state (Semantic and Actor state) and manages the lifecycle of the agent.
 */
export class Brain implements IGeminiBrainController {
    instance: GoogleGenAI;
    state: BrainState;

    protected language_faculties: Language;
    protected thought_faculties: Thought;
    protected memory_faculties: Memory;

    /**
     * Generates the initial placeholder plan for the agent.
     * This bootstraps the actor state before any real cognitive processing occurs.
     * @param metagoal - The guiding metagoal for the agent.
     * @returns A basic BrainStatePlan.
     */
    private initialPlan(metagoal: ISemanticMetaGoal): BrainStatePlan {
        const plan = {
            data: SemanticStateFactory.newContextedSemanticData({
                title: "Initial Plan",
                semantic_data: "",
                semantic_tags: [],
                context: {
                    semantic_representation: "Initial Plan",
                    metagoal: metagoal,
                    goals: [],
                }
            }),
            action: "Template placeholder",
            salience: 0,
        } as BrainStatePlan;
        return plan;
    }


    constructor(initial_state: BrainInitialState) {
        const semantic_state = SemanticStateFactory.blank();
        this.state = {
            semantic_state: semantic_state,
            genai_state: initial_state.genai_state,
            actor_state: {
                _metagoal: initial_state.metagoal,
                current_plan: this.initialPlan(initial_state.metagoal),
                current_goals: [],
            }
        };
        this.instance = new GoogleGenAI({});
        const instance_handle: IGeminiBrainController = {
            instance: this.instance,
            state: this.state,
        }

        this.language_faculties = new Language(instance_handle);
        this.thought_faculties = new Thought({
            language_callable: this.language_faculties.process.bind(this.language_faculties),
            brain_state: this.state,
        });
        const memory_handle: MemoryInitialState = {
            brain_state: this.state,
            language_faculty: this.language_faculties,
            baseDir: "save/memory",
        }
        this.memory_faculties = new Memory(memory_handle);

    }




    /**
     * Accessor for the agent's meta-goal.
     */
    public get metagoal(): ISemanticMetaGoal {
        return this.state.actor_state._metagoal;
    }

    /**
     * Accessor for the agent's current active goals.
     */
    public get goals(): ISemanticGoal[] {
        return this.state.actor_state.current_goals;
    }

    /**
     * Accessor for the agent's current plan of action.
     */
    public get plan(): BrainStatePlan {
        return this.state.actor_state.current_plan;
    }



    /**
     * Accessor for the agent's cognitive faculties.
     * @returns An object containing the Language and Thought faculties.
     */
    public faculties() {
        return {
            language: this.language_faculties,
            thought: this.thought_faculties,
            memory: this.memory_faculties,
        }
    }

    // now we need to implement the methods that justify the existence of the brain //

    // These include but are not limited to:
    /**
     * 1. AbstractSemanticState comprehension
     * 2. Goal,plan, and action understanding and generation.
     * 3. Manage thinking levels and detail with managing the model used.
     * 4. Manage the hypothesis loop and topic loop. 
     * 5. Manage the review loop.
     * 6. Manage the data organization and context.
     * 7. Manage the state of the agent.
     * 
     * We must define a couple of key axioms:
     * 1. The goals of the agent are derived recursively from the goals of the agent which we will call the metagoals.
     * 
     * My current plan is to create an async pulse method that runs in a loop
     */

}