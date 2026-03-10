"use client";

import { Form, FormItemProps } from "antd";

export type SWTFormItemProps = FormItemProps & {
  children?: React.ReactNode;
};

const SWTFormItem = ({ children, ...props }: SWTFormItemProps) => {
  return (
    <Form.Item {...props}>
      {children}
    </Form.Item>
  );
};

export default SWTFormItem;
