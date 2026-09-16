import { type AnalyticsBucket, type AnalyticsResponse, type ApiKeyResourcePolicy, type ConsoleFeatureId, type PartnerCurrencySettings, ReferralCodeScope, type ReferralCodeUse, type TeamRole } from "@minmo/core";
import type { HttpClient } from "./http";
export declare enum ApiKeyInvalidReason {
    MANUALLY_REVOKED = "manually-revoked",
    EXPIRED = "expired"
}
export { ReferralCodeScope } from "@minmo/core";
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
    allowedUses: ReferralCodeUse[];
    isActive: boolean;
    usageCount: number;
    createdAt: string;
}
export interface ConfigureReferralCodeInput {
    allowedUses: ReferralCodeUse[];
}
export interface ListReferralCodesOptions {
    includeRevoked?: boolean;
}
export interface AnalyticsOptions {
    bucket?: AnalyticsBucket;
    feature?: ConsoleFeatureId;
}
interface PartnerDetailResponse {
    team: Account;
    members: Member[];
    invitations: Invitation[];
    apiKeys: ApiKey[];
}
export type PartnerDetailReader = () => Promise<PartnerDetailResponse>;
export interface CommandResult {
    ok: true;
}
/**
 * Coalesces concurrent projections of the aggregate Partner-management read.
 * The API exposes account, member, invitation, and API-key metadata from one
 * endpoint, while the SDK keeps those concepts in focused clients.
 */
export declare function createPartnerDetailReader(http: HttpClient, partnerId: string): PartnerDetailReader;
export declare class AccountClient {
    private readonly http;
    private readonly partnerId;
    private readonly readDetail;
    constructor(http: HttpClient, partnerId: string, readDetail?: PartnerDetailReader);
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
    get(options?: AnalyticsOptions): Promise<AnalyticsResponse>;
}
export declare class MembersClient {
    private readonly http;
    private readonly partnerId;
    private readonly readDetail;
    constructor(http: HttpClient, partnerId: string, readDetail?: PartnerDetailReader);
    list(): Promise<Member[]>;
    add(input: AddMemberInput): Promise<Member[]>;
    updateRoles(memberId: string, input: UpdateMemberRolesInput): Promise<Member[]>;
    remove(memberId: string): Promise<Member[]>;
}
export declare class InvitationsClient {
    private readonly http;
    private readonly partnerId;
    private readonly readDetail;
    constructor(http: HttpClient, partnerId: string, readDetail?: PartnerDetailReader);
    list(): Promise<Invitation[]>;
    create(input: CreateInvitationInput): Promise<CommandResult>;
}
export declare class ApiKeysClient {
    private readonly http;
    private readonly partnerId;
    private readonly readDetail;
    constructor(http: HttpClient, partnerId: string, readDetail?: PartnerDetailReader);
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
    list(options?: ListReferralCodesOptions): Promise<ReferralCode[]>;
    create(input: ConfigureReferralCodeInput): Promise<ReferralCode>;
    revoke(referralCodeId: string): Promise<void>;
    update(input: ConfigureReferralCodeInput): Promise<ReferralCode>;
    rotate(input?: ConfigureReferralCodeInput): Promise<ReferralCode>;
}
//# sourceMappingURL=partner.d.ts.map