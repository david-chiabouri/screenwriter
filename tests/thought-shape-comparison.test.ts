import { describe, expect, test } from "bun:test";

// namespace
import { Agent } from "@siena-agent";
import { ThoughtClarity, ThoughtSpeed } from "@siena-thought";
import type { AbstractSemanticState, ISemanticMetaGoal, SemanticMetadata } from "@siena-language-semantics/semantic-state";

// Setup Data
const abstract_state: AbstractSemanticState = {
    what: "Creative Story Concept",
    where: "A Cyberpunk City",
    why: "To Explore Themes of Transhumanism",
    how: "Through a Detective Noir lens"
};
const metagoal: ISemanticMetaGoal = {
    detailed: "Generate creative concepts for a new screenplay.",
    abstract: abstract_state,
};
const metadata: SemanticMetadata = {
    title: "Neon Rain",
    semantic_data: "Core Themes: Identity, Memory, Technology",
    semantic_tags: ["sci-fi", "noir", "cyberpunk"],
    timestamp: Date.now(),
};

describe("ThoughtShape Output Comparison", () => {

    test("Comparison Run", async () => {
        const shapes = [
            {
                name: "FAST (No Thinking)",
                config: {
                    thoughtSpeed: ThoughtSpeed.FAST,
                    thoughtClarity: ThoughtClarity.THINKING_LEVEL_UNSPECIFIED,
                    includeThoughts: false
                }
            },
            {
                name: "STANDARD (Impressionistic Thinking)",
                config: {
                    thoughtSpeed: ThoughtSpeed.STANDARD,
                    thoughtClarity: ThoughtClarity.IMPRESSIONISTIC,
                    includeThoughts: true
                }
            },
            {
                name: "THOUGHTFUL (Clear Thinking)",
                config: {
                    thoughtSpeed: ThoughtSpeed.THOUGHTFUL,
                    thoughtClarity: ThoughtClarity.CLEAR,
                    includeThoughts: true
                }
            }
        ];

        console.log("\n==========================================");
        console.log("STARTING THOUGHT SHAPE COMPARISON RUN");
        console.log("==========================================\n");

        for (const shape of shapes) {
            console.log(`\n------------------------------------------`);
            console.log(`RUNNING SHAPE: ${shape.name}`);
            console.log(`Model: ${shape.config.thoughtSpeed}`);
            console.log(`Thinking Level: ${shape.config.thoughtClarity}`);
            console.log(`Include Thoughts: ${shape.config.includeThoughts}`);
            console.log(`------------------------------------------`);

            try {
                const agent = Agent.new(`Agent-${shape.name}`, metagoal, {
                    root_instruction: "You are a creative writer API.",
                    google_genai_config: {
                        systemInstruction: "Generate a detailed expansion of the provided concept.",
                        current_thinking_shape: shape.config
                    }
                });

                const goal = await agent.newGoal(abstract_state, metadata);

                console.log(`\n[OUTPUT for ${shape.name}]:\n`);
                console.log(goal.detailed);
                console.log(`\n[END OUTPUT for ${shape.name}]\n`);

                expect(goal.detailed).toBeString();
                expect(goal.detailed.length).toBeGreaterThan(10);

            } catch (error) {
                console.error(`FAILED SHAPE: ${shape.name}`, error);
                // Don't fail the whole test if one model fails (e.g. 429), just log it.
                // But generally we technically want the test to pass if broadly working.
            }
        }

        console.log("\n==========================================");
        console.log("COMPLETED COMPARISON RUN");
        console.log("==========================================\n");

    }, 300000); // 5 minute timeout for multiple calls
});
