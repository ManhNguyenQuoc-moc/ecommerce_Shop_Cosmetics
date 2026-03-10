import { Modal, ModalProps } from "antd";

type SWTConfirmationModalProps = ModalProps & {
};

const SWTConfirmationModal = ({ children, ...props }: SWTConfirmationModalProps) => {
  return (
    <Modal
    {...props}
      title={props?.title || "Xác nhận thao tác"}
      closable={{ "aria-label": "Custom Close Button" }}
      open={props?.open}
      onOk={props?.onOk}
      onCancel={props?.onCancel}
    >
      {children}
    </Modal>
  );
};

export default SWTConfirmationModal;