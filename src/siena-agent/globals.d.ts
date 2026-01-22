import type { AgentConfig } from "@siena-agent";
import type { ThoughtSpeed, ThoughtClarity } from "@siena-thought";

/**
 * GLOBAL CONSTANTS FILE
 */
export type GLOBAL_STATE = {
    readonly metatable: {
        config: AgentConfig;
        enum: {
            ThoughtShape: {
                ThoughtSpeed: ThoughtSpeed;
                ThoughtClarity: ThoughtClarity;
            }
        }
    }
    [key: string]: any;
}

