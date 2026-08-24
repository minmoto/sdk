import { PaymentChannel } from "../types/channels";
import type { ChannelEvidenceConfig, DisputeEvidenceDto, EvidenceForm } from "../types/dispute";
export declare const CHANNEL_EVIDENCE_CONFIG: ChannelEvidenceConfig;
export declare function buildInitialForm(channel: PaymentChannel): EvidenceForm;
export declare function buildEvidenceDto(form: Record<string, string>, channel: PaymentChannel): DisputeEvidenceDto;
//# sourceMappingURL=dispute.d.ts.map