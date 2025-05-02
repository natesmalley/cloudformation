import { ClusterInfo } from "../../spi";
import { ApplicationTeam, TeamProps } from "../team";
/**
 * Interface to define a GenAI on EKS team
 */
export interface BedrockTeamProps extends TeamProps {
    /**
     * Name of the service account namespace.
     */
    namespace?: string;
    /**
     * Create Namespace with the provided one.
     */
    createNamespace?: boolean;
    /**
     * Name of the service account for Bedrock.
     */
    serviceAccountName?: string;
}
export declare class BedrockTeam extends ApplicationTeam {
    private bedrockTeam;
    /**
     * @public
     * @param {BedrockTeamProps} props the Bedrock team definition {@link BedrockTeamProps}
     */
    constructor(props: BedrockTeamProps);
    protected setupServiceAccount(clusterInfo: ClusterInfo): void;
}
