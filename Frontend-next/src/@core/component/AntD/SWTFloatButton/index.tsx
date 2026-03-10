"use client";
import { FloatButton, FloatButtonProps } from 'antd';
export type SWTFloatButtonProps = FloatButtonProps & {
    className?: string;
    icon?: React.ReactNode;
};
export const SWTFloatButton = ({
    shape = "circle",
    icon,
    className,
    ...props
}: SWTFloatButtonProps) => {
    return <FloatButton className={className} icon={icon} shape={shape} {...props} />;
};

