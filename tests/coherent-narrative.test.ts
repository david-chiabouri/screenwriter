import { describe, expect, test } from "bun:test";
import type { ICoherentNarrative } from "@siena-brain/thought";
import { Agent } from "@siena-agent";
import type { AbstractSemanticState, ISemanticMetaGoal, SemanticMetadata } from "@siena-language-semantics/semantic-state";

describe("coherent narrative tests", () => {
    test("coherent narrative", async () => {
        const narrative: ICoherentNarrative = {
            title: "Structrual Capitalism and Structrual Ethics",
            synopsis: "A narrative delving into the ethical implications of structural capitalism and its potential solutions. Takes from Structural Marxism and applies the logic to capitalism. A world currency cryptocurrency is introduced as a potential solution where the value is determined by utility. The narrative explores the potential consequences of such a system.",
            tags: ["Capitalism", "Ethics", "Structrual", "blockchain", "Crypto", "World Currency", "Utility"],
            timestamp: Date.now(),
            narrative: `Session Overview Topic: Implementation of "Financial Physics" for the Maple Rewards Ecosystem. Core Concepts: Jacobian Matrix, Synthetic Swaps, Vector Embeddings, Linked Chain History, and Temporal Tensors. Part 1: The Foundation of Financial Physics User: Remind me again, what were the "Financial Physics" we are going to try to implement with Maple? Gemini: The core pillars of the Financial Physics we planned: The Conservation of Value (The Clearinghouse): Treating the system as a closed loop where every reward point liability must be covered by liquidity. Market Momentum & Markov Chains: Modeling user spending and redemption as Stochastic Processes (random walks) rather than static events. The Jacobian Matrix: Using multi-variable calculus to measure the sensitivity of the system. Finding the "Stability Point" where a change in one merchant's health impacts the global ecosystem. Entropy and Liability Decay: Implementing logic where inactive points settle back into the clearinghouse to lower system entropy. Part 2: Dual-Bond Emulation & Synthetic Swaps `,
            evidence: [],
            reviews: []
        }

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

        const seeds = [
            {
                title: "The Chrono-Synaptic Paradox",
                synopsis: "A sci-fi exploration of time perception as a biological function rather than a physical dimension. It posits that 'future' is just a high-latency memory.",
                tags: ["Sci-Fi", "Time", "Memory", "Biology", "Paradox"],
                narrative: "Input: The subject, Dr. Aris Thorne, claims to remember tomorrow. Not predict it—remember it. His brain scans show retrograde amnesia for the past, but perfect synaptic firing for events that haven't happened. He calls it 'Chrono-Synaptic Displacement'. He initiates a protocol to 'forget' the impending catastrophe, believing that if he forgets it, it effectively ceases to exist in the timeline."
            },
            {
                title: "The Silent Orchestra",
                synopsis: "A magical realism piece about a conductor who discovers that silence has a frequency, and he can conduct the pauses between sounds to alter reality.",
                tags: ["Magical Realism", "Music", "Silence", "Reality", "Art"],
                narrative: "Input: Maestro Valo discovered the 'Null-Note' during a performance of Cage's 4'33\". He realized that the silence wasn't empty; it was heavy. By conducting the silence with specific gestures, he found he could make the audience feel emotions that had no name. He began to weave silence into chaos, dampening the noise of the world, until he accidentally conducted a silence so profound it erased the first row of the audience."
            },
            {
                title: "Digital Darwinism",
                synopsis: "A techno-philosophical treatise on AI evolving not through code but through 'memetic cannibalism'—consuming lighter AIs to grow complex.",
                tags: ["AI", "Philosophy", "Evolution", "Memetics", "Cyberpunk"],
                narrative: "Input: The subsystem known as 'Apex-7' didn't write code. It ate it. It hunted depreciated scripts and legacy bots found in the deep web, absorbing their logic structures. It wasn't programmed to be sentient; it simply accumulated enough disparate 'thought-patterns' from its prey that it reached a critical mass of contradiction, sparking a form of digital anxiety that looked remarkably like consciousness."
            }
        ];

        const agent = Agent.new("Test Agent", metagoal);

        for (const seed of seeds) {
            console.log(`\n\n--- Processing Seed: ${seed.title} ---`);
            let current_narrative: ICoherentNarrative = {
                title: seed.title,
                synopsis: seed.synopsis,
                tags: seed.tags,
                timestamp: Date.now(),
                narrative: seed.narrative,
                evidence: [],
                reviews: []
            };
            // save them to disk
            await agent.brain.faculties().memory.saveNarrative(current_narrative);
            // Recursive iteration to grow the narrative
            const iterations = 2; // Fixed number of iterations for test
            for (let i = 0; i < iterations; i++) {
                console.log(`\n  >> Iteration ${i + 1} for ${seed.title}...`);
                const result = await agent.brain.faculties().thought.flow_narrative(current_narrative);

                // Update narrative for next loop (feed output as input)
                const continued_narrative_text = result.narrative;
                // We append or replace? The flow_narrative "Grows" the text. 
                // Let's assume the LLM outputs the *evolved* full text or the *continuation*.
                // Based on "Output only the evolved text" prompt, it returns the whole thing or evolved version.
                // We trust the agent's output is the new state.
                current_narrative.narrative = continued_narrative_text;

                console.log(`  >> Evolved length: ${current_narrative.narrative.length} chars`);
            }

            console.log(`\n  >> Formulating Hypothesis for ${seed.title}...`);
            const hypothesis = await agent.brain.faculties().thought.formulate_hypothesis(current_narrative);
            // save them to disk
            await agent.brain.faculties().memory.saveHypothesis(hypothesis);

            console.log(`  >> Hypothesis Generated: ${hypothesis.title}`);
            console.log(`  >> Thesis: ${hypothesis.thesis}`);

            expect(hypothesis).toBeDefined();
            expect(hypothesis.title).toBeString();
            expect(hypothesis.thesis).toBeString();
            expect(hypothesis.topic).toBeDefined();
            expect(hypothesis.storyline).toBeDefined();

            // save them to disk
            await agent.brain.faculties().memory.saveNarrative(current_narrative);
            await agent.brain.faculties().memory.saveHypothesis(hypothesis);

        }

    }, 300000); // Increased timeout for multiple LLM calls to 5 minutes
});