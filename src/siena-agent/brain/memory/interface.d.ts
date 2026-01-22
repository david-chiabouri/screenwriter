import type { Faculty } from "@/siena-agent/lib/primitives";
import type { IHypothesis, ICoherentNarrative, ITopic } from "@siena-thought";
import type { LanguageFaculty } from "@siena-language";

export interface IMemoryFaculty extends Faculty {
    language_faculty: LanguageFaculty;
    saveHypothesis(hypothesis: IHypothesis): Promise<void>;
    saveNarrative(narrative: ICoherentNarrative): Promise<void>;
    saveTopic(topic: ITopic): Promise<void>;
}
