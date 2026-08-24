import { type AnalyticsBucket, type AnalyticsDashboardResponse, type ApiKeyResourcePolicy, type PartnerCurrencySettings, type TeamRole } from "@minmo/core";
import type { HttpClient } from "./http";
export declare enum ApiKeyInvalidReason {
    MANUALLY_REVOKED = "manually-revoked",
    EXPIRED = "expired"
}
export declare enum ReferralCodeScope {
    SYSTEM = "system",
    TEAM = "team"
}
export interface NostrIdentity {
    publicKey: string | null;
    npub: string | null;
    custodyMode: string | null;
    keyEncryptionKeyId: string | null;
}
export interface Account {
    id: string;
    displayName: string;
    profileImageUrl: string | null;
    createdAt: string | null;
    memberCount?: number;
    nostrIdentity?: NostrIdentity;
}
export interface UpdateAccountInput {
    displayName?: string;
}
export interface Member {
    /** Hexclave member identifier used by member mutation routes. */
    id: string;
    /** Corresponding Minmo user identifier used when adding an existing user. */
    localUserId: string;
    displayName: string | null;
    email: string | null;
    profileImageUrl: string | null;
    signedUpAt: string | null;
    teamProfile: {
        displayName: string | null;
        profileImageUrl: string | null;
    };
    roles: TeamRole[];
}
export interface AddMemberInput {
    localUserId: string;
}
export interface UpdateMemberRolesInput {
    roles: TeamRole[];
}
export interface Invitation {
    id: string;
    recipientEmail: string | null;
    expiresAt: string;
}
export interface CreateInvitationInput {
    email: string;
    callbackUrl: string;
}
export interface ApiKey {
    id: string;
    description: string;
    lastFour: string | null;
    createdAt: string | null;
    expiresAt: string | null;
    manuallyRevokedAt: string | null;
    valid: boolean;
    invalidReason: ApiKeyInvalidReason | null;
    policy: ApiKeyResourcePolicy | null;
}
export interface ApiKeyFirstView extends ApiKey {
    /** Secret value returned only when the key is first created. */
    value: string;
}
export interface CreateApiKeyInput {
    description: string;
    expiresAt?: string;
    isPublic?: boolean;
}
export interface ReferralCode {
    id: string;
    code: string;
    scope: ReferralCodeScope;
    teamId: string | null;
    isActive: boolean;
    usageCount: number;
    createdAt: string;
}
export interface AnalyticsOptions {
    bucket?: AnalyticsBucket;
}
export interface CommandResult {
    ok: true;
}
export declare class AccountClient {
    private readonly http;
    private readonly partnerId;
    constructor(http: HttpClient, partnerId: string);
    get(): Promise<Account>;
    update(input: UpdateAccountInput): Promise<Account>;
}
export declare class SettingsClient {
    private readonly http;
    private readonly partnerId;
    constructor(http: HttpClient, partnerId: string);
    get(): Promise<PartnerCurrencySettings>;
    update(input: PartnerCurrencySettings): Promise<PartnerCurrencySettings>;
}
export declare class AnalyticsClient {
    private readonly http;
    private readonly partnerId;
    constructor(http: HttpClient, partnerId: string);
    get(options?: AnalyticsOptions): Promise<AnalyticsDashboardResponse>;
}
export declare class MembersClient {
    private readonly http;
    private readonly partnerId;
    constructor(http: HttpClient, partnerId: string);
    list(): Promise<Member[]>;
    add(input: AddMemberInput): Promise<Member[]>;
    updateRoles(memberId: string, input: UpdateMemberRolesInput): Promise<Member[]>;
    remove(memberId: string): Promise<Member[]>;
}
export declare class InvitationsClient {
    private readonly http;
    private readonly partnerId;
    constructor(http: HttpClient, partnerId: string);
    list(): Promise<Invitation[]>;
    create(input: CreateInvitationInput): Promise<CommandResult>;
}
export declare class ApiKeysClient {
    private readonly http;
    private readonly partnerId;
    constructor(http: HttpClient, partnerId: string);
    list(): Promise<ApiKey[]>;
    create(input: CreateApiKeyInput): Promise<ApiKeyFirstView>;
    updatePolicy(apiKeyId: string, policy: ApiKeyResourcePolicy): Promise<ApiKey[]>;
    revoke(apiKeyId: string): Promise<ApiKey[]>;
}
export declare class ReferralsClient {
    private readonly http;
    private readonly partnerId;
    constructor(http: HttpClient, partnerId: string);
    get(): Promise<ReferralCode | null>;
    rotate(): Promise<ReferralCode>;
}
//# sourceMappingURL=partner.d.ts.map