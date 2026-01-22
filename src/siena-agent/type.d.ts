import type { GoogleGenAIState, Brain } from "@siena-brain";
import type { ISemanticGoal, ISemanticMetaGoal } from "@siena-language-semantics/semantic-state";


/**
 * Configuration options for the Agent.
 * @property google_genai_config - Configuration for the underlying Google GenAI model (Brain).
 * @property root_instruction - The base systemic instruction that defines the agent's persona and constraints.
 */
export type AgentConfig = {
    google_genai_config: GoogleGenAIState;
    root_instruction: string;
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