/**
 * Role parsing utilities for wrapper auth and local user records.
 *
 * Hexclave can assign multiple team roles to a user. Minmo treats those roles
 * as additive and only selects a primary role for compatibility UI.
 */
import { type AuthUserResponse } from "../types";
import { TeamRole, UserRole, type Role } from "./permissions";
/**
 * Extract user roles from wrapper-auth realm_roles.
 */
export declare function extractUserRolesFromRealm(realmRoles: string[]): UserRole[];
/**
 * Extract all roles from a user's wrapper-auth data.
 */
export declare function extractAllRoles(user: AuthUserResponse | null): {
    teamRoles: TeamRole[];
    userRoles: UserRole[];
    allRoles: Role[];
};
/**
 * Determine the primary role for compatibility UI.
 *
 * Permissions are additive; this ordering only picks a label/dashboard branch
 * when the UI still expects a single role.
 */
export declare function getPrimaryRole(user: AuthUserResponse | null): Role | null;
/**
 * Check if user has a specific role.
 */
export declare function hasRole(user: AuthUserResponse | null, role: Role): boolean;
export declare function isAdmin(user: AuthUserResponse | null): boolean;
export declare function isTeamAdmin(user: AuthUserResponse | null): boolean;
export declare function isTeamMember(user: AuthUserResponse | null): boolean;
export declare function hasTeamRole(user: AuthUserResponse | null): boolean;
export declare function isPartner(user: AuthUserResponse | null): boolean;
export declare function isAgent(user: AuthUserResponse | null): boolean;
//# sourceMappingURL=role-utils.d.ts.map