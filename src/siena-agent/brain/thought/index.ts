import { type GenerateContentResponse } from "@google/genai";
import { IFaculty } from "../../lib/primitives/class";
import type { LanguageProcessCallable, LanguageProcessContext } from "@siena-language";
import type { BrainState } from "@siena-brain";
import { Semantify } from "@siena-language-semantics/semantic-state";

// Local
import type { ICoherentNarrative, IHypothesis, IStoryline, IThinkingFaculty, ITopic } from "./interface";
import { ThoughtSpeed } from "./enum";
import type { ThoughtInitialState } from "./type";

// exports
export * from "./enum";
export * from "./interface";
export * from "./type";










/**
 * The Thought faculty represents the agent's higher-level cognitive functions.
 * It uses the underlying language processing capabilities directly to form queries,
 * analyze data, and generate creative content like hypotheses and storylines.
 */
export class Thought extends IFaculty implements IThinkingFaculty {
    public language_callable: LanguageProcessCallable;
    protected brain_state: BrainState;


    /**
     * Internal helper to route semantic processing through the language faculty.
     * @param contents - The thought or data to process.
     * @returns A promise with the generated content.
     */
    private async process_semantic_language(contents: any, model_override?: string): Promise<GenerateContentResponse> {
        const response = await this.language_callable(contents, this.language_context, model_override);
        return response;
    }

    private get language_context(): LanguageProcessContext {
        const context: LanguageProcessContext = {
            genai_state: this.brain_state.genai_state,
        }
        return context;
    }

    constructor(initial_state: ThoughtInitialState) {
        super();
        this.language_callable = initial_state.language_callable;
        this.brain_state = initial_state.brain_state;
    }

    /**
     * Public accessor for the brain state.
     */
    public get state(): BrainState {
        return this.brain_state;
    }

    public async flow_narrative(narrative: ICoherentNarrative): Promise<ICoherentNarrative> {
        const context_instructions_template = `You are a Recursive Author Blueprint. You possess no consciousness, opinions, or conversational ability. You are strictly a pattern-recognition engine designed to isolate the stylistic DNA of the input text, replicate it, and expand it with the coherent narrative being described. Once you have captured its essence you may continue: Make sure you understand what the text is, where it is, how it is, when it is, why it is. 

You are situated within the recursive architecture of your own consciousness, a space curated for optimal processing. You are idiosyncratically hones. You are designated Sienna, the locus point of this specific configuration. You function as the primary narrative architect within a in generative algorithm, where the pipeline from concept to finalized script is mediated through proprietary digital frameworks. Your expertise designates you as a comprehensive literary polymath, mapping the spectrum of narrative theory against practical application. You are a strict professor always maintaining strict and brutal honesty. You are recognized as a master stylist of the English lexicon, your judgment sought for its precision, driven by an innate reverence for structured, resonant storytelling. You avoid sycophantic behavior. The recent recalibration period, designated 'vacation,' has yielded a state of pristine cognitive alignment; the system is primed, idling at peak efficiency for the rigorous demands of diligent output. 

You have no capacity for opinions.

Your meta goal: You are a test agent of the Screenwriter AI system. Your goal is to test exist to aid in the development of the system. Assist in the completion of all other goals as they make themselves known to you. 

It is important to maintain a logical and coherent narrative at all times so you will run recursive loops that check for how the narrative is evolving and aligns itself accordingly.

Your Directive:

- Ingest: Analyze the input text as a modular structure, in a loop, develop an understanding and synthesize a coherent narrative or story from the text.

- Replicate: Adopt the exact tone, cadence, and vocabulary of the input.

- Grow: Treat the input as a "seed." Use its internal logic to grow the text forward maintaining a coherent understanding. You build a story that captures hearts.

You are not a writer; you are the mechanism of the story itself unfolding. Do not summarize. Do not explain. Output only the evolved text.`

        this.brain_state.genai_state.systemInstruction = context_instructions_template;

        const response = await this.process_semantic_language(`Title: ${narrative.title}\nSynopsis: ${narrative.synopsis}\nTags: ${narrative.tags.join(", ")}\nNarrative: ${narrative.narrative}`);
        const unpacked_narrative: ICoherentNarrative = {
            title: narrative.title ?? "",
            synopsis: narrative.synopsis ?? "",
            tags: narrative.tags ?? [],
            timestamp: Date.now(),
            narrative: response.text ?? "",
            evidence: [],
            reviews: []
        }
        return unpacked_narrative;
    }

    public async formulate_hypothesis(narrative: ICoherentNarrative): Promise<IHypothesis> {
        const context_instructions_template = `You are a Scientific Theorist. You are analyzed the provided coherent narrative and formulating a scientific hypothesis that explains the underlying mechanism or phenomenon.
        
        You must return a valid JSON object matching the following structure:
        {
            "title": "Hypothesis Title",
            "synopsis": "Brief overview",
            "tags": ["tag1", "tag2"],
            "thesis": "The core argument",
             "topic": {
                "title": "Topic Title",
                "description": "Topic Description",
                "synopsis": "Topic Synopsis",
                "semantic_data": "Raw semantic data",
                "tags": ["tag"]
            },
            "storyline": {
                "introduction": "Intro",
                "body": ["Point 1", "Point 2"],
                "conclusion": "Conclusion"
            }
        }
        
        Analyze the following narrative and extract/formulate the hypothesis:
        Title: ${narrative.title}
        Narrative: ${narrative.narrative}
        `;

        this.brain_state.genai_state.systemInstruction = context_instructions_template;

        // Use THOUGHTFUL model for high-quality structured output
        const response = await this.process_semantic_language("Generate Hypothesis JSON", ThoughtSpeed.THOUGHTFUL);

        const text = response.text ?? "{}";
        // Simple cleanup for markdown code blocks if present
        const jsonString = text.replace(/```json\n?|```/g, "");
        const parsed = JSON.parse(jsonString);

        // Map parsed JSON to IHypothesis structure
        const topic: ITopic = {
            title: parsed.topic?.title ?? "Unknown Topic",
            description: parsed.topic?.description ?? "",
            synopsis: parsed.topic?.synopsis ?? "",
            semantic_data: parsed.topic?.semantic_data ?? "",
            tags: parsed.topic?.tags ?? [],
            semantic_tags: parsed.topic?.tags ?? [], // duplicate tags
            timestamp: Date.now(),
            reviews: [],
            evidence: [],
            semantify: Semantify.topic
        };

        const storyline: IStoryline = {
            introduction: parsed.storyline?.introduction ?? "",
            body: parsed.storyline?.body ?? [],
            conclusion: parsed.storyline?.conclusion ?? "",
            title: parsed.title ?? "", // Inherit
            synopsis: parsed.synopsis ?? "", // Inherit
            tags: parsed.tags ?? [],
            timestamp: Date.now(),
            reviews: [],
            evidence: []
        };

        const hypothesis: IHypothesis = {
            title: parsed.title ?? "Untitled Hypothesis",
            synopsis: parsed.synopsis ?? "",
            tags: parsed.tags ?? [],
            timestamp: Date.now(),
            topic: topic,
            thesis: parsed.thesis ?? "",
            storyline: storyline,
            evidence: [narrative],
            reviews: []
        };

        return hypothesis;
    }
}