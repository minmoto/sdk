import { Currency } from "./currency";
import { PaymentChannel } from "./channels";
export declare enum MpesaUssdAutomationTaskStatus {
    Pending = "pending",
    Running = "running",
    AwaitingAgentAuth = "awaiting_agent_auth",
    Completed = "completed",
    Failed = "failed",
    Blocked = "blocked"
}
export declare enum MpesaUssdAutomationFailureReason {
    UnsupportedChannel = "unsupported_channel",
    UnsupportedCurrency = "unsupported_currency",
    InvalidTask = "invalid_task",
    AccessibilityDisabled = "accessibility_disabled",
    CallPermissionDenied = "call_permission_denied",
    UssdUnavailable = "ussd_unavailable",
    PromptMismatch = "prompt_mismatch",
    AmountMismatch = "amount_mismatch",
    RecipientMismatch = "recipient_mismatch",
    Timeout = "timeout",
    ProviderAuthRequired = "provider_auth_required",
    ResultUnreadable = "result_unreadable"
}
export declare enum MpesaUssdAutomationStepKind {
    LaunchSession = "launch_session",
    MatchPrompt = "match_prompt",
    SubmitInput = "submit_input",
    AwaitAgentAuth = "await_agent_auth",
    ConfirmDetails = "confirm_details",
    ReadResult = "read_result"
}
export declare enum MpesaUssdAutomationRunMode {
    LivePayout = "live_payout",
    Test = "test"
}
export interface MpesaUssdPayoutTask {
    taskId: string;
    swapId: string;
    agentId: string;
    deviceId: string;
    amountKes: string;
    phoneNumber: string;
    reference: string;
    runMode?: MpesaUssdAutomationRunMode;
    recipientName?: string;
    expiresAt?: string;
    idempotencyKey?: string;
}
export interface MpesaUssdAutomationStep {
    kind: MpesaUssdAutomationStepKind;
    expectedPromptPattern?: string;
    inputTemplate?: string;
    failureReason?: MpesaUssdAutomationFailureReason;
}
export interface MpesaUssdAutomationResult {
    taskId: string;
    status: MpesaUssdAutomationTaskStatus;
    failureReason?: MpesaUssdAutomationFailureReason;
    lastPrompt?: string;
    transactionCostKes?: string;
    recipientName?: string;
}
export declare function isMpesaUssdAutomationEligible(params: {
    currency: Currency;
    paymentChannel: PaymentChannel;
}): boolean;
//# sourceMappingURL=mpesa-ussd-automation.d.ts.map