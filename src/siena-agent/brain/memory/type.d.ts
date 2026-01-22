import type { BrainState } from "@siena-brain";
import type { LanguageFaculty } from "@siena-language";

export type MemoryInitialState = {
    brain_state: BrainState;
    language_faculty: LanguageFaculty;
    baseDir?: string;
}
