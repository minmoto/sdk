import { Currency } from "./currency";
export declare enum PaymentChannel {
    MPESA_PHONE = "mpesa_phone",
    MPESA_TILL = "mpesa_till",
    MPESA_PAYBILL = "mpesa_paybill",
    /**
     * Airtel Money. Operates across multiple markets under one brand — currently
     * Kenya (KES) and Malawi (MWK). Phone number validation is therefore
     * currency-scoped; see CURRENCY_CHANNEL_FIELD_OVERRIDES.
     */
    AIRTEL_MONEY = "airtel_money",
    /** Airtel Money "Buy Goods and Services" till (Malawi, *211#) */
    AIRTEL_MONEY_TILL = "airtel_money_till",
    TNM_MPAMBA = "tnm_mpamba",
    /** TNM Mpamba "Pay Merchant" code (Malawi, *444#) */
    TNM_MPAMBA_MERCHANT = "tnm_mpamba_merchant",
    BANK_TRANSFER = "bank_transfer",
    CARD = "card",
    CASH = "cash",
    LIGHTNING = "lightning",
    ONCHAIN = "onchain"
}
/**
 * Base field configuration for form rendering and validation
 */
interface FieldConfig {
    /** Whether this field is required */
    required: boolean;
    /** Regular expression pattern for validation */
    pattern?: RegExp;
    /** Minimum length for string fields */
    minLength?: number;
    /** Maximum length for string fields */
    maxLength?: number;
    /** Placeholder text for UI rendering */
    placeholder?: string;
    /** Help text to display to users */
    helpText?: string;
    /** Whether this field contains sensitive data */
    sensitive?: boolean;
    /** Custom validation function */
    validate?: (value: string | number | boolean | undefined) => boolean | string;
}
/**
 * M-Pesa Phone payment fields
 * @description Fields required for direct M-Pesa phone-to-phone transfers
 */
export interface MpesaPhoneFields {
    /** Phone number to send/receive money in international format */
    phoneNumber: string;
    /** Optional transaction description */
    description?: string;
}
/**
 * M-Pesa Till payment fields
 * @description Fields required for M-Pesa Till Number payments (Buy Goods)
 */
export interface MpesaTillFields {
    /** The till number to pay to */
    tillNumber: string;
    /** Optional transaction description */
    description?: string;
}
/**
 * M-Pesa Paybill payment fields
 * @description Fields required for M-Pesa Paybill payments
 */
export interface MpesaPaybillFields {
    /** The paybill number to pay to */
    paybillNumber: string;
    /** Account number/reference for the paybill */
    accountNumber: string;
    /** Phone number in international format */
    phoneNumber: string;
    /** Optional transaction description */
    description?: string;
}
/**
 * Airtel Money payment fields
 * @description Fields required for Airtel Money phone-to-phone transfers.
 * Supported in Kenya (+254) and Malawi (+265 99/98); the accepted phone format
 * depends on the currency the channel is configured under.
 */
export interface AirtelMoneyFields {
    /** Phone number to send/receive money in international format */
    phoneNumber: string;
    /** Optional transaction description */
    description?: string;
}
/**
 * Airtel Money Till payment fields (Malawi)
 * @description Fields required for Airtel Money "Buy Goods and Services"
 * payments, where the customer types the merchant's till number into *211#.
 */
export interface AirtelMoneyTillFields {
    /** The till number to pay to */
    tillNumber: string;
    /** Optional transaction description */
    description?: string;
}
/**
 * TNM Mpamba payment fields (Malawi)
 * @description Fields required for TNM Mpamba phone-to-phone transfers via *444#.
 * Mpamba wallets sit on TNM numbers (+265 88, legacy +265 84).
 */
export interface TnmMpambaFields {
    /** Phone number to send/receive money in international format */
    phoneNumber: string;
    /** Optional transaction description */
    description?: string;
}
/**
 * TNM Mpamba merchant payment fields (Malawi)
 * @description Fields required for TNM Mpamba "Pay Merchant" payments, where the
 * customer types the merchant's code into *444#.
 */
export interface TnmMpambaMerchantFields {
    /** The merchant code to pay to */
    merchantCode: string;
    /** Optional transaction description */
    description?: string;
}
/**
 * Bank account fields for direct bank deposits
 * @description Fields required for bank account transactions
 */
