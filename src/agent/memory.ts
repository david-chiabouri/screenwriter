import { IFaculty } from "./lib/primitive";
import type { BrainState } from "./brain";
import { Language } from "./language";
import type { IAbstractSemanticData } from "./semantics/semantic-state";
import type { ICoherentNarrative, IHypothesis, ITopic } from "./thought";
import * as fs from "fs/promises";
import * as path from "path";

export interface IMemoryFaculty extends IFaculty {
    language_faculty: Language;
    saveHypothesis(hypothesis: IHypothesis): Promise<void>;
    saveNarrative(narrative: ICoherentNarrative): Promise<void>;
    saveTopic(topic: ITopic): Promise<void>;
}

export type MemoryInitialState = {
    brain_state: BrainState;
    language_faculty: Language;
    baseDir?: string;
}

export class Memory extends IFaculty implements IMemoryFaculty {
    public brain_state: BrainState;
    public language_faculty: Language;
    private baseDir: string;

    constructor(initial_state: MemoryInitialState) {
        super();
        this.language_faculty = initial_state.language_faculty;
        this.brain_state = initial_state.brain_state;
        this.baseDir = initial_state.baseDir ?? "save/memory";
    }

    public override get state(): BrainState {
        return this.brain_state;
    }

    /**
     * generic save method to write data to disk.
     * @param data The data object to save.
     * @param type The type folder to save into (e.g., "hypothesis", "narrative").
     */
    private async save(data: IAbstractSemanticData<any> | ICoherentNarrative | IHypothesis, type: string): Promise<void> {
        const sanitizedTitle = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${sanitizedTitle}_${data.timestamp}.json`;
        const dirPath = path.join(this.baseDir, type);
        const filePath = path.join(dirPath, filename);

        try {
            await fs.mkdir(dirPath, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            console.log(`[Memory] Saved ${type}: ${filePath}`);
        } catch (error) {
            console.error(`[Memory] Failed to save ${type}:`, error);
            throw error;
        }
    }

    public async saveHypothesis(hypothesis: IHypothesis): Promise<void> {
        await this.save(hypothesis, "hypothesis");
    }

    public async saveNarrative(narrative: ICoherentNarrative): Promise<void> {
        await this.save(narrative, "narrative");
    }

    public async saveTopic(topic: ITopic): Promise<void> {
        await this.save(topic, "topic");
    }
}