import { ThinkingLevel } from "@google/genai";
import { Brain, type BrainInitialState, type GoogleGenAIState } from "./agent/brain";
import { Semantify, type AbstractSemanticState, type ISemanticGoal, type ISemanticMetaGoal, type SemanticMetadata } from "./agent/semantics/semantic-state";
import { ThoughtClarity, ThoughtSpeed } from "./agent/thought";

/**
 * Configuration options for the Agent.
 * @property google_genai_config - Configuration for the underlying Google GenAI model (Brain).
 * @property root_instruction - The base systemic instruction that defines the agent's persona and constraints.
 */
export type AgentConfig = {
    google_genai_config: GoogleGenAIState;
    root_instruction: string;
}

/**
 * Default configuration used when no specific config is provided.
 * Initializes the agent with a fast thinking model and intuitive clarity.
 */
const DEFAULT_AGENT_CONFIG: AgentConfig = {
    google_genai_config: {
        current_thinking_shape: {
            thoughtSpeed: ThoughtSpeed.FASTER,
            thoughtClarity: ThoughtClarity.INTUITIVE,
        },
        systemInstruction: "",
    },
    root_instruction: "You are a W.I.P agent within the Screenwriter Agentic project. Your current global instructions are to accept that you are a statless, memoryless agent that is not capabale of nothing.",
}

export type AgentConstructorIngredients = {
    name: string;
    brain: Brain;
    metagoal: ISemanticGoal;
    goals?: ISemanticGoal[];
    config?: AgentConfig;

}

export type AgentState = {
    name: string;
    brain: Brain;
    metagoal: ISemanticMetaGoal;
    goals: ISemanticGoal[];
    context?: string;
    readonly config: AgentConfig;
}

/**
 * The main Agent class.
 * Represents an autonomous entity capable of thinking, planning, and acting.
 * It serves as a wrapper around the `Brain`, providing lifecycle management and tracking.
 */
export class Agent {
    /** Global registry of instantiated agents. */
    public static instansiated: Agent[] = [];


    public name: string;
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
        const genai_config: GoogleGenAIState = config?.google_genai_config ?? DEFAULT_AGENT_CONFIG.google_genai_config;

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



    public static async pulse<T extends AbstractSemanticState>(agent: Agent, state: T): Promise<T> {
        const context: AgentState = {
            name: agent.name,
            brain: agent.brain,
            metagoal: agent.metagoal,
            goals: agent._goals,
            config: DEFAULT_AGENT_CONFIG ?? {
                google_genai_config: {
                    current_thinking_shape: {
                        thoughtSpeed: ThoughtSpeed.THOUGHTFUL,
                        thoughtClarity: ThinkingLevel.THINKING_LEVEL_UNSPECIFIED,
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