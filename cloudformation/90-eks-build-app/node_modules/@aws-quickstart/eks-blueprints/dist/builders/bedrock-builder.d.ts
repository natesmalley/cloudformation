import { BlueprintBuilder } from '../stacks';
import * as teams from '../teams';
export declare class BedrockBuilder extends BlueprintBuilder {
    addBedrockTeam(props: teams.BedrockTeamProps): this;
    /**
     * This method helps you prepare a blueprint for setting up EKS cluster with
     * usage tracking addon
     */
    static builder(): BedrockBuilder;
}
