export declare const FALLBACK_AGENT_NAME = "Minmo Agent";
export type AgentDisplaySource = {
    user?: {
        email?: string | null;
        metadata?: {
            firstName?: string | null;
            lastName?: string | null;
        } | null;
    } | null;
} | null;
export declare function getAgentDisplayName(agent?: AgentDisplaySource): string;
export declare function getAgentInitial(agent?: AgentDisplaySource): string;
//# sourceMappingURL=agent-display.d.ts.map