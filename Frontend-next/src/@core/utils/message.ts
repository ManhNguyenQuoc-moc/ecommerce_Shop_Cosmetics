import { App } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { ArgsProps, NotificationInstance } from "antd/es/notification/interface";

let message: MessageInstance;
let notification: NotificationInstance;

export const setMessageInstance = (msg: MessageInstance, notif: NotificationInstance) => {
  message = msg;
  notification = notif;
};

export const useMessageInit = () => {
  const { message: msg, notification: notif } = App.useApp();
  setMessageInstance(msg, notif);
};

const showMessageError = (content: string = "Có lỗi xảy ra") => {
  return message?.error(content);
};

const showMessageSuccess = (content: string = "Xử lý thành công") => {
  return message?.success(content);
};

const showNotificationError = (description?: string, options?: ArgsProps) => {
  return notification?.error({
    ...options,
    title: "Thao tác không thành công",
    description: description ?? "Lỗi xảy ra trong quá trình xử lý, vui lòng liên hệ admin.",
    placement: options?.placement ?? "topRight",
    className: "whitespace-pre-line z-99999!",
  });
};

const showNotificationSuccess = (description?: string, options?: ArgsProps) => {
  return notification?.success({
    ...options,
    title: options?.title ?? "Thao tác thành công",
    description: description ?? "Xử lý thành công.",
    placement: options?.placement ?? "topRight",
    className: "whitespace-pre-line z-99999!",
  });
};

const showNotificationWarning = (description?: string, options?: ArgsProps) => {
  return notification?.warning({
    ...options,
    title: options?.title ?? "Lưu ý",
    description: description ?? "Vui lòng kiểm tra lại thông tin.",
    placement: options?.placement ?? "topRight",
    className: "whitespace-pre-line z-99999!",
  });
};

const showNotificationInfo = (description?: string, options?: ArgsProps) => {
  return notification?.info({
    ...options,
    title: options?.title ?? "Thông báo",
    description: description ?? "Thông tin hệ thống.",
    placement: options?.placement ?? "topRight",
    className: "whitespace-pre-line z-99999!",
  });
};

export {
    showMessageError,
    showMessageSuccess,
    showNotificationError,
    showNotificationSuccess,
    showNotificationWarning,
    showNotificationInfo,
}