
// std
import { describe, expect, test, afterAll, beforeAll } from "bun:test";

// external
import { GoogleGenAI } from "@google/genai";

// local
import { Memory, type MemoryInitialState } from "@siena-memory";
import { Language } from "@siena-language";
import type { BrainState, IGeminiBrainController } from "@siena-brain";
import * as fs from "fs/promises";
import * as path from "path";
import { ThoughtSpeed } from "@siena-thought";
import { SemanticStateFactory } from "@siena-language-semantics/semantic-state";

const TEST_SAVE_DIR = "tests/temp_memory_save";

describe("Memory Persistence Tests", () => {

    let memory: Memory;

    beforeAll(async () => {
        // Mock dependencies
        const mockGenAIState = {
            current_thinking_shape: { thoughtSpeed: ThoughtSpeed.FAST, thoughtClarity: "LOW" },
            systemInstruction: ""
        };
        const mockBrainState: BrainState = {
            semantic_state: SemanticStateFactory.blank(),
            genai_state: mockGenAIState as any,
            actor_state: {
                _metagoal: {} as any,
                current_plan: {} as any,
                current_goals: []
            }
        };

        const mockController: IGeminiBrainController = {
            instance: new GoogleGenAI({}),
            state: mockBrainState
        };

        const language = new Language(mockController);

        const memoryInitState: MemoryInitialState = {
            brain_state: mockBrainState,
            language_faculty: language,
            baseDir: TEST_SAVE_DIR
        };

        memory = new Memory(memoryInitState);
    });

    afterAll(async () => {
        // Cleanup test directory
        try {
            await fs.rm(TEST_SAVE_DIR, { recursive: true, force: true });
        } catch (e) {
            console.error("Failed to cleanup test dir", e);
        }
    });

    test("should save a narrative to disk", async () => {
        const narrative = {
            title: "Test Narrative",
            synopsis: "A short test story",
            tags: ["test", "unit"],
            timestamp: Date.now(),
            narrative: "Once upon a time in a test runner...",
            evidence: [],
            reviews: []
        };

        await memory.saveNarrative(narrative);

        // Verify file exists
        const sanitizedTitle = "test_narrative";
        const filename = `${sanitizedTitle}_${narrative.timestamp}.json`;
        const filePath = path.join(TEST_SAVE_DIR, "narrative", filename);

        const fileExists = await fs.exists(filePath);
        expect(fileExists).toBe(true);

        // Verify content
        const content = await fs.readFile(filePath, "utf-8");
        const parsed = JSON.parse(content);
        expect(parsed.title).toBe(narrative.title);
        expect(parsed.narrative).toBe(narrative.narrative);
    });

    test("should save a hypothesis to disk", async () => {
        const hypothesis = {
            title: "Test Hypothesis",
            synopsis: "A test hypothesis",
            tags: ["science", "test"],
            timestamp: Date.now(),
            thesis: "Testing is good",
            topic: {
                title: "Test Topic",
                description: "A topic",
                synopsis: "summary",
                semantic_data: "data",
                tags: ["topic"],
                semantic_tags: [],
                timestamp: Date.now(),
                reviews: [],
                evidence: [],
                semantify: () => "topic string"
            },
            storyline: {
                title: "Story",
                synopsis: "synopsis",
                tags: [],
                timestamp: Date.now(),
                reviews: [],
                introduction: "intro",
                body: ["body"],
                conclusion: "conclusion",
                evidence: []
            },
            evidence: [],
            reviews: []
        };

        await memory.saveHypothesis(hypothesis);

        // Verify file exists
        const sanitizedTitle = "test_hypothesis";
        const filename = `${sanitizedTitle}_${hypothesis.timestamp}.json`;
        const filePath = path.join(TEST_SAVE_DIR, "hypothesis", filename);

        const fileExists = await fs.exists(filePath);
        expect(fileExists).toBe(true);
    });

});
