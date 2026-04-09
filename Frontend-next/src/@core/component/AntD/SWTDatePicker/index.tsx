"use client";
import { DatePicker, DatePickerProps, GetProps } from "antd";

export type SWTDatePickerProps = DatePickerProps & {
    label?: string;
};

const SWTDatePicker = ({ ...props }: SWTDatePickerProps) => {
    return (
        <DatePicker
            {...props}
            placeholder={
                props?.label !== undefined && props?.label !== null
                    ? "Chọn " + props?.label.toLowerCase()
                    : "Chọn dữ liệu"
            }
            onChange={(date, dateString) => {
                props?.onChange?.(date, dateString);
            }}
            picker={props?.picker ?? "date"}
        />
    );
};

export type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

export const SWTDateRangePicker = (props: RangePickerProps) => {
    return (
        <DatePicker.RangePicker
            {...props}
            className={`h-11 rounded-xl ${props.className || ""}`}
        />
    );
};

export default SWTDatePicker;