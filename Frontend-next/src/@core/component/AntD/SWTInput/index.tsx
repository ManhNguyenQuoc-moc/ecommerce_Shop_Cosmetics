"use client";

import { Input } from "antd";
import type { GetProps } from "antd";
import { Search as SearchIcon } from "lucide-react";

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
      maxLength={props.maxLength ?? 1000}
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
      maxLength={props.maxLength ?? 5000}
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
      prefix={<SearchIcon size={18} className="text-gray-400 dark:text-slate-500 transition-colors" />}
      placeholder={props.placeholder ?? "Tìm kiếm"}
      onChange={(e) => onChange?.(e)}
      className={`
        h-10
        !border !border-gray-200 dark:!border-slate-700/80
        hover:!border-brand-400 dark:hover:!border-cyan-400/50
        focus-within:!border-brand-500 dark:focus-within:!border-cyan-500
        !rounded-xl 
        !bg-white dark:!bg-slate-900/50
        !text-slate-800 dark:!text-slate-200
        [&>input]:!bg-transparent [&>input]:dark:!text-slate-200 [&>input::placeholder]:dark:!text-slate-500
        transition-all duration-300
        backdrop-blur-sm
        px-2
        ${className ?? ""}
      `}
    />
  );
};

// Attach sub-components to support the AntD pattern (e.g., SWTInput.TextArea)
SWTInput.TextArea = SWTInputTextArea;
SWTInput.Password = SWTInputPassword;
SWTInput.Search = SWTInputSearch;

export {
  SWTInput,
  SWTInputPassword,
  SWTInputTextArea,
  SWTInputSearch,
};

export default SWTInput;