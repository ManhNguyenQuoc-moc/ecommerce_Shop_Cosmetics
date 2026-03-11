"use client";

import { Input } from "antd";
import type { GetProps } from "antd";
import SearchIcon from "@/src/@core/component/SWTIcon/iconoir/search";

const { TextArea, Password } = Input;

type InputProps = GetProps<typeof Input>;
type PasswordProps = GetProps<typeof Password>;
type TextAreaProps = GetProps<typeof TextArea>;
export type SWTInputProps = InputProps & {
  label?: string;
};

export type SWTInputPasswordProps = PasswordProps;
export type SWTInputTextAreaProps = TextAreaProps;
export type SWTInputSearchProps = InputProps;

const SWTInput = ({ label, placeholder, onChange, ...props }: SWTInputProps) => {
  return (
    <Input
      {...props}
      placeholder={placeholder ?? (label ? `Nhập ${label.toLowerCase()}` : "Nhập dữ liệu")}
      allowClear={props.allowClear ?? true}
      maxLength={props.maxLength ?? 250}
      showCount={props.showCount ?? true}
      onChange={(e) => onChange?.(e)}
      className={`h-11 rounded-lg ${props.className ?? ""}`}
    />
  );
};
const SWTInputPassword = ({ onChange, ...props }: SWTInputPasswordProps) => {
  return (
    <Password
      {...props}
      allowClear={props.allowClear ?? true}
      maxLength={props.maxLength ?? 32}
      placeholder={props.placeholder ?? "Nhập mật khẩu"}
      onChange={(e) => onChange?.(e)}
      className={`
    h-11 rounded-lg 
    !bg-slate-200
    [&_.ant-input]:!bg-transparent
    ${props.className ?? ""}
  `}
    />
  );
};
const SWTInputTextArea = ({ onChange, ...props }: SWTInputTextAreaProps) => {
  return (
    <TextArea
      {...props}
      maxLength={props.maxLength ?? 500}
      showCount={props.showCount ?? true}
      onChange={(e) => onChange?.(e)}
      className={`rounded-lg ${props.className ?? ""}`}
    />
  );
};
const SWTInputSearch = ({ className, onChange, ...props }: SWTInputSearchProps) => {
  return (
    <Input
      {...props}
      prefix={<SearchIcon size={18} className="text-gray-400" />}
      placeholder={props.placeholder ?? "Tìm kiếm"}
      onChange={(e) => onChange?.(e)}
      className={`
        h-10
        !border !border-gray-200
        hover:!border-blue-400
        focus-within:!border-blue-500
        !rounded-xl !bg-white
        transition-all duration-200
        px-2
        ${className ?? ""}
      `}
    />
  );
};
export {
  SWTInput,
  SWTInputPassword,
  SWTInputTextArea,
  SWTInputSearch,
};

export default SWTInput;