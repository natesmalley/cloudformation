import { BlueprintBuilder } from '../stacks';
import * as addons from '../addons';
export declare class ObservabilityBuilder extends BlueprintBuilder {
    private awsLoadbalancerProps;
    private certManagerProps;
    private cloudWatchInsightsAddOnProps;
    private coreDnsProps;
    private coreDnsVersion;
    private kubeProxyProps;
    private kubeProxyVersion;
    private kubeStateMetricsProps;
    private metricsServerProps;
    private prometheusNodeExporterProps;
    private adotCollectorProps;
    private externalSecretProps;
    private grafanaOperatorProps;
    private ampProps;
    /**
     * This method helps you prepare a blueprint for setting up observability
     * returning an array of blueprint addons for AWS native services
     */
    enableNativePatternAddOns(): ObservabilityBuilder;
    /**
     * This method helps you prepare a blueprint for setting up observability
     * returning an array of blueprint addons for AWS Fargate services
     */
    enableFargatePatternAddOns(): ObservabilityBuilder;
    /**
     * This method helps you prepare a blueprint for setting up observability
     * returning an array of blueprint addons for combination of AWS native and
     * AWS managed open source services
     */
    enableMixedPatternAddOns(): ObservabilityBuilder;
    /**
     * This method helps you prepare a blueprint for setting up observability
     * returning an array of blueprint addons for AWS managed open source services
     */
    enableOpenSourcePatternAddOns(): ObservabilityBuilder;
    /**
     * Enables control plane logging.
     * Enabling control plane logging is an in-place change for EKS as inferred from
     * https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html
     *
     * @returns {ObservabilityBuilder} - The ObservabilityBuilder instance with control plane logging enabled.
     */
    enableControlPlaneLogging(): ObservabilityBuilder;
    withAwsLoadBalancerControllerProps(props: addons.AwsLoadBalancerControllerProps): this;
    withCertManagerProps(props: addons.CertManagerAddOnProps): this;
    withCloudWatchInsightsProps(props: addons.CloudWatchInsightsAddOnProps): this;
    withCoreDnsProps(props: addons.CoreDnsAddOnProps): this;
    withKubeProxyProps(props: addons.kubeProxyAddOnProps, version: string): this;
    withKubeStateMetricsProps(props: addons.KubeStateMetricsAddOnProps): this;
    withMetricsServerProps(props: addons.MetricsServerAddOnProps): this;
    withPrometheusNodeExporterProps(props: addons.PrometheusNodeExporterAddOnProps): this;
    withAdotCollectorProps(props: addons.AdotCollectorAddOnProps): this;
    withExternalSecretsProps(props: addons.ExternalDnsProps): this;
    withGrafanaOperatorProps(props: addons.GrafanaOperatorAddonProps): this;
    withAmpProps(props: addons.AmpAddOnProps): this;
    /**
     * This method helps you prepare a blueprint for setting up observability with
     * usage tracking addon
     */
    static builder(): ObservabilityBuilder;
}
