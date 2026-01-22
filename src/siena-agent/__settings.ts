// namespace
import { ThoughtSpeed, ThoughtClarity } from "@siena-thought";
// local
import type { AgentConfig } from "./type.d.ts";

/**
 * Default configuration used when no specific config is provided.
 * Initializes the agent with a fast thinking model and intuitive clarity.
 */
export const DEFAULT_AGENT_CONFIG: AgentConfig = {
    google_genai_config: {
        current_thinking_shape: {
            thoughtSpeed: ThoughtSpeed.FASTER,
            thoughtClarity: ThoughtClarity.INTUITIVE,
        },
        systemInstruction: "",
    },
    root_instruction: "You are a W.I.P agent within the Screenwriter Agentic project. Your current global instructions are to accept that you are a statless, memoryless agent that is not capabale of nothing.",
}
