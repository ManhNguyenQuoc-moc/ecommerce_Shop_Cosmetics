"use client";
import { Select, SelectProps, Tag } from "antd";
import clsx from "clsx";

type OptionType = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

type TagRender = SelectProps["tagRender"];
const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      className=""
    >
      {label}
    </Tag>
  );
};

export type SWTSelectProps = SelectProps & {
  label?: string;
  onChange?: SelectProps["onChange"];
  options?: OptionType[];
  showSearch?: boolean;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
};
const SWTSelect = ({ ...props }: SWTSelectProps) => {
  return (
    <Select
      {...props}
      className={clsx(
        "transition-all duration-300",
        "h-11",
        "[&_.ant-select-selector]:!h-11",
        "[&_.ant-select-selector]:!items-center",
        "dark:[&_.ant-select-selector]:!bg-slate-900/50",
        "dark:[&_.ant-select-selector]:!border-slate-700/80",
        "dark:[&_.ant-select-selection-item]:!text-slate-200",
        "dark:[&_.ant-select-selection-placeholder]:!text-slate-500",
        "dark:[&_.ant-select-arrow]:!text-slate-400",
        "dark:[&_.ant-select-clear]:!text-slate-400 dark:[&_.ant-select-clear]:!bg-transparent",
        "hover:dark:[&_.ant-select-selector]:!border-cyan-400/50",
        "focus-within:dark:[&_.ant-select-selector]:!border-cyan-500",
        props?.className,
      )}
      popupClassName="dark:bg-slate-800 dark:border dark:border-slate-700 dark:shadow-xl dark:shadow-black/50 dark:[&_.ant-select-item]:text-slate-300 dark:[&_.ant-select-item-option-active]:bg-slate-700 dark:[&_.ant-select-item-option-selected]:bg-cyan-900/30 dark:[&_.ant-select-item-option-selected]:text-cyan-400"
      placeholder={
        props.placeholder
          ? props.placeholder
          : props.label
            ? `Chọn ${props.label.toLowerCase()}`
            : "Chọn dữ liệu"
      }
      showSearch={props?.showSearch ?? false}
      allowClear={props?.allowClear ?? true}
      variant={props?.variant ?? "outlined"}
      disabled={props?.disabled ?? false}
      size={props?.size ?? "middle"}
      maxTagCount="responsive"
      tagRender={tagRender}
    />
  );
};
export default SWTSelect;
