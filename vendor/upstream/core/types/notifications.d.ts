/** Client-side notification projection and delivery contracts. */
import type { MinmoEventType } from "./events";
export declare enum NotificationStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read"
}
export declare enum NotificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/** Delivery channels supported by the event-backed notification service. */
export declare enum NotificationChannel {
    PUSH = "push",
    SSE = "sse"
}
export type Notification = {
    id: string;
    type: MinmoEventType;
    priority: NotificationPriority;
    userId: string;
    data: Record<string, any>;
    metadata?: Record<string, any>;
    status: NotificationStatus;
    channels: NotificationChannel[];
    createdAt: string;
    updatedAt: string;
    readAt?: string;
    sentAt?: string;
    scheduledAt?: string;
    expiresAt?: string;
};
export type PaginatedNotifications = {
    data: Notification[];
    page: number;
    limit: number;
    total: number;
};
export type UnreadCount = {
    total: number;
    byType: Record<string, number>;
};
export type RegisterPushTokenRequest = {
    token: string;
    platform: "ios" | "android" | "web";
    deviceId?: string;
};
export type PushTokenResponse = {
    id: string;
    userId: string;
    token: string;
    platform: "ios" | "android" | "web";
    deviceId?: string;
    active: boolean;
    lastUsedAt?: string;
    createdAt: string;
    updatedAt: string;
};
export declare const isNotificationRead: (notification: Notification) => boolean;
//# sourceMappingURL=notifications.d.ts.map