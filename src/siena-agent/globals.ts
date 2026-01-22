
// namespace
import { ThoughtSpeed, ThoughtClarity } from "@siena-thought";
import { DEFAULT_AGENT_CONFIG } from "@siena-agent-settings";

// local
import type { GLOBAL_STATE } from "./globals.d";


/**
 * GLOBAL STATE
 * this constant is used to store global state variables. It is enteirly dumb and static. 
 * If any body wants to manage it they will need to create functions for it.
 */
const _G: GLOBAL_STATE = {
    metatable: {
        config: DEFAULT_AGENT_CONFIG,
        enum: {
            ThoughtShape: {
                ThoughtSpeed: ThoughtSpeed.STANDARD,
                ThoughtClarity: ThoughtClarity.UNSPECIFIED,
            }
        }
    }
}


export default _G;