"use client"
import { Avatar } from "antd";
import type { SWTAvatarProps } from "../SWTAvatar";
import SWTAvatar from "../SWTAvatar";
export type SWTAvatarGroupProps = {
    size?: SWTAvatarProps["size"];
    maxCount?: number;
    shape?: SWTAvatarProps["shape"];
    className?: string;
    avatars: SWTAvatarProps[];
};
const SWTAvatarGroup = ({ avatars, size, shape, maxCount, className, ...props }: SWTAvatarGroupProps) => {
    return (
        <Avatar.Group
            {...props}
            size={size ?? "default"}
            maxCount={maxCount ?? 4}
            className={className}
        >
            {avatars.map((avatarProps, index) => (
                <SWTAvatar
                    key={index}
                    {...avatarProps}
                    size={avatarProps.size ?? size ?? "default"}
                    shape={avatarProps.shape ?? shape ?? "circle"}
                />
            ))}
        </Avatar.Group>
    );
}
export default SWTAvatarGroup;