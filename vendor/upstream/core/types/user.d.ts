import type { UserRole } from "../auth/permissions";
import type { AgentTeamAssociation } from "./agent";
export declare enum UserStatus {
    PENDING = "pending",
    ACTIVE = "active",
    SUSPENDED = "suspended"
}
export declare const UserAuthType: {
    readonly HEXCLAVE: "hexclave";
    readonly NOSTR: "nostr";
};
export type UserAuthType = (typeof UserAuthType)[keyof typeof UserAuthType];
export declare enum UserSortField {
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    EMAIL = "email",
    ID = "id"
}
export type UserSortOrder = "ASC" | "DESC";
export declare const USER_SORT_FIELDS: UserSortField[];
export interface UserTeamMembership {
    teamId: string;
    displayName: string;
    roles: string[];
}
export interface User {
    id: string;
    email: string | null;
    wrapperSubject: string;
    status: UserStatus;
    metadata?: Record<string, string | number | boolean | null>;
    createdAt: Date;
    updatedAt: Date;
    /** NOSTR public key (hex). Canonical pubkey once linked or generated. */
    nostrPublicKey?: string | null;
    canonicalPubkey?: string | null;
    canonical_pubkey?: string | null;
    npub?: string | null;
    /** Roles for NOSTR users backed by the local database. */
    roles?: string[];
    /** Hexclave teams this user belongs to, with team-scoped Minmo roles. */
    teams?: UserTeamMembership[];
}
export interface CreateUserData {
    email?: string | null;
    wrapperSubject: string;
    status?: UserStatus;
    metadata?: Record<string, string | number | boolean | null>;
    /** NOSTR public key (hex). When set, user is NOSTR-authenticated; wrapperSubject should be "nostr:" + hex. */
    nostrPublicKey?: string | null;
    /** Roles for NOSTR users stored in the local database. */
    roles?: string[];
}
export interface UpdateUserData {
    email?: string | null;
    status?: UserStatus;
    metadata?: Record<string, string | number | boolean | null>;
    roles?: string[];
}
export interface UserSearchResult {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export interface UserSearchParams {
    userId?: string;
    userIds?: string[];
    email?: string;
    wrapperSubject?: string;
    status?: UserStatus;
    role?: UserRole;
    teamId?: string;
    authType?: UserAuthType;
    page: number;
    limit: number;
    sortBy: UserSortField;
    sortOrder: UserSortOrder;
}
/**
 * User info returned by auth endpoints - extends core User with frontend-specific fields
 */
export interface AuthUserResponse {
    id: string;
    email: string | null;
    wrapperSubject?: string;
    subLocal?: string;
    sub_local?: string;
    canonicalPubkey?: string | null;
    canonical_pubkey?: string | null;
    npub?: string | null;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    status?: UserStatus;
    realm_roles?: string[];
    roles?: string[];
    teams?: UserTeamMembership[];
    agent?: {
        id: string;
        status?: string;
        teamAssociation?: AgentTeamAssociation | null;
    };
    metadata?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
}
/**
 * Login/Register response
 */
export interface AuthResponse {
    user: AuthUserResponse;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: number;
    agent?: {
        id: string;
        status?: string;
        teamAssociation?: AgentTeamAssociation | null;
    } | null;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
}
/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
    tokenExpiry?: number;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
}
//# sourceMappingURL=user.d.ts.map