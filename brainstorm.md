# Brainstorming & Architectural Roadmap 🧠

This document outlines the strategic direction for the **Screenwriter** agent, synthesizing current "TODOs" into actionable architectural plans.

## 1. Architectural Refactoring: The "Unified Mind"
**Goal:** Simplify the type differences between `IAbstractSemanticData` and `IReviewable` to create a seamless flow of data between faculties.

* **Problem:** Currently, the definitions for topics, hypotheses, and narratives are slightly disjointed, making it hard to treat them as generic "thoughts" that can be processed recursively.
* **Proposed Solution:** Create a `UniversalThoughtUnit` interface.
    * **Base Type:** Every piece of data (Topic, Claim, Narrative, Goal) shares a common core: `ID`, `EmbeddingVector`, `SemanticData`, `Score/Salience`, `ReviewHistory`.
    * **Polymorphism:** Specific types (e.g., `Storyline`) extend this base type.
    * **Benefit:** This allows the *Brain* to query memory for "anything high-salience" regardless of whether it's a plot point or a philosophical axiom.

## 2. Cognitive Economy: The "Flash-Lite" Swarm 🐝
**Goal:** Leverage the low cost of `gemini-flash-lite` to perform massive background processing ("Latent Thought").

* **The Hierarchy of Thought:**
    * **Tier 1: The Swarm (`gemini-flash-lite`)**
        * **Role:** High-volume, low-latency tasks.
        * **Tasks:**
            * Generating thousands of micro-variations of goals.
            * Parsing large PDFs/media into atomic "nodes".
            * Running initial syntax/coherence checks on generated text.
            * "Dreaming": Randomly combining existing memory nodes to see if new connections form.
    * **Tier 2: The Manager (`gemini-2.5-flash`)**
        * **Role:** Filtering and structuring.
        * **Tasks:**
            * Reviewing the Swarm's output (e.g., filtering the top 10% of generated goals).
            * Organizing validated nodes into `Topics`.
    * **Tier 3: The Sage (`gemini-3-pro`)**
        * **Role:** Deep reasoning and final creative output.
        * **Tasks:**
            * Writing the actual screenplay scenes.
            * Performing complex "Review" loops on architectural plans.
            * Resolving "High Entropy" contradictions that the Swarm cannot handle.

## 3. The Cognitive Pipeline: From Meta Goal to Action
**Goal:** Formalize the loop from a user-defined `Meta Goal` to concrete execution.

### Phase A: Axiom Injection
* **Concept:** The `Meta Goal` (e.g., "Write a video essay on The Queen's Gambit") is converted into a set of **Axioms**.
* **Implementation:** These axioms are injected into *every* system instruction prompt, ensuring the agent never "drifts" from the core purpose, even deep in a recursive sub-task.

### Phase B: Semantic Mapping (The "Digestive" System)
* **Process:**
    1.  **Ingest:** Agent looks at a target folder (e.g., `@research/final`).
    2.  **Atomize:** `Flash-Lite` breaks documents into thousands of atomic "Semantic Nodes" (self-contained ideas).
    3.  **Embed:** Generate vector embeddings for every node.
    4.  **Link:** The "Alchemist" logic (from user profile) infers relationships between nodes, creating a knowledge graph.

### Phase C: Recursive Goal Generation
* **The Loop:**
    1.  **Generate:** `Flash-Lite` proposes 100 potential sub-goals based on the Semantic Map.
    2.  **Review:** A "Critic" model scores these goals against the **Axioms**.
    3.  **Refine:** The top 5 goals are expanded into detailed plans.
    4.  **Pressure System:** If the agent fails to generate good plans, a "Pressure" variable increases, forcing a switch to a smarter model (`Pro`) or a shift in strategy.

## 4. Memory Architecture: The "Holographic" DB
**Goal:** Implement a Vector Database to manage the agent's context window efficiently.

* **Technology:** `LanceDB` (already in `package.json`).
* **Structure:**
    * **Long-Term (The Archive):** Stores *all* generated text, raw research, and logs. Indexed by vector embeddings.
    * **Short-Term (The Workbench):** A dynamic collection of "currently relevant" nodes loaded into the LLM's context window.
* **Retrieval Strategy:**
    * Instead of loading a whole document, search the Vector DB for "Nodes relevant to [Current Goal]" + "Nodes related to [Axioms]".
    * This keeps the context window small and focused, reducing cost and hallucination.

## 5. The "Abstract Persona" Engine
**Goal:** Use System Instructions to force the agent into abstract cognitive states.

* **Concept:** Instead of "You are a writer," prompt: "You are the abstract concept of *Narrative Coherence*."
* **Application:**
    * **The Coherence Engine:** Takes random text strings and forces them into a narrative structure.
    * **The Entropy Reducer:** Takes conflicting data points and synthesizes a "Truth" that satisfies both (Thesis + Antithesis = Synthesis).

## 6. Execution Interface (The Hands)
**Goal:** A programmatic interface for the AI to *act* on the world.

* **Requirement:** The AI needs "Tools" it can call, not just text output.
* **Proposed Toolset:**
    * `FileSystem`: Read/Write capability (already partially implemented).
    * `MediaProcessor`: Ability to pass video files to a processing script (ffmpeg/remotion).
    * `WebSearch`: (Future) Ability to fetch fresh data if the Semantic Map has gaps.

## Next Immediate Steps (Action Plan)

1.  **[Refactor]** Create `IUniversalThought` interface in `primitive.ts` to unify data types.
2.  **[Memory]** Initialize `LanceDB` in `memory.ts` and create a `saveEmbedding()` method.
3.  **[Test]** Create a `swarm.test.ts` that uses `flash-lite` to generate 100 variations of a simple sentence to test cost/speed.
4.  **[Logic]** Implement the `Axiom` injection logic in `brain.ts` so the Meta Goal permeates all sub-calls.