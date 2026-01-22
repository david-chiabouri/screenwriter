export interface IMemoryFaculty extends IFaculty {
    language_faculty: Language;
    saveHypothesis(hypothesis: IHypothesis): Promise<void>;
    saveNarrative(narrative: ICoherentNarrative): Promise<void>;
    saveTopic(topic: ITopic): Promise<void>;
}