export interface BankAccountFields {
    /** Account holder's full name */
    accountName: string;
    /** Bank account number */
    accountNumber: string;
    /** Bank name */
    bankName: string;
    /** Bank branch name or code */
    branchName?: string;
    /** SWIFT/BIC code for international transfers */
    swiftCode?: string;
    /** IBAN for international accounts */
    iban?: string;
    /** Routing number (for US banks) */
    routingNumber?: string;
    /** Sort code (for UK banks) */
    sortCode?: string;
    /** Bank code (varies by country) */
    bankCode?: string;
    /** Account type (e.g., 'savings', 'checking', 'current') */
    accountType?: "savings" | "checking" | "current";
    /** Additional reference information */
    reference?: string;
}
/**
 * Bank transfer fields for wire transfers
 * @description Extended fields for bank transfers including intermediary banks
 */
export interface BankTransferFields extends BankAccountFields {
    /** Transfer purpose/reason */
    transferPurpose: string;
    /** Intermediary bank details if required */
    intermediaryBank?: {
        bankName: string;
        swiftCode: string;
        accountNumber?: string;
    };
    /** Correspondent bank details if required */
    correspondentBank?: {
        bankName: string;
        swiftCode: string;
        accountNumber?: string;
    };
    /** Additional instructions for the transfer */
    additionalInstructions?: string;
}
/**
 * Card payment fields
 * @description Fields required for credit/debit card payments
 */
export interface CardPaymentFields {
    /** Card number (should be tokenized/encrypted) */
    cardNumber: string;
    /** Cardholder's name as it appears on the card */
    cardholderName: string;
    /** Card expiry month (MM) */
    expiryMonth: string;
    /** Card expiry year (YYYY) */
    expiryYear: string;
    /** Card verification value/code */
    cvv: string;
    /** Billing address fields */
    billingAddress?: {
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
    };
    /** Whether to save card for future use */
    saveCard?: boolean;
    /** 3D Secure authentication token if required */
    threeDSecureToken?: string;
}
/**
 * Cash payment: no fields required.
 * All fiat currencies accept cash programmatically.
 */
export interface CashFields {
}
/**
 * Comprehensive mapping of payment channels to their required fields
 * @description This type ensures type safety when accessing channel-specific fields.
 * Includes both fiat payment channels and Bitcoin payment channels.
 */
export interface PaymentChannelFields {
    [PaymentChannel.MPESA_PHONE]: MpesaPhoneFields;
    [PaymentChannel.MPESA_TILL]: MpesaTillFields;
    [PaymentChannel.MPESA_PAYBILL]: MpesaPaybillFields;
    [PaymentChannel.AIRTEL_MONEY]: AirtelMoneyFields;
    [PaymentChannel.AIRTEL_MONEY_TILL]: AirtelMoneyTillFields;
    [PaymentChannel.TNM_MPAMBA]: TnmMpambaFields;
    [PaymentChannel.TNM_MPAMBA_MERCHANT]: TnmMpambaMerchantFields;
    [PaymentChannel.BANK_TRANSFER]: BankTransferFields;
    [PaymentChannel.CARD]: CardPaymentFields;
    [PaymentChannel.CASH]: CashFields;
    [PaymentChannel.LIGHTNING]: LightningFields;
    [PaymentChannel.ONCHAIN]: OnchainFields;
}
/**
 * Union of all fiat payment field shapes.
 */
export type FiatPaymentFields = MpesaPhoneFields | MpesaTillFields | MpesaPaybillFields | AirtelMoneyFields | AirtelMoneyTillFields | TnmMpambaFields | TnmMpambaMerchantFields | BankTransferFields | CardPaymentFields | CashFields;
/**
 * Lightning payment via BOLT11 invoice.
 * @description Use this when the user provides a Lightning invoice.
 */
export interface LightningInvoiceFields {
    /** Lightning invoice (BOLT11) */
    lightningInvoice: string;
}
/**
 * Lightning payment via Lightning address.
 * @description Use this when the user provides a Lightning address (e.g. user@domain.com).
 */
export interface LightningAddressFields {
    /** Lightning address (e.g. user@domain.com) */
    lightningAddress: string;
}
/**
 * Lightning payment fields: either invoice or address, not both.
 * @description Discriminated union — use exactly one shape.
 */
export type LightningFields = LightningInvoiceFields | LightningAddressFields;
/**
 * Onchain payment fields for receiving BTC via on-chain transactions.
 * @description Fields required for Bitcoin address payments
 */
export interface OnchainFields {
    /** Bitcoin on-chain address */
    onChainAddress: string;
}
/**
 * Lightning payment details for receiving BTC.
 * Union of invoice or address shape; kept for backward compatibility.
 */
