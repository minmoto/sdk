/**
 * Team roles for the Minmo platform
 *
 * These roles are assigned to users through Hexclave team/RBAC membership.
 * Users can hold more than one team role; permissions are additive.
 *
 * @remarks
 * Team-based roles provide team-level access control:
 * - TEAM_ADMIN: Team administrators who manage team access and offerings
 * - TEAM_MEMBER: Team users who can access assigned team products
 *
 * @see {@link ROLE_PERMISSIONS} for detailed permission mappings
 */
export declare enum TeamRole {
    /** Team administrators with team access and offering management permissions */
    TEAM_ADMIN = "team_admin",
    /** Team members with access to their assigned teams and products */
    TEAM_MEMBER = "team_member"
}
/**
 * User roles for the Minmo platform
 *
 * These roles are assigned directly to individual users in Hexclave/Minmo.
 * Direct assignment allows for fine-grained per-user access control.
 *
 * @remarks
 * User-specific roles for individual access:
 * - MINMO_ADMIN: System administrators with global console access
 * - MINMO_PARTNER: Console access for Minmo partners
 * - MINMO_AGENT: Transaction and liquidity management
 *
 * @see {@link ROLE_PERMISSIONS} for detailed permission mappings
 */
export declare enum UserRole {
    /** Platform administrators with full console access and system management */
    MINMO_ADMIN = "minmo_admin",
    /** Minmo partners with console access */
    MINMO_PARTNER = "minmo_partner",
    /** Regular users who can become agents and manage their own transactions */
    MINMO_AGENT = "minmo_agent"
}
/**
 * Any role value that can contribute permissions.
 *
 * Do not use this union as a console admission check. Console admission is a
 * direct user-role decision (`MINMO_ADMIN` or `MINMO_PARTNER`); team roles
 * only apply after admission for team-scoped access.
 */
export type Role = TeamRole | UserRole;
/**
 * Type guard to check if a role is a TeamRole
 *
 * @param role - The role to check
 * @returns True if the role is a TeamRole, false otherwise
 */
export declare function isTeamRole(role: Role): role is TeamRole;
/**
 * Type guard to check if a role is a UserRole
 *
 * @param role - The role to check
 * @returns True if the role is a UserRole, false otherwise
 */
export declare function isUserRole(role: Role): role is UserRole;
/**
 * Get all permission-bearing roles.
 *
 * @returns Array containing all available roles
 */
export declare function getAllRoles(): Role[];
/**
 * Convert a string to a permission-bearing Role if valid.
 *
 * @param roleString - The string to convert
 * @returns The Role if valid, undefined otherwise
 */
export declare function toRole(roleString: string): Role | undefined;
/**
 * Granular permissions for the Minmo platform
 *
 * Permissions follow a namespace pattern: `resource:action`
 * - Resources: system, user, agent, swap, liquidity, partner, etc.
 * - Actions: read, write, create, delete, manage, etc.
 * - Scope modifiers: _own (own resources), _all (all resources)
 *
 * @remarks
 * Permissions are grouped into categories:
 * - System Operations: Platform-level administration (admin only)
 * - User Management: User account administration
 * - Agent Operations: Agent registration and management
 * - Transaction Operations: Swap transaction flows
 * - Financial Operations: Liquidity management
 * - Bitcoin Operations: Lightning Network wallet operations
 * - FX Operations: Exchange rate management
 * - Analytics: Reporting and metrics
 * - Partner Operations: Multi-tenant partner management
 *
 * @see {@link ROLE_PERMISSIONS} for role-to-permission mappings
 * @see {@link PERMISSION_GROUPS} for logical permission groupings
 */
