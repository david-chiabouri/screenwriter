import type { BrainStatePlan } from "../brain";
import type { IHypothesis, ITopic, IReviewable } from "../thought";

export class Semantify {


    public static abstractState(abstract: AbstractSemanticState, metadata?: SemanticMetadata): string {
        const injected_goal_template = `Please review the relevant metadata and the what, where, why, and how of the following abstract semantic state and return a detailed semantic description of the what, where, why, and how.`;
        const metadata_template = metadata ? Semantify.metadata(metadata) : "";
        const abstract_template = `\n\nWhat: ${abstract.what}\nWhere: ${abstract.where}\nWhy: ${abstract.why}\nHow: ${abstract.how}\n\n`;
        return injected_goal_template + metadata_template + abstract_template + "Please return the detailed semantic description.";
    }

    public static metadata(data: SemanticMetadata): string {
        const timestamp = data.timestamp;
        const title = data.title;
        const description = data.description ?? "No description provided.";
        const semantic_data: string = data.semantic_data;
        const semantic_data_type: string = typeof semantic_data;
        const semantic_tags = data.semantic_tags.join(", ");

        const data_template = `This is contexted semantic data of the type "${semantic_data_type}" with the following properties: 
        Title: ${title}
        Description: ${description}
        Timestamp: ${timestamp}

        The data has the following semantic tags: ${semantic_tags}

        RAW DATA: \`\`\`${JSON.stringify(semantic_data)}\`\`\`
        `
        return data_template;
    }

    public static abstract<T>(data: IAbstractSemanticData<T>): string {
        const timestamp = data.timestamp;
        const title = data.title;
        const description = data.description ?? "No description provided.";
        const semantic_data: T = data.semantic_data;
        const semantic_data_type: string = typeof semantic_data;
        const semantic_tags = data.semantic_tags.join(", ");
        return data.semantify(data);
    }

    public static standard<T>(data: IAbstractSemanticData<T>): string {
        return data.semantify(data);
    }

    public static contexed<T>(data: IContexedSemanticData<T>): string {
        const timestamp = data.timestamp;
        const title = data.title;
        const description = data.description ?? "No description provided.";
        const semantic_data: T = data.semantic_data;
        const semantic_data_type: string = typeof semantic_data;
        const semantic_tags = data.semantic_tags.join(", ");
        const context_data = data.context;

        const data_template = `This is contexted semantic data of the type "${semantic_data_type}" with the following properties: 
        Title: ${title}
        Description: ${description}
        Timestamp: ${timestamp}

        The data has the following semantic tags: ${semantic_tags}

        RAW DATA: \`\`\`${JSON.stringify(semantic_data)}\`\`\`
        `

        const goal_template = `You are trying to achieve the following goals: ${context_data.goals?.map(goal => goal.semantify).join(", ")}.`
        const metagoal_semantify = Semantify.goal(context_data.metagoal);
        const context_template = `You are currently processing the above data. ${goal_template} Under the unified narritive of the metagoal: ${metagoal_semantify}.`
        return `Context: ${context_template}\nData: ${data_template}\n`;
    }

    public static goal(data: ISemanticGoal | ISemanticMetaGoal): string {
        const goal_template = ` `;
        return goal_template;
    }

    public static hypothesis(data: IHypothesis): string {
        const hypothesis_template = ` `;
        return hypothesis_template;
    }

    public static topic(data: ITopic): string {
        const topic_template = ` `;
        return topic_template;
    }

}


/**
 * Base interface for data objects managed by the agent.
 * @template T - The type of the semantic data carried by this object.
 */
export interface IAbstractSemanticData<T> {
    /** The title of the data item. */
    title: string;
    /** Optional detailed description. */
    description?: string;



    /** The actual semantic payload. */
    semantic_data: T;
    /** Tags for categorization and retrieval. */
    semantic_tags: string[];


    /** Creation or modification timestamp. */
    timestamp: number;

    semantify(data: IAbstractSemanticData<T>): string; // a function that returns a string representation of the semantic data to be used for the Thought process.
}


/**
 * Extended interface for agent data that includes context and goals.
 * Represents a piece of information placed within a specific semantic context.
 * @template T - The type of the semantic data.
 */