export type LightningDetails = LightningFields;
/**
 * Onchain payment details for receiving BTC.
 * @deprecated Use OnchainFields instead. This is kept for backward compatibility.
 */
export interface OnchainDetails extends OnchainFields {
}
/**
 * Union of supported Bitcoin payment detail shapes.
 * @description Can be used in the old format (LightningDetails/OnchainDetails) or
 * new format (PaymentChannelData with LIGHTNING/ONCHAIN channels).
 */
export type BitcoinPaymentDetails = LightningDetails | OnchainDetails;
/**
 * Generic payment details for swaps (fiat or bitcoin).
 */
export type PaymentDetails = FiatPaymentFields | BitcoinPaymentDetails;
/**
 * Mapping of supported channels to their configured fiat payment fields.
 */
export type AgentPaymentDetails = Partial<Record<PaymentChannel, FiatPaymentFields>>;
export interface ChannelFieldDescriptor extends FieldConfig {
    key: string;
}
export declare function getChannelFieldDescriptors(channel: PaymentChannel, currency?: Currency): ChannelFieldDescriptor[];
/**
 * Type guard: details are Lightning invoice shape.
 */
export declare function isLightningInvoiceDetails(details: PaymentDetails | undefined): details is LightningInvoiceFields;
/**
 * Type guard: details are Lightning address shape.
 */
export declare function isLightningAddressDetails(details: PaymentDetails | undefined): details is LightningAddressFields;
/**
 * Type guard: details are either Lightning invoice or Lightning address.
 */
export declare function isLightningDetails(details: PaymentDetails | undefined): details is LightningDetails;
/**
 * Get the Lightning invoice from Lightning details, when the invoice shape is used.
 * @param details - Lightning payment details (invoice or address shape)
 * @returns The BOLT11 invoice string, or undefined when address shape is used
 */
export declare function getLightningInvoiceFromDetails(details: LightningDetails | undefined): string | undefined;
/**
 * Get the Lightning address from Lightning details, when the address shape is used.
 * @param details - Lightning payment details (invoice or address shape)
 * @returns The Lightning address (e.g. user@domain.com), or undefined when invoice shape is used
 */
export declare function getLightningAddressFromDetails(details: LightningDetails | undefined): string | undefined;
/**
 * Get either the Lightning invoice or Lightning address from details.
 * Exactly one will be set when the details are valid.
 * @param details - Lightning payment details
 * @returns Object with invoice and/or address (at most one set)
 */
export declare function getLightningDestinationFromDetails(details: LightningDetails | undefined): {
    lightningInvoice?: string;
    lightningAddress?: string;
};
export declare function isOnchainDetails(details: PaymentDetails | undefined): details is OnchainDetails;
export declare function isFiatPaymentDetails(details: PaymentDetails | undefined): details is FiatPaymentFields;
/**
 * Mobile money channels whose destination is a phone number.
 * These share a single `phoneNumber` field and render identically.
 */
export declare const PHONE_MOBILE_MONEY_CHANNELS: readonly PaymentChannel[];
/**
 * Mobile money channels whose destination is a merchant-assigned numeric code
 * the payer types into a USSD menu (M-Pesa till, Airtel till, Mpamba merchant).
 * The field name differs per channel; see PaymentChannelFields.
 */
export declare const MERCHANT_CODE_CHANNELS: readonly PaymentChannel[];
/**
 * Check if a payment channel settles to a phone number.
 * @param channel - The payment channel to check
 */
export declare function isPhoneMobileMoneyChannel(channel: PaymentChannel): boolean;
/**
 * Check if a payment channel is any mobile money channel.
 * @param channel - The payment channel to check
 */
export declare function isMobileMoneyChannel(channel: PaymentChannel): boolean;
/**
 * Check if a payment channel is a Bitcoin payment channel (LIGHTNING or ONCHAIN).
 * @param channel - The payment channel to check
 * @returns true if the channel is LIGHTNING or ONCHAIN
 */
export declare function isBitcoinPaymentChannel(channel: PaymentChannel): channel is PaymentChannel.LIGHTNING | PaymentChannel.ONCHAIN;
/**
 * Check if a payment channel is a fiat payment channel (not Bitcoin).
 * @param channel - The payment channel to check
 * @returns true if the channel is a fiat payment channel
 */
