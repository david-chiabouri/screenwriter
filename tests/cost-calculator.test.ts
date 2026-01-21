import { describe, expect, test } from "bun:test";
import { GoogleGenAICosts } from "../src/agent/lib/google-genai-cost-calculator";
import { ThoughtSpeed } from "../src/agent/thought";

describe("GoogleGenAICosts", () => {
    test("should estimate basic cost for Flash (under 128k)", () => {
        const inputTokens = 1000;
        const outputTokens = 100;
        const cost = GoogleGenAICosts.estimate(ThoughtSpeed.FAST, inputTokens, outputTokens);

        // Input: 1000 * 0.075 / 1M = 0.000075
        // Output: 100 * 0.30 / 1M = 0.000030
        // Total: 0.000105
        expect(cost).toBeCloseTo(0.000105, 10);
    });

    test("should estimate cost for high context (>128k)", () => {
        const inputTokens = 150_000; // > 128k
        const outputTokens = 1000;
        const cost = GoogleGenAICosts.estimate(ThoughtSpeed.FAST, inputTokens, outputTokens);

        // Input: 150,000 * 0.15 / 1M = 0.0225
        // Output: 1000 * 0.60 / 1M = 0.0006
        // Total: 0.0231
        expect(cost).toBeCloseTo(0.0231, 10);
    });

    test("should handle cached inputs", () => {
        const inputTokens = 100_000;
        const cost = GoogleGenAICosts.estimate(ThoughtSpeed.FAST, inputTokens, 0, true);

        // Cached Input: 100,000 * 0.01875 / 1M = 0.001875
        expect(cost).toBeCloseTo(0.001875, 10);
    });

    test("should handle storage costs", () => {
        const inputTokens = 1_000_000;
        const duration = 10; // 10 hours
        const cost = GoogleGenAICosts.estimate(ThoughtSpeed.FAST, inputTokens, 0, true, duration);

        // Cached Input: 1,000,000 * 0.01875 / 1M = 0.01875
        // Storage: 1,000,000 * 0.0002 * 10 = 0.002
        // Total: 0.02075
        expect(cost).toBeCloseTo(0.02075, 10);
    });

    test("should estimate from strings", () => {
        const input = "1234"; // ~1 token
        const output = "12341234"; // ~2 tokens
        const cost = GoogleGenAICosts.estimate(ThoughtSpeed.FAST, input, output);
        // Should calculate cost > 0
        expect(cost).toBeGreaterThan(0);
    });
});
