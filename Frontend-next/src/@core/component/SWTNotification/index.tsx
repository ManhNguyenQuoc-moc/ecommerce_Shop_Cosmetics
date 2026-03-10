"use client";

import React from "react";
import { App } from "antd";
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import type { ArgsProps, NotificationInstance } from "antd/es/notification/interface";

let notification: NotificationInstance;

export const useSWTNotificationInit = () => {
    const { notification: notif } = App.useApp();
    notification = notif;
};

type SWTNotificationType = "success" | "error" | "info" | "warning";

interface SWTNotificationOptions extends Omit<ArgsProps, "message" | "description" | "icon" | "className" | "style"> {
    placement?: ArgsProps["placement"];
    duration?: number;
}

const iconMap: Record<SWTNotificationType, React.ReactNode> = {
    success: <CheckCircleFilled className="!text-white text-[22px]" />,
    error: <CloseCircleFilled className="!text-white text-[22px]" />,
    info: <InfoCircleFilled className="!text-white text-[22px]" />,
    warning: <ExclamationCircleFilled className="!text-white text-[22px]" />,
};

const bgMap: Record<SWTNotificationType, string> = {
    success: "swt-notification-success",
    error: "swt-notification-error",
    info: "swt-notification-info",
    warning: "swt-notification-warning",
};

const showSWTNotification = (
    type: SWTNotificationType,
    title: string,
    description?: string | React.ReactNode,
    options?: SWTNotificationOptions
) => {
    return notification?.open({
        ...options,
        message: <span className="!text-white font-semibold text-[15px]">{title}</span>,
        description: <span className="!text-white/90 text-[13px]">{description}</span>,
        icon: iconMap[type],
        placement: options?.placement ?? "topRight",
        duration: options?.duration ?? 4,
        className: `swt-notification ${bgMap[type]}`,
        closeIcon: <span className="!text-white/80 hover:!text-white text-base">✕</span>,
    });
};

export const SWTNotificationSuccess = (
    title: string,
    description?: string | React.ReactNode,
    options?: SWTNotificationOptions
) => showSWTNotification("success", title, description, options);

export const SWTNotificationError = (
    title: string,
    description?: string | React.ReactNode,
    options?: SWTNotificationOptions
) => showSWTNotification("error", title, description, options);

export const SWTNotificationInfo = (
    title: string,
    description?: string | React.ReactNode,
    options?: SWTNotificationOptions
) => showSWTNotification("info", title, description, options);

export const SWTNotificationWarning = (
    title: string,
    description?: string | React.ReactNode,
    options?: SWTNotificationOptions
) => showSWTNotification("warning", title, description, options);

export default showSWTNotification;
