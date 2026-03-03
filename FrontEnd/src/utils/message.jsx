import { App } from "antd";

let message;
let notification;

export const setMessageInstance = (msg, notif) => {
    message = msg;
    notification = notif;
};

export const useMessageInit = () => {
    const { message: msg, notification: notif } = App.useApp();
    setMessageInstance(msg, notif);
};

const showMessageError = (content = "Có lỗi xảy ra") => {
    return message?.error(content);
};

const showMessageSuccess = (content = "Xử lý thành công") => {
    return message?.success(content);
};

const showNotificationError = (description, options = {}) => {
    return notification?.error({
        ...options,
        title: options.title ?? "Thao tác không thành công",
        description:
            description ??
            "Lỗi xảy ra trong quá trình xử lý, vui lòng liên hệ admin.",
        placement: options.placement ?? "topRight",
        className: "whitespace-pre-line z-99999!",
    });
};

const showNotificationSuccess = (description, options = {}) => {
    return notification?.success({
        ...options,
        title: options.title ?? "Thao tác thành công",
        description: description ?? "Xử lý thành công.",
        placement: options.placement ?? "topRight",
        className: "whitespace-pre-line z-99999!",
    });
};

export {
    showMessageError,
    showMessageSuccess,
    showNotificationError,
    showNotificationSuccess,
};