export interface IContexedSemanticData<T> extends IAbstractSemanticData<T> {
    /** The context in which this data is relevant. */
    context: {
        /** A string description of the semantic context. */
        semantic_representation: string;
        /** The metagoal associated with this piece of data. */
        metagoal: ISemanticMetaGoal;
        /** Goals associated with this piece of data. */
        goals?: ISemanticGoal[];
    };
}
/**
 * Defined structure for the abstract semantic state.
 * These four questions help ground the agent's current thought process.
 */
export type AbstractSemanticState = {
    /** What is the agent currently thinking about? e.g., "Chess move generation" */
    what: string;
    /** Where is the agent's focus within the larger context? e.g., "Move validation module" */
    where: string;
    /** Why is the agent thinking about this? e.g., "To ensure legal moves only" */
    why: string;
    /** How is the agent approaching the problem? e.g., "Using bitboard operations" */
    how: string;
}



/**
 * Interface representing a specific goal derived from the semantic state.
 * Goals drive the agent's planning and actions.
 */
export interface ISemanticGoal extends IContexedSemanticData<string>, ISemanticMetaGoal {
    /** The priority or importance of this goal (0.0 to 1.0). */
    salience: number;
}

export interface ISemanticMetaGoal {
    /** A detailed description of the goal. */
    detailed: string;
    /** The abstract justification for this goal (what/where/why/how). */
    abstract: AbstractSemanticState;
}



/**
 * The core state object representing the agent's "mind".
 * It is divided into Past, Current, and Future contexts to model temporal awareness.
 */
export type ISemanticState = {
    /** The timestamp of the current state snapshot. */
    timestamp: number;

    /** 
     * The agent's memory of past events. 
     * Note: This is an abstract or compressed representation, not a perfect log.
     */
    past: {
        /** Abstract summary of past events. */
        abstract: string;
        /** Key thoughts or realizations from the past. */
        keythoughts: string;
        /** The most accurate working hypothesis derived so far. */
        most_accurate_hypothesis?: IHypothesis;
        /** Topics identified as important in the past. */
        most_important_topics: ITopic[];
        /** Goals that were significant in the past. */
        most_important_goals: ISemanticGoal[];
    },

    /** 
     * The agent's current focus and active working memory.
     */
    current: {
        /** The current abstract state (the 4 Ws). */
        abstract: AbstractSemanticState;
        /** Active goals, typically ordered by salience (highest first). */
        goals: ISemanticGoal[];
        /** The best plans currently formulated to achieve the active goals. */
        best_plans: BrainStatePlan[];
    },

    /** 
     * The agent's projections and desires for the future.
     */
    future: {
        /** Topics the agent wants to explore next. */
        interesting_topics?: {
            topic: ITopic;
            salience: number;
        }[];
        /** A hypothesis the agent wishes slightly different. */
        I_wish_proposed_this_hypothesis?: IHypothesis;
        /** A goal the agent wishes it had set. */
        I_wish_I_set_this_goal?: ISemanticGoal;
        /** A specific topic the agent wants to deep dive into. */
        I_want_to_explore_this_topic?: ITopic;
        /** Items that need review or reconsideration. */
        These_things_need_to_be_reviewed?: [IReviewable][];
    }

}

export type SemanticMetadata = {
    title: string;
    description?: string;
    semantic_data: string;
    semantic_tags: string[];
    timestamp: number;
}




/**
 * Factory class for creating and initializing SemanticState objects.
 */
export class SemanticStateFactory {


    private static generateFutureState(): {
        interesting_topics: {
            topic: ITopic;
            salience: number;
        }[]; // topics to explore,
        I_wish_proposed_this_hypothesis?: IHypothesis;
        I_wish_I_set_this_goal?: ISemanticGoal;
        I_want_to_explore_this_topic?: ITopic;
        These_things_need_to_be_reviewed?: [IReviewable][];
    } {
        return {
            interesting_topics: [],
            I_wish_proposed_this_hypothesis: undefined,
            I_wish_I_set_this_goal: undefined,
            I_want_to_explore_this_topic: undefined,
            These_things_need_to_be_reviewed: [],
        }
    }