export declare function isFiatPaymentChannel(channel: PaymentChannel): channel is PaymentChannel.MPESA_PHONE | PaymentChannel.MPESA_TILL | PaymentChannel.MPESA_PAYBILL | PaymentChannel.AIRTEL_MONEY | PaymentChannel.AIRTEL_MONEY_TILL | PaymentChannel.TNM_MPAMBA | PaymentChannel.TNM_MPAMBA_MERCHANT | PaymentChannel.BANK_TRANSFER | PaymentChannel.CARD | PaymentChannel.CASH;
/**
 * Field validation configuration for each payment channel
 * @description Provides validation rules and UI hints for each field.
 *
 * These are the channel *defaults*. Channels that operate in more than one
 * market (currently AIRTEL_MONEY) refine them per currency via
 * CURRENCY_CHANNEL_FIELD_OVERRIDES — always read them through
 * getChannelFieldConfig() rather than indexing this map directly.
 */
export declare const PaymentChannelFieldConfigs: Record<PaymentChannel, Record<string, FieldConfig>>;
/**
 * Per-currency refinements to PaymentChannelFieldConfigs.
 *
 * A channel that serves several markets under one brand keeps a single enum
 * member; only the fields that genuinely differ by market are overridden here.
 * Each override is merged over the channel default, field by field.
 *
 * @example Airtel Money accepts +254 numbers under KES and +265 99/98 under MWK.
 */
export declare const CURRENCY_CHANNEL_FIELD_OVERRIDES: Partial<Record<Currency, Partial<Record<PaymentChannel, Record<string, FieldConfig>>>>>;
/**
 * Resolve the field configuration for a channel, scoped to a currency when one
 * is known.
 *
 * Callers that know which currency the channel is configured under should pass
 * it — otherwise a multi-market channel falls back to its default market and
 * will reject numbers that are valid elsewhere.
 *
 * @param channel - The payment channel
 * @param currency - The currency the channel is configured under, if known
 * @returns Field configs with any currency-specific overrides merged in
 */
export declare function getChannelFieldConfig(channel: PaymentChannel, currency?: Currency): Record<string, FieldConfig>;
/**
 * Type guard to check if a payment channel has specific fields defined
 */
export declare function hasChannelFields<T extends PaymentChannel>(channel: T, fields: unknown, currency?: Currency): fields is PaymentChannelFields[T];
/**
 * Validate payment channel fields
 * @param channel - The payment channel
 * @param fields - The fields to validate
 * @param currency - The currency the channel is configured under, if known.
 * Required to validate multi-market channels (e.g. Airtel Money) correctly.
 * @returns Validation result with any errors
 */
export declare function validateChannelFields<T extends PaymentChannel>(channel: T, fields: Partial<PaymentChannelFields[T]>, currency?: Currency): {
    valid: boolean;
    errors: Record<string, string>;
};
/**
 * Get required fields for a payment channel
 * @param channel - The payment channel
 * @returns Array of required field names
 */
export declare function getRequiredFields(channel: PaymentChannel, currency?: Currency): string[];
/**
 * Get sensitive fields for a payment channel
 * @param channel - The payment channel
 * @returns Array of sensitive field names that should be masked/encrypted
 */
export declare function getSensitiveFields(channel: PaymentChannel, currency?: Currency): string[];
/**
 * Type for extracting fields of a specific payment channel
 * @example
 * type MpesaPaymentFields = ChannelFields<PaymentChannel.MPESA_PHONE>;
 */
export type ChannelFields<T extends PaymentChannel> = PaymentChannelFields[T];
/**
 * Discriminated union type for payment channel data
 * @description Ensures type safety when working with payment channel data
 */
export type PaymentChannelData<T extends PaymentChannel = PaymentChannel> = T extends PaymentChannel ? {
    channel: T;
    fields: PaymentChannelFields[T];
} : never;
/**
 * Union type of all possible payment channel data
 */
export type AnyPaymentChannelData = {
    [K in PaymentChannel]: PaymentChannelData<K>;
}[PaymentChannel];
/**
 * Helper function to create type-safe payment channel data
 * @param channel - The payment channel
 * @param fields - The fields for that channel
 * @returns Type-safe payment channel data
 * @example
 * const mpesaPayment = createPaymentChannelData(PaymentChannel.MPESA_PHONE, {
 *   phoneNumber: '+254712345678',
 *   description: 'Test payment'
 * });
 */
export declare function createPaymentChannelData<T extends PaymentChannel>(channel: T, fields: PaymentChannelFields[T], currency?: Currency): PaymentChannelData<T>;
/**
 * Type guard for payment channel data
 */
export declare function isPaymentChannelData<T extends PaymentChannel>(data: unknown, channel: T, currency?: Currency): data is PaymentChannelData<T>;
export {};
//# sourceMappingURL=channels.d.ts.map