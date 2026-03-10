"use client"
import { Tooltip, TooltipProps } from "antd";
export type SWTTooltipProps = TooltipProps & {
    classNames?: string;
    placement?: string;
    color?: string;
    style?: React.CSSProperties;
};

const SWTTooltip = ({ ...props }: SWTTooltipProps) => {
    return <Tooltip {...props}
        className={props?.classNames}
        placement={props.placement}
        color={props.color}
        style={props?.style}
    />;
};

export default SWTTooltip;