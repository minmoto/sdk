import { type CreateAccountingReportRequest, type CreateReportingTemplateRequest, type ReportingTemplate, type SourceSummary, type SourceType } from "@minmo/core";
import type { HttpClient } from "./http";
export type AccountingCsvResponse = {
    stream: ReadableStream<Uint8Array> | null;
    contentType: string;
    contentDisposition: string;
    certification: "uncertified";
};
/** Partner-scoped lightweight reporting operations. */
export declare class AccountingClient {
    private readonly http;
    private readonly partnerId?;
    constructor(http: HttpClient, partnerId?: string | undefined);
    listSources(type?: SourceType): Promise<SourceSummary[]>;
    listTemplates(): Promise<ReportingTemplate[]>;
    createTemplate(input: CreateReportingTemplateRequest): Promise<ReportingTemplate>;
    deleteTemplate(templateId: string): Promise<void>;
    generateReport(input: CreateAccountingReportRequest): Promise<AccountingCsvResponse>;
    private path;
}
//# sourceMappingURL=accounting.d.ts.map