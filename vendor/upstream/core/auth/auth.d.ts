import { type TeamRole, type UserRole, type Role, type Permission } from "./permissions";
/**
 * JWT payload structure for authentication tokens
 */
export interface JwtPayload {
    sub: string;
    email: string;
    email_verified?: boolean;
    given_name?: string;
    family_name?: string;
    preferred_username?: string;
    name?: string;
    permissions?: string[];
    roles?: Role[];
    subLocal?: string;
    sub_local?: string;
    canonicalPubkey?: string;
    canonical_pubkey?: string;
    npub?: string;
    sessionLevel?: "wrapper" | "nostr_proven" | "custodial";
    session_level?: "wrapper" | "nostr_proven" | "custodial";
    iat?: number;
    exp?: number;
    aud?: string;
    iss?: string;
}
/**
 * Authenticated user interface extending JWT payload
 *
 * This interface represents a user who has been authenticated through wrapper
 * JWT tokens. It includes additive team and user roles assigned by the
 * canonical Minmo role source.
 */
export interface AuthenticatedUser extends JwtPayload {
    authMethod: "jwt";
    roles: Role[];
    teamRoles: TeamRole[];
    userRoles: UserRole[];
    permissions?: Permission[];
    id: string;
    subLocal?: string;
    canonicalPubkey?: string;
    npub?: string;
    sessionLevel?: "wrapper" | "nostr_proven" | "custodial";
    hasTeamRole(role: TeamRole): boolean;
    hasRole(role: UserRole): boolean;
    hasAnyRole(...roles: Role[]): boolean;
}
/**
 * Create a user authentication object with proper role differentiation
 *
 * @param payload - JWT payload or user data
 * @param options - Additional authentication options
 * @returns Properly formatted AuthenticatedUser object
 */
export declare function createAuthenticatedUser(payload: Partial<AuthenticatedUser> & {
    id: string;
    authMethod: "jwt";
}): AuthenticatedUser;
//# sourceMappingURL=auth.d.ts.map