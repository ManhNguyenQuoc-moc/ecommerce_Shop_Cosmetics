"use client";
import { DatePicker, DatePickerProps, Space } from "antd";

const { RangePicker } = DatePicker;

export type SWTDatePickerRangeProps = DatePickerProps & {
    label?: string;
};
const SWTDatePickerRange = ({ ...props }: SWTDatePickerRangeProps) => {
    return (
        <Space vertical size={12}>
            <RangePicker
                picker={props?.picker ?? "date"}
                style={props?.style}
                id={{
                    start: 'startInput',
                    end: 'endInput',
                }}
                onFocus={(_, info) => {
                    console.log('Focus:', info.range);
                }}
                onBlur={(_, info) => {
                    console.log('Blur:', info.range);
                }}
            />
        </Space>
    );
};

export default SWTDatePickerRange;