export declare enum Permission {
    /** Configure system-wide settings including feature flags and platform parameters */
    SYSTEM_CONFIG = "system:config",
    /** Monitor system health, metrics, and performance indicators */
    SYSTEM_MONITOR = "system:monitor",
    /** Access audit logs, compliance reports, and security events */
    SYSTEM_AUDIT = "system:audit",
    /** Create new referral codes for agent activation */
    REFERRAL_CODE_CREATE = "referral_code:create",
    /** Read and list referral codes */
    REFERRAL_CODE_READ = "referral_code:read",
    /** Read user account information and profiles */
    USER_READ = "user:read",
    /** Create and update user accounts */
    USER_WRITE = "user:write",
    /** Delete user accounts */
    USER_DELETE = "user:delete",
    /** Assign and manage user roles (ADMIN, AGENT, PARTNER) */
    USER_MANAGE_ROLES = "user:manage_roles",
    /** Register as an agent and join the network */
    AGENT_REGISTER = "agent:register",
    /** Manage own agent profile, liquidity, and settings */
    AGENT_MANAGE_OWN = "agent:manage_own",
    /** Manage all agents in the system (admin only) */
    AGENT_MANAGE_ALL = "agent:manage_all",
    /** View all agents and their public information */
    AGENT_READ_ALL = "agent:read_all",
    /** Create new swap transactions (onramp/offramp) */
    SWAP_CREATE = "swap:create",
    /** Read own swap transaction history and details */
    SWAP_READ_OWN = "swap:read_own",
    /** Read all swap transactions across the platform */
    SWAP_READ_ALL = "swap:read_all",
    /** Approve disputed or pending swap transactions */
    SWAP_APPROVE = "swap:approve",
    /** Cancel own swap transactions */
    SWAP_CANCEL_OWN = "swap:cancel_own",
    /** Cancel any swap transaction in the system */
    SWAP_CANCEL_ALL = "swap:cancel_all",
    /** (Deprecated) Manage own liquidity pools and balances */
    LIQUIDITY_MANAGE_OWN = "liquidity:manage_own",
    /** (Deprecated) Manage all liquidity across the platform (admin only) */
    LIQUIDITY_MANAGE_ALL = "liquidity:manage_all",
    /**
     * Read liquidity / escrow information across agents.
     * Now primarily used for reading BTC escrow status derived from swaps.
     */
    LIQUIDITY_READ_ALL = "liquidity:read_all",
    /** View Lightning wallet balance and transaction history */
    BITCOIN_WALLET_READ = "bitcoin:wallet_read",
    /** Generate Lightning invoices to receive payments */
    BITCOIN_WALLET_RECEIVE = "bitcoin:wallet_receive",
    /** Send Bitcoin payments via Lightning Network */
    BITCOIN_WALLET_SEND = "bitcoin:wallet_send",
    /** Create custodial escrow records and funding references */
    ESCROW_CREATE = "escrow:create",
    /** Read team-scoped custodial escrow records */
    ESCROW_READ = "escrow:read",
    /** Verify custodial escrow funding status */
    ESCROW_VERIFY_FUNDING = "escrow:verify_funding",
    /** Expire an unfunded custodial escrow after its funding deadline */
    ESCROW_EXPIRE = "escrow:expire",
    /** Release funded custodial escrows */
    ESCROW_RELEASE = "escrow:release",
    /** Refund funded custodial escrows */
    ESCROW_REFUND = "escrow:refund",
    /** Record custodial escrow dispute decisions */
    ESCROW_RESOLVE_DISPUTE = "escrow:resolve_dispute",
    /** Publish public custodial escrow descriptors */
    ESCROW_DESCRIPTOR_PUBLISH = "escrow:descriptor_publish",
    /** Manage exchange rate sources and configurations */
    FX_RATES_MANAGE = "fx:rates_manage",
    /** Read current exchange rates and historical data */
    FX_RATES_READ = "fx:rates_read",
    /** Read own analytics, metrics, and performance reports */
    ANALYTICS_READ_OWN = "reports:read_own",
    /** Read all analytics across the entire platform */
    ANALYTICS_READ_ALL = "reports:read_all",
    /** Export analytics data in various formats (CSV, JSON, etc.) */
    ANALYTICS_EXPORT = "reports:export",
    /** View own partner organization details and configuration */
    PARTNER_READ_OWN = "partner:read_own",
    /** Update own partner organization settings and preferences */
    PARTNER_MANAGE_OWN = "partner:manage_own",
    /** View all partner organizations in the system (admin only) */
    PARTNER_READ_ALL = "partner:read_all",
    /** Manage all partner organizations including creation and deletion (admin only) */
    PARTNER_MANAGE_ALL = "partner:manage_all",
    /** Invite agents to join the partner network */
    PARTNER_AGENT_INVITE = "partner:agent_invite",
    /** Remove agents from the partner network */
    PARTNER_AGENT_REMOVE = "partner:agent_remove",
    /** View partner-agent relationship details */
    PARTNER_AGENT_READ = "partner:agent_read",
    /** Manage partner-agent relationships and permissions */
    PARTNER_AGENT_MANAGE = "partner:agent_manage",
    /** View all agents managed by this partner organization */
    PARTNER_AGENTS_READ = "partner:agents_read",
    /** View all swap transactions for agents in this partner network */
    PARTNER_SWAPS_READ = "partner:swaps_read",
    /** Manage swap transactions for agents in this partner network */
    PARTNER_SWAPS_MANAGE = "partner:swaps_manage",
    /** View liquidity information for agents in this partner network */
    PARTNER_LIQUIDITY_READ = "partner:liquidity_read",
    /** View metrics and analytics for this partner organization */
    PARTNER_METRICS_READ = "partner:metrics_read",
    /** Create new services (integrations, gateways) for this partner */
    PARTNER_SERVICES_CREATE = "partner:services_create",
    /** Update and configure existing partner services */
    PARTNER_SERVICES_MANAGE = "partner:services_manage",
    /** View all services configured for this partner */
    PARTNER_SERVICES_READ = "partner:services_read",
    /** Delete services from this partner organization */
    PARTNER_SERVICES_DELETE = "partner:services_delete",
    /** Create a Minmo Pay payment */
    PAY_PAYMENT_CREATE = "pay:payment_create",
    /** Read Minmo Pay payments and their normalized state */
    PAY_PAYMENT_READ = "pay:payment_read",
    /** Cancel an unfunded Minmo Pay payment */
    PAY_PAYMENT_CANCEL = "pay:payment_cancel",
    /** Subscribe to the Minmo Pay partner event stream */
    PAY_EVENT_SUBSCRIBE = "pay:event_subscribe",
    /** Read the Minmo Pay stores belonging to a team */
    PAY_STORE_READ = "pay:store_read",
    /** Provision and manage the BTCPay store bound to a team wallet */
    PAY_STORE_MANAGE = "pay:store_manage",
    /** Read PSP connections and their non-secret configuration */
    PSP_CONNECTION_READ = "psp:connection_read",
    /** Create, validate, and rotate PSP connections */
    PSP_CONNECTION_MANAGE = "psp:connection_manage",
    /** Initiate a collection through an authorized PSP connection */
    PSP_PAYMENT_CREATE = "psp:payment_create",
    /** Initiate a disbursement through an authorized PSP connection */
    PSP_DISBURSEMENT_CREATE = "psp:disbursement_create",
    /** Read normalized PSP payment state */
    PSP_PAYMENT_READ = "psp:payment_read",
    /** Read internal PSP accounts, attributable balances, and statements */
    PSP_ACCOUNT_READ = "psp:account_read",
    /** Subscribe to Partner-scoped PSP payment events */
    PSP_EVENT_SUBSCRIBE = "psp:event_subscribe",
    /** Read PSP reconciliation runs, items, and safe exception detail */
    PSP_RECONCILIATION_READ = "psp:reconciliation_read",
    /** Start a PSP transaction reconciliation run */
    PSP_RECONCILIATION_RUN = "psp:reconciliation_run",
    /** Resolve a PSP reconciliation exception with approved evidence */
    PSP_RECONCILIATION_RESOLVE = "psp:reconciliation_resolve",
    /** Read accounting Sources and saved reporting templates */
    ACCOUNTING_READ = "accounting:read",
    /** Create and delete saved reporting templates */
    ACCOUNTING_TEMPLATE_MANAGE = "accounting:template_manage",
    /** Generate bounded, uncertified reports for direct delivery */
    ACCOUNTING_EXPORT = "accounting:export"
}
/**
 * Permission groups organized by business domain/service scope.
 *
 * These groups provide convenient collections of related permissions for role
 * definitions and Hexclave-backed API key resource policies.
 *
 * @remarks
 * Permission groups are used to:
 * - Define role permissions in ROLE_PERMISSIONS
 * - Provide logical groupings for UI permission selectors
 */
