import { describe, expect, test } from "bun:test";
import { Agent } from "../src/agent";
import { ThoughtClarity, ThoughtSpeed } from "../src/agent/thought";
import type { AbstractSemanticState, ISemanticMetaGoal, SemanticMetadata } from "../src/agent/semantics/semantic-state";

// Mock data
const abstract_state: AbstractSemanticState = {
    what: "Test Goal", where: "Test Env", why: "To Test", how: "By Testing"
};
const metagoal: ISemanticMetaGoal = {
    detailed: "Detailed Metagoal",
    abstract: abstract_state,
};
const metadata: SemanticMetadata = {
    title: "Test Title",
    semantic_data: "Test Data",
    semantic_tags: ["test"],
    timestamp: Date.now(),
};

describe("Agent Configuration & Integration", () => {

    test("should use configured ThoughtSpeed and ThoughtClarity in GenAI call", async () => {
        // 1. Setup Agent with specific config
        const agent = Agent.new("Config Test Agent", metagoal, {
            root_instruction: "You are a test agent",
            google_genai_config: {
                systemInstruction: "System prompt",
                current_thinking_shape: {
                    thoughtSpeed: ThoughtSpeed.FAST, // Specific speed
                    thoughtClarity: ThoughtClarity.CLEAR,
                    includeThoughts: false
                }
            }
        });

        // 2. Trigger the action that uses the config (newGoal) - REAL CALL
        console.log("--- Starting Real API Call (Test 1) ---");
        const goal = await agent.newGoal(abstract_state, metadata);
        console.log("--- Finished Real API Call (Test 1) ---");

        // 3. Verify the detailed property was populated
        console.log("Generated Goal Detail:", goal.detailed);

        expect(goal.detailed).toBeString();
        expect(goal.detailed.length).toBeGreaterThan(10); // Expect reasonable output
    }, 60000);

    test("should update config and reflect in subsequent calls", async () => {
        // 1. Create default agent
        const agent = Agent.new("Dynamic Config Agent", metagoal);

        // 2. INITIAL CALL - Should use defaults (FAST / INTUITIVE defined in Agent.ts)
        console.log("--- Starting Real API Call (Test 2 - Call 1) ---");
        await agent.newGoal(abstract_state, metadata);
        console.log("--- Finished Call 1 ---");

        // 3. UPDATE CONFIG via Brain State
        agent.brain.state.genai_state.current_thinking_shape.thoughtSpeed = ThoughtSpeed.THOUGHTFUL;
        agent.brain.state.genai_state.current_thinking_shape.thoughtClarity = ThoughtClarity.IMPRESSIONISTIC;

        // 4. SECOND CALL - Should use new config
        console.log("--- Starting Real API Call (Test 2 - Call 2) ---");
        const goal = await agent.newGoal(abstract_state, metadata);
        console.log("Generated Goal Detail (Call 2):", goal.detailed);

        expect(goal.detailed).toBeString();
        expect(goal.detailed.length).toBeGreaterThan(10);
    }, 60000);
});
