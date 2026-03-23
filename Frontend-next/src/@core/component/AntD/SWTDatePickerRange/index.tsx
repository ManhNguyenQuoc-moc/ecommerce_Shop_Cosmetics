"use client";
import { DatePicker, DatePickerProps, Space } from "antd";
import type { GetProps } from "antd";

const { RangePicker } = DatePicker;

export type SWTDatePickerRangeProps = GetProps<typeof RangePicker> & {
    label?: string;
};
const SWTDatePickerRange = ({ ...props }: SWTDatePickerRangeProps) => {
    return (
        <RangePicker
            {...props}
            picker={props?.picker ?? "date"}
            className={`
                h-10 !rounded-lg
                !border !border-gray-200 dark:!border-slate-700/80
                hover:!border-brand-400 dark:hover:!border-cyan-400/50
                focus-within:!border-brand-500 dark:focus-within:!border-cyan-500
                !bg-white dark:!bg-slate-900/50
                dark:[&_.ant-picker-input>input]:!text-slate-200 
                dark:[&_.ant-picker-input>input::placeholder]:!text-slate-500
                dark:[&_.ant-picker-separator]:!text-slate-400
                dark:[&_.ant-picker-suffix]:!text-slate-400
                dark:[&_.ant-picker-clear]:!text-slate-400
                dark:[&_.ant-picker-clear]:!bg-slate-800
                transition-all duration-300
                ${props.className ?? ""}
            `}
        />
    );
};

export default SWTDatePickerRange;