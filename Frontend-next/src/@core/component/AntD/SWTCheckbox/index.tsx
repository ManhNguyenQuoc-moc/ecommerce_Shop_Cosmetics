"use client";

import { Checkbox, CheckboxProps } from "antd";

export type SWTCheckboxProps = CheckboxProps & {
    classNames?: string;
};
const SWTCheckbox = ({ ...props }: SWTCheckboxProps) => {
  return <Checkbox {...props}
    className={props?.classNames}
    style={props?.style}
    disabled={ props?.disabled ?? false }
    defaultChecked={props?.defaultChecked ?? false}
  >
  </Checkbox>;
};
export default SWTCheckbox;
