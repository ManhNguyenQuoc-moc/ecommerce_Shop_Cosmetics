"use client";
import { DatePicker, DatePickerProps } from "antd";

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

export default SWTDatePicker;