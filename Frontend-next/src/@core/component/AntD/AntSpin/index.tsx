import { Spin, type SpinProps } from "antd";

export default function AntSpin ({ children, ...props }: SpinProps){

 return <Spin {...props}>{children}</Spin>;

};