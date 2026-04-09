"use client";

import { Spin, SpinProps } from "antd";
import React from "react";

export type SWTSpinProps = SpinProps & {
  children?: React.ReactNode;
};

const SWTSpin = ({ children, ...props }: SWTSpinProps) => {
  return (
    <Spin {...props}>
      {children}
    </Spin>
  );
};

export default SWTSpin;
