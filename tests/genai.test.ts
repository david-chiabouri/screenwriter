import { describe, expect, test } from "bun:test";
import { Agent } from "../src/agent";
import { type AbstractSemanticState, type ISemanticGoal, type ISemanticMetaGoal, type SemanticMetadata } from "../src/agent/semantics/semantic-state";


// the abstract state represents the context of the AI prompt used to generate the goal.
const abstract_state: AbstractSemanticState = {
    what: "The goal is to test exist to aid in the development of the system.", // what the goal is described in varying detail.
    where: "You are currently in a test environment within the project Screenwriter AI system.", // where the goal applies, and the locational context that's important.
    why: "This goal exists to aid in the development of the system.", // why the goal is important, and the motivational context that's important.
    how: "This goal is achieved by doing nothing and being a good subject.", // how the goal is described in varying detail.
};
const metagoal: ISemanticMetaGoal = {
    detailed: "You are a test agent of the Screenwriter AI system. Your goal is to test exist to aid in the development of the system.",
    abstract: abstract_state,
}
const goal_metadata: SemanticMetadata = {
    title: "This is a title for a test goal.",
    semantic_data: "This is the semantic data of the goal.",
    semantic_tags: ["goal", "test", "important"],
    timestamp: Date.now(),
}


// Initialize a static agent for testing structural integrity
const testAgent = Agent.new("Test Agent", metagoal);
const testGoal: ISemanticGoal = await testAgent.newGoal(abstract_state, goal_metadata);
describe("Goal tests", () => {
    test("should have a title", () => {
        expect(testGoal.title).toBe("This is a title for a test goal.");
    });
    test("should have a semantic data", () => {
        expect(testGoal.semantic_data).toBe("This is the semantic data of the goal.");
    });
    test("should have a semantic tags", () => {
        expect(testGoal.semantic_tags).toEqual(["goal", "test", "important"]);
    });
    test("should have a timestamp", () => {
        expect(testGoal.timestamp).toBeGreaterThan(0);
    });
});



describe("Agent tests", () => {
    /**
     * Verifies that the agent is correctly initialized with a Brain.
     */
    test("should have a brain", () => {
        expect(testAgent.brain).toBeDefined();
    });

    /**
     * Verifies that the language faculty (GenAI interface) is present.
     */
    test("should have a language faculty", () => {
        expect(testAgent.brain.faculties().language).toBeDefined();
    });

    /**
     * Verifies that the thought faculty (Higher-level cognition) is present.
     */
    test("should have a thought faculty", () => {
        expect(testAgent.brain.faculties().thought).toBeDefined();
    });
});

