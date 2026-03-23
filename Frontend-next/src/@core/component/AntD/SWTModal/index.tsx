"use client";

import { Modal, ModalProps } from "antd";

export type SWTModalProps = ModalProps & {
  children?: React.ReactNode;
};

const SWTModal = ({ children, ...props }: SWTModalProps) => {
  return (
    <Modal
      {...props}
      bodyStyle={{ backgroundColor: "transparent", ...(props.bodyStyle || {}) }}
      className={`dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-brand-500/20 dark:[&_.ant-modal-header]:!bg-transparent dark:[&_.ant-modal-title]:!bg-transparent ${props.className || ''}`}
    >
      {children}
    </Modal>
  );
};

export default SWTModal;
