/**
 * Enum defining the thinking speeds (models) available to the brain.
 * Different models are chosen based on the complexity and urgency of the task.
 */
/**
 * Enum defining the thinking speeds (models) available to the brain.
 * Different models are chosen based on the complexity and urgency of the task.
 * 
 * Note: Uses specific versioned model names to ensure compatibility with Google GenAI API.
 */
export enum ThoughtSpeed {
    /** 
     * gemini-3-pro-preview
     * High capability, balanced speed. Excellent for deep reasoning and creative writing. 
     * Supports complex instruction following.
     */
    THOUGHTFUL = "gemini-3-pro-preview",

    /** 
     * gemini-3-flash-preview
     * The standard workhorse. Good balance of speed and reasoning for general tasks.
     */
    STANDARD = "gemini-3-flash-preview",

    /** 
     * gemini-2.5-flash
     * Optimized for maximum speed and lower latency. 
     * Ideal for quick validation or simple data processing.
     * Note: May not support advanced 'thinkingConfig' features like Chain of Thought.
     */
    FAST = "gemini-2.5-pro",

    /** 
     * gemini-2.5-flash (Experimental Alias)
     * Reserved for future faster-speed or experimental model variants.
     */
    FASTER = "gemini-2.5-flash", // Experimental

    /**
     * gemini-flash-lite
     
     */
    EXTREME = "gemini-flash-lite", // Experimental

}

export enum ThoughtEmbeddingModel {

    /**
     * gemini-embedding-001
     * 
     */
    STANDARD = "gemini-embedding-001",
}

/**
 * Mapping of verbose thinking level descriptions to API constants.
 * Allows for more expressive control over the thinking depth.
 */
export enum ThoughtLevelVerboseAsClarity {
    CLEAR = "HIGH",
    INTUITIVE = "MEDIUM",
    IMPRESSIONISTIC = "MEDIUM",
    CONFUSED = "MINIMAL",
    UNSPECIFIED = "THINKING_LEVEL_UNSPECIFIED",
}
