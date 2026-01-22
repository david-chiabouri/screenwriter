
// namespace
import type { IAbstractSemanticData } from "@siena-language-semantics/semantic-state";
import type { Faculty } from "@siena-lib/primitives";
import type { LanguageProcessCallable } from "@siena-language";
// local
import type { ReviewResult } from "./type.d.ts";

/**
 * Interface for any agent data that can be subject to review.
 */
export interface IReviewable {
    title: string;
    synopsis: string;
    tags: string[];
    timestamp: number;
    /** A collection of reviews attached to this item. */
    reviews: ReviewResult[];
    /** Optional evidence supporting the item's validity. */
    evidence?: any;
}

/**
 * Represents a specific subject or area of interest for the agent.
 * Topics are the building blocks of the agent's knowledge graph.
 */
export interface ITopic extends IAbstractSemanticData<string>, IReviewable {
    title: string;
    description: string;
    synopsis: string;
    semantic_data: string;
    semantic_tags: string[];
    timestamp: number;

    reviews: ReviewResult[];
    evidence: ICoherentNarrative[];
}

export interface IStoryline extends IReviewable {


    // The concrete screenplay output components
    introduction: string;
    body: string[];
    conclusion: string;


}

export interface ICoherentNarrative extends IReviewable {
    title: string;
    synopsis: string;
    narrative: string;

    tags: string[];

    timestamp: number;

    reviews: ReviewResult[];
    evidence?: ICoherentNarrative[];
}

/**
 * Represents a working hypothesis or potential narrative structure.
 * This is where the agent formulates its creative ideas.
 */
export interface IHypothesis extends IReviewable {
    title: string;
    synopsis: string;
    tags: string[];
    timestamp: number;
    /** The central topic this hypothesis addresses. */
    topic: ITopic;
    /** The core argument or premise of the hypothesis. */
    thesis: string;
    /** The narrative structure developed from the thesis. */
    storyline: IStoryline;

    evidence: ICoherentNarrative[];
}



/**
 * Interface for the thinking faculty, which coordinates language generation for cognitive tasks.
 */
export interface IThinkingFaculty extends Faculty {
    /** A callable to process content through the language faculty. */
    language_callable: LanguageProcessCallable;
}

