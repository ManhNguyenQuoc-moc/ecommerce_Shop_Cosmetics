"use client";
import { InputNumber, InputNumberProps } from "antd";

export type SWTInputNumberProps = InputNumberProps & {
  classNames?: string; 
  mode?: "spinner" | "input"; 
};

const SWTInputNumber = ({
  classNames,
  defaultValue = 0,
  min = 0,
  max = 1000000000,
  size = "middle",
  variant = "outlined",
  style,
  ...restProps 
}: SWTInputNumberProps) => {
  return (
    <InputNumber
      {...restProps}
      classNames={classNames}
      defaultValue={defaultValue}
      min={min}
      max={max}
      size={size}
      variant={variant}
      style={{ width: 100, ...style }}
      className={`h-11 flex items-center [&_.ant-input-number-input]:h-11 ${restProps.className || ""}`}
    />
  );
};

export default SWTInputNumber;