// std
import * as fs from "fs/promises";
import * as path from "path";

// namespace
import type { BrainState } from "@siena-brain";
import type { ICoherentNarrative, IHypothesis, ITopic } from "@siena-thought";
import { type LanguageFaculty } from "@siena-language";
import type { IAbstractSemanticData } from "@siena-language-semantics/semantic-state";
import { Faculty } from "@siena-lib/primitives";

// local
import type { IMemoryFaculty } from "./interface.d.ts";
import type { MemoryInitialState } from "./type.d.ts";


/**
 * TODO: Implement vector database and solidfy definitions regarding embeddings and string data. We will store both. The vector embeddings will be used to search for data to load effectivly and cheaply. So we will hold a vector embeddings of the tags or other crucial identifying data and store that in the DB to index and load. We can also implement a psuedo "short term" memory which just uses google's GenAI embedding methods for search.
 */
export class Memory extends Faculty implements IMemoryFaculty {
    public brain_state: BrainState;
    public language_faculty: LanguageFaculty;
    private baseDir: string;

    /**
     * @param initial_state - The initial configuration for the Memory faculty.
     */
    constructor(initial_state: MemoryInitialState) {
        super();
        this.language_faculty = initial_state.language_faculty;
        this.brain_state = initial_state.brain_state;
        this.baseDir = initial_state.baseDir ?? "save/memory";
    }

    public override get state(): BrainState {
        return this.brain_state;
    }

    private async load() {
        // TODO: implement a loading function for the json
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

    /**
     * Persists a generated hypothesis to the file system.
     */
    public async saveHypothesis(hypothesis: IHypothesis): Promise<void> {
        await this.save(hypothesis, "hypothesis");
    }

    /**
     * Persists a coherent narrative to the file system.
     */
    public async saveNarrative(narrative: ICoherentNarrative): Promise<void> {
        await this.save(narrative, "narrative");
    }

    /**
     * Persists a generated topic to the file system.
     */
    public async saveTopic(topic: ITopic): Promise<void> {
        await this.save(topic, "topic");
    }
}