export declare const PERMISSION_GROUPS: {
    readonly SYSTEM_OPERATIONS: readonly [Permission.SYSTEM_CONFIG, Permission.SYSTEM_MONITOR, Permission.SYSTEM_AUDIT];
    readonly REFERRAL_CODE_MANAGEMENT: readonly [Permission.REFERRAL_CODE_CREATE, Permission.REFERRAL_CODE_READ];
    readonly BITCOIN_OPERATIONS: readonly [Permission.BITCOIN_WALLET_READ, Permission.BITCOIN_WALLET_RECEIVE, Permission.BITCOIN_WALLET_SEND];
    readonly ESCROW_OPERATIONS: readonly [Permission.ESCROW_CREATE, Permission.ESCROW_READ, Permission.ESCROW_VERIFY_FUNDING, Permission.ESCROW_EXPIRE, Permission.ESCROW_RELEASE, Permission.ESCROW_REFUND, Permission.ESCROW_RESOLVE_DISPUTE, Permission.ESCROW_DESCRIPTOR_PUBLISH];
    readonly USER_MANAGEMENT: readonly [Permission.USER_READ, Permission.USER_WRITE, Permission.USER_DELETE, Permission.USER_MANAGE_ROLES];
    readonly AGENT_MANAGEMENT: readonly [Permission.AGENT_REGISTER, Permission.AGENT_MANAGE_OWN, Permission.AGENT_MANAGE_ALL, Permission.AGENT_READ_ALL];
    readonly SWAP_OPERATIONS: readonly [Permission.SWAP_READ_OWN, Permission.SWAP_READ_ALL, Permission.SWAP_CREATE, Permission.SWAP_CANCEL_OWN, Permission.SWAP_CANCEL_ALL, Permission.SWAP_APPROVE];
    readonly LIQUIDITY_OPERATIONS: readonly [Permission.LIQUIDITY_MANAGE_OWN, Permission.LIQUIDITY_MANAGE_ALL, Permission.LIQUIDITY_READ_ALL];
    readonly FX_OPERATIONS: readonly [Permission.FX_RATES_READ, Permission.FX_RATES_MANAGE];
    readonly ANALYTICS: readonly [Permission.ANALYTICS_READ_OWN, Permission.ANALYTICS_READ_ALL, Permission.ANALYTICS_EXPORT];
    readonly PARTNER_OPERATIONS: readonly [Permission.PARTNER_READ_OWN, Permission.PARTNER_MANAGE_OWN, Permission.PARTNER_AGENT_INVITE, Permission.PARTNER_AGENT_REMOVE, Permission.PARTNER_AGENT_READ, Permission.PARTNER_AGENT_MANAGE, Permission.PARTNER_AGENTS_READ, Permission.PARTNER_SWAPS_READ, Permission.PARTNER_SWAPS_MANAGE, Permission.PARTNER_LIQUIDITY_READ, Permission.PARTNER_METRICS_READ, Permission.PARTNER_SERVICES_CREATE, Permission.PARTNER_SERVICES_MANAGE, Permission.PARTNER_SERVICES_READ, Permission.PARTNER_SERVICES_DELETE];
    readonly PARTNER_ADMIN_OPERATIONS: readonly [Permission.PARTNER_READ_ALL, Permission.PARTNER_MANAGE_ALL];
    readonly PAY_OPERATIONS: readonly [Permission.PAY_PAYMENT_CREATE, Permission.PAY_PAYMENT_READ, Permission.PAY_PAYMENT_CANCEL, Permission.PAY_EVENT_SUBSCRIBE, Permission.PAY_STORE_READ, Permission.PAY_STORE_MANAGE];
    readonly PSP_OPERATIONS: readonly [Permission.PSP_CONNECTION_READ, Permission.PSP_CONNECTION_MANAGE, Permission.PSP_PAYMENT_CREATE, Permission.PSP_DISBURSEMENT_CREATE, Permission.PSP_PAYMENT_READ, Permission.PSP_ACCOUNT_READ, Permission.PSP_EVENT_SUBSCRIBE, Permission.PSP_RECONCILIATION_READ, Permission.PSP_RECONCILIATION_RUN, Permission.PSP_RECONCILIATION_RESOLVE];
    readonly ACCOUNTING_OPERATIONS: readonly [Permission.ACCOUNTING_READ, Permission.ACCOUNTING_TEMPLATE_MANAGE, Permission.ACCOUNTING_EXPORT];
};
/**
 * Role-permission mapping defining what each role can do
 *
 * This mapping defines the complete set of permissions granted to each role.
 * Supports both team roles (assigned through Hexclave teams/RBAC) and user
 * roles (assigned directly to users).
 *
 * @remarks
 * Permission counts by role:
 * - MINMO_ADMIN (user): all system and team permissions
 * - TEAM_ADMIN (team): team access management and product offering permissions
 * - TEAM_MEMBER (team): assigned team and product access
 * - MINMO_PARTNER (user): partner console access
 * - MINMO_AGENT (user): 9 permissions (own resources only)
 *
 * @example
 * ```typescript
 * // Check if a role has a specific permission
 * const hasPermission = ROLE_PERMISSIONS[UserRole.MINMO_ADMIN]
 *   .includes(Permission.SYSTEM_CONFIG); // true
 *
 * // Get all permissions for a user's roles
 * const userPermissions = getRolePermissions([UserRole.MINMO_AGENT]);
 * ```
 *
 * @see {@link roleHasPermission} for checking individual role permissions
 * @see {@link getRolePermissions} for getting permissions from multiple roles
 */
