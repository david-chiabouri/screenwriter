import type { IHypothesis, ITopic } from "@siena-thought";

// local
import type { AbstractSemanticState, SemanticMetadata, IAbstractSemanticData, IContexedSemanticData, ISemanticGoal, ISemanticMetaGoal } from "./semantic-state";

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
        return Semantify.abstract(data);
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
