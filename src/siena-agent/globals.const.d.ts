/**
 * GLOBAL CONSTANTS FILE
 */

type GLOBALS = {
    default_config: AgentConfig;
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

export default GLOBALS = {
    default_config: DEFAULT_AGENT_CONFIG
}