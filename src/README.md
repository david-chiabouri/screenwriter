# What is the Siena Agent?

**Siena** is a modular, bio-inspired AI agent designed for **recursive long-form content generation**. Unlike traditional LLM wrappers that simply autocomplete text, Siena operates as a stateful, goal-directed entity capable of managing complex creative projects—from novels to video essays—from conception to final output.

## Core Philosophy
Siena is built on the premise that complex creativity requires **recursion** and **hierarchy**, not just raw inference.

1.  **The Meta-Goal**: The agent is guided by a single, immutable high-level objective (e.g., "Create a video essay about the psychological allegory in *The Queen's Gambit*").
2.  **Recursive Planning**: Siena breaks this meta-goal down into abstract goals (What/Where/Why/How), which are further refined into concrete plans and actions.
3.  **Stateful Cognition**: It maintains a persistent "Mental State" (The Brain) that tracks what it has already established (Evidence/Narrative) and what it hypothesizes.

## Programmatic Creativity
Siena doesn't just output text; it outputs **Blueprints**.
It is designed to generate intermediate structured formats that can be programmatically converted into final media assets.

*   **The Script**: Not just dialogue, but a structured sequence of timed segments.
*   **The Storyboard**: Visual descriptions mapped to script segments.
*   **The Output**: These blueprints are fed into rendering engines (like **Remotion**) to programmatically generate final video files without human editing.

### Example Pipeline: Video Essay
1.  **Input**: Meta-Goal + Research Folder (PDFs/Essays).
2.  **Process**:
    *   Siena ingests research and builds a semantic map.
    *   It recursively drafts a narrative structure.
    *   It generates a `Script` object with narration.
    *   It generates a `Storyboard` object with image prompts for each narration block.
3.  **Output**: A code-generated video file (Slideshow style) combining the narration and images.

## Primary Capabilities
In its current implementation, Siena provides three foundational capabilities:

1.  **Recursive Goal Setting**: It can take a vague objective and strictly define the thousands of small steps needed to achieve it.
2.  **Autonomous Review**: It judges its own content against the Meta-Goal, rewriting and refining until the quality threshold is met.
3.  **Format-Agnostic Generation**: It generates content in strict, type-safe structures (JSON/Interfaces) that can be utilized by other software components.

*Created with the help of AI*