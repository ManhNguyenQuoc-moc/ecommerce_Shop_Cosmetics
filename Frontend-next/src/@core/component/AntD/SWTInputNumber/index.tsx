"use client";
import { InputNumber, InputNumberProps } from "antd";

export type SWTInputNumberProps = InputNumberProps & {
  classNames?: string; 
  mode?: "spinner" | "input"; 
};

const SWTInputNumber = ({
  classNames,
  defaultValue = 0,
  min = 1,
  max = 1000,
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
    />
  );
};

export default SWTInputNumber;