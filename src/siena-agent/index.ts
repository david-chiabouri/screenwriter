// namespace
import { ThoughtSpeed, ThoughtClarity } from "@siena-thought";

// local
import { Brain, type BrainInitialState, type GoogleGenAIState } from "@siena-brain";
import { type AbstractSemanticState, type ISemanticGoal, type ISemanticMetaGoal, type SemanticMetadata } from "@siena-language-semantics/semantic-state";

// local
import type { AgentConstructorIngredients, AgentConfig, AgentState } from "./type.d.ts";
import _G from "./globals";

// export==
export type * from "./type.d.ts";
export * from "./globals";
export * from "./brain";


/**
 * The main Agent class.
 * Represents an autonomous entity capable of thinking, planning, and acting.
 * It serves as a wrapper around the `Brain`, providing lifecycle management and tracking.
 */
export class Agent {
    /** Global registry of instantiated agents. */
    public static instansiated: Agent[] = [];


    /**
     * The name of the agent, used for identification.
     */
    public name: string;

    /**
     * The meta-goal defining the agent's high-level purpose and constraints.
     */
    public metagoal: ISemanticMetaGoal;


    /**
     * The brain instance controlling this agent.
     */
    protected _brain: Brain;
    protected _goals: ISemanticGoal[] = [];


    /**
     * Creates a new Agent with a specific Brain.
     * @param brain - The brain instance controlling this agent.
     */
    constructor(ingredients: AgentConstructorIngredients) {
        this.name = ingredients.name;
        this._brain = ingredients.brain;
        this.metagoal = ingredients.metagoal;
        this._goals = ingredients.goals ?? [];
    }


    /**
     * Generates a new semantic goal based on an abstract state description.
     * This acts as the agent's "Decision" phase, where it solidifies an abstract intent into a concrete objective.
     * 
     * @param abstract - The abstract understanding of the current situation (What, Where, Why, How).
     * @param metadata - Metadata context for the goal (Title, Tags, Timestamp).
     * @returns A promise resolving to a fully formed ISemanticGoal with a detailed AI-generated description.
     */
    public async newGoal(abstract: AbstractSemanticState, metadata: SemanticMetadata): Promise<ISemanticGoal> {
        const detailed_description: string = await this.brain.faculties().language.detailedDescriptionOfAbstractState(abstract, metadata);
        const manufactured_goal: ISemanticGoal = {
            abstract: abstract,
            detailed: detailed_description,
            salience: 0,
            ...metadata,
        } as ISemanticGoal;
        return manufactured_goal;

    }

    /**
     * Accessor for the agent's brain.
     */
    public get brain(): Brain {
        return this._brain;
    }





    /**
     * Factory method to create a new Agent with a fresh Brain.
     * Automatically registers the agent in the `instantiated` list.
     * @returns A new Agent instance.
     */
    public static new(name: string = "Unnamed", metagoal: ISemanticMetaGoal, config?: AgentConfig): Agent {
        const genai_config: GoogleGenAIState = config?.google_genai_config ?? _G.metatable.config.google_genai_config;

        const init_state: BrainInitialState = {
            genai_state: genai_config,
            metagoal: metagoal,

        }

        const brain = new Brain(init_state);
        const agent_ingredients = {
            name,
            brain,
            metagoal,
            config
        } as AgentConstructorIngredients;
        const agent = new Agent(agent_ingredients);
        Agent.instansiated.push(agent);
        return agent;
    }



    /**
     * Initiates a "pulse" or cognitive cycle for the agent.
     * This method represents a moment of active processing where the agent evaluates its state and potential actions.
     * 
     * @param agent - The agent instance to pulse.
     * @param state - The current semantic state to process.
     * @returns A promise resolving to the updated state.
     */
    public static async pulse<T extends AbstractSemanticState>(agent: Agent, state: T): Promise<T> {
        const context: AgentState = {
            name: agent.name,
            brain: agent.brain,
            metagoal: agent.metagoal,
            goals: agent._goals,
            config: _G.default_config ?? {
                google_genai_config: {
                    current_thinking_shape: {
                        thoughtSpeed: ThoughtSpeed.STANDARD,
                        thoughtClarity: ThoughtClarity.UNSPECIFIED,
                        includeThoughts: undefined
                    },
                    systemInstruction: ""
                },
                root_instruction: ""
            }
        }

        const promise = new Promise<T>((resolve, reject) => {

        })
        return promise;
    }
}