    private static semanticStringFromAbstractState(abstract_state: AbstractSemanticState): string {
        const { what, where, why, how } = abstract_state;
        return `What: ${what}, Where: ${where}, Why: ${why}, How: ${how}`;
    }

    /**
     * Creates a new ISemanticState, optionally hydrating it with partial data.
     * This is useful for initializing the agent's memory or restoring state.
     * @param hydratable - A partial state object to overlay onto the default blank state.
     * @returns A fully initialized ISemanticState object.
     */
    public static blank(hydratable: Partial<ISemanticState> = {}): ISemanticState {

        const topic_hydratable: ITopic = hydratable.past?.most_accurate_hypothesis?.topic ?? {
            title: hydratable.past?.most_accurate_hypothesis?.topic?.title ?? "",
            semantic_data: hydratable.past?.most_accurate_hypothesis?.topic?.semantic_data ?? "",
            semantic_tags: hydratable.past?.most_accurate_hypothesis?.topic?.semantic_tags ?? [],
            timestamp: hydratable.past?.most_accurate_hypothesis?.topic?.timestamp ?? 0,
            description: hydratable.past?.most_accurate_hypothesis?.topic?.description ?? "",
            reviews: hydratable.past?.most_accurate_hypothesis?.topic?.reviews ?? [],
            semantify: Semantify.topic,
        };
        const storyline_hydratable = hydratable.past?.most_accurate_hypothesis?.storyline ?? {
            title: hydratable.past?.most_accurate_hypothesis?.storyline?.title ?? "",
            synopsis: hydratable.past?.most_accurate_hypothesis?.storyline?.synopsis ?? "",
            tags: hydratable.past?.most_accurate_hypothesis?.storyline?.tags ?? [],
            introduction: hydratable.past?.most_accurate_hypothesis?.storyline?.introduction ?? "",
            body: hydratable.past?.most_accurate_hypothesis?.storyline?.body ?? [],
            conclusion: hydratable.past?.most_accurate_hypothesis?.storyline?.conclusion ?? ""
        };
        const hypothesis_hydratable: IHypothesis = hydratable.past?.most_accurate_hypothesis ?? {
            topic: topic_hydratable,
            thesis: hydratable.past?.most_accurate_hypothesis?.thesis ?? "",
            storyline: storyline_hydratable,
            reviews: hydratable.past?.most_accurate_hypothesis?.reviews ?? [],

        };


        return {
            timestamp: Date.now(),
            past: {
                abstract: hydratable.past?.abstract ?? "",
                keythoughts: hydratable.past?.keythoughts ?? "",
                most_accurate_hypothesis: hypothesis_hydratable,
                most_important_topics: hydratable.past?.most_important_topics ?? [],
                most_important_goals: hydratable.past?.most_important_goals ?? []
            },
            current: {
                abstract: hydratable.current?.abstract ?? {
                    what: hydratable.current?.abstract?.what ?? "",
                    where: hydratable.current?.abstract?.where ?? "",
                    why: hydratable.current?.abstract?.why ?? "",
                    how: hydratable.current?.abstract?.how ?? ""
                },
                goals: hydratable.current?.goals ?? [],
                best_plans: hydratable.current?.best_plans ?? []
            },
            future: {
                interesting_topics: hydratable.future?.interesting_topics ?? [],
            }
        }
    }

    public static newAbstractState(what: string, where: string, why: string, how: string): AbstractSemanticState {
        return {
            what: what,
            where: where,
            why: why,
            how: how
        }
    }

    public static newContextedSemanticData<T>(constructor: {
        title: string;
        semantic_data: T;
        semantic_tags: string[];
        context: {
            semantic_representation: string;
            metagoal: ISemanticMetaGoal;
            goals?: ISemanticGoal[];
        }
    }): IContexedSemanticData<T> {
        return {
            title: constructor.title,
            semantic_data: constructor.semantic_data,
            semantic_tags: constructor.semantic_tags,
            timestamp: Date.now(),
            context: constructor.context,
            semantify: Semantify.contexed<T>
        }
    }

}