export declare const ROLE_PERMISSIONS: Record<Role, Permission[]>;
/**
 * Check if a specific role has a given permission
 *
 * @param role - The role (TeamRole or UserRole) to check
 * @param permission - The permission to verify
 * @returns True if the role has the permission, false otherwise
 *
 * @example
 * ```typescript
 * // Check if agents can create swaps
 * const canCreateSwap = roleHasPermission(
 *   UserRole.MINMO_AGENT,
 *   Permission.SWAP_CREATE
 * ); // true
 *
 * // Check if admins can configure system
 * const canConfigure = roleHasPermission(
 *   UserRole.MINMO_ADMIN,
 *   Permission.SYSTEM_CONFIG
 * ); // true
 * ```
 */
export declare function roleHasPermission(role: Role, permission: Permission): boolean;
/**
 * Get all permissions for multiple roles (union of permissions)
 *
 * Returns the combined set of unique permissions from all provided roles.
 * Supports both TeamRole and UserRole types.
 *
 * @param roles - Array of roles (TeamRole or UserRole) to combine permissions from
 * @returns Array of unique permissions across all roles
 *
 * @example
 * ```typescript
 * // Get permissions for a user with multiple roles
 * const permissions = getRolePermissions([
 *   UserRole.MINMO_AGENT,
 *   TeamRole.TEAM_ADMIN
 * ]);
 *
 * // Check if user can perform an action
 * if (permissions.includes(Permission.PARTNER_AGENTS_READ)) {
 *   // User can view partner agents
 * }
 * ```
 */
export declare function getRolePermissions(roles: Role[]): Permission[];
/**
 * Extract team roles from a list of roles
 *
 * @param roles - Array of mixed roles
 * @returns Array containing only team roles
 */
export declare function extractTeamRoles(roles: Role[]): TeamRole[];
/**
 * Extract user roles from a list of roles
 *
 * @param roles - Array of mixed roles
 * @returns Array containing only user roles
 */
export declare function extractUserRoles(roles: Role[]): UserRole[];
//# sourceMappingURL=permissions.d.ts.map