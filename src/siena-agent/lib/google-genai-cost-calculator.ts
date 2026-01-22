import { ThoughtSpeed } from "@siena-thought";

/**
 * Interface defining the pricing structure for a specific GenAI model.
 * Pricing is typically per million tokens.
 */
interface CostModel {
    /** Cost per 1 million input tokens (context <= 128k). */
    input_cost_under_128k: number;
    /** Cost per 1 million input tokens (context > 128k). */
    input_cost_over_128k: number;
    /** Cost per 1 million output tokens (context <= 128k). */
    output_cost_under_128k: number;
    /** Cost per 1 million output tokens (context > 128k). */
    output_cost_over_128k: number;
    /** Cost per 1 million cached input tokens. */
    cached_input_cost: number;
    /** Storage cost per 1 million tokens per hour. */
    storage_cost_per_hour: number;
}

/**
 * Static calculator for estimating Google GenAI API costs.
 * Supports tiered pricing based on context window size and context caching.
 */
export class GoogleGenAICosts {

    /**
     * Pricing table for supported models.
     * Costs are in USD per 1 Million Tokens.
     * Based on public Gemini pricing (approximate).
     */
    private static readonly PRICING_TABLE: Record<string, CostModel> = {
        // Gemini 1.5 Flash Pricing ("gemini-3-flash")
        "gemini-3-flash": {
            input_cost_under_128k: 0.075,
            input_cost_over_128k: 0.15,
            output_cost_under_128k: 0.30,
            output_cost_over_128k: 0.60,
            cached_input_cost: 0.01875,
            storage_cost_per_hour: 0.0002,
        },
        // Gemini 1.5 Pro Pricing ("gemini-2.5-flash") - NOTE: User mapped this to 2.5-flash
        "gemini-2.5-flash": {
            input_cost_under_128k: 1.25,
            input_cost_over_128k: 2.50,
            output_cost_under_128k: 3.75,
            output_cost_over_128k: 7.50,
            cached_input_cost: 0.3125,
            storage_cost_per_hour: 0.001,
        }
    };

    /**
     * Helper to estimate token count from a string if raw count isn't provided.
     * Uses a heuristic of ~4 characters per token.
     */
    private static countTokens(input: string | number): number {
        if (typeof input === 'number') return input;
        return Math.ceil(input.length / 4);
    }

    /**
     * Calculates the estimated cost for a GenAI request.
     * Lazy execution: allows flexible input types.
     * 
     * @param model - The model identifier (e.g., ThoughtSpeed enum).
     * @param input - Input prompt as string or token count.
     * @param output - Output response as string or token count.
     * @param cached - Whether the input uses context caching (default: false).
     * @param durationHours - Duration for storage calc if applicable (default: 0).
     * @returns The estimated cost in USD.
     */
    public static estimate(
        model: string | ThoughtSpeed,
        input: string | number,
        output: string | number,
        cached: boolean = false,
        durationHours: number = 0
    ): number {
        const modelKey = model as string;
        // Fallback to Flash (gemini-3-flash) if model not found
        const priceModel = this.PRICING_TABLE[modelKey] || this.PRICING_TABLE["gemini-3-flash"];

        if (!priceModel) {
            // Should not happen as long as hardcoded fallback exists, but satisfies TS
            return 0;
        }

        const inputTokens = this.countTokens(input);
        const outputTokens = this.countTokens(output);

        // Determine tier based on input size for input costs
        // Gemini 1.5 pricing tiers split at 128k context
        const isHighContext = inputTokens > 128000;

        let totalCost = 0;

        // 1. Input Cost
        if (cached) {
            totalCost += (inputTokens / 1_000_000) * priceModel.cached_input_cost;
            // Add storage cost if duration provided
            if (durationHours > 0) {
                totalCost += (inputTokens / 1_000_000) * priceModel.storage_cost_per_hour * durationHours;
            }
        } else {
            const inputRate = isHighContext ? priceModel.input_cost_over_128k : priceModel.input_cost_under_128k;
            totalCost += (inputTokens / 1_000_000) * inputRate;
        }

        // 2. Output Cost
        const outputRate = isHighContext ? priceModel.output_cost_over_128k : priceModel.output_cost_under_128k;
        totalCost += (outputTokens / 1_000_000) * outputRate;

        return totalCost;
    }
}