import SWTStatustag from "@/src/@core/component/SWTStatusTag";

const is_banned = {
    true: "BANNED",
    false: "ACTIVE"
} as const;

export type UserStatusType = typeof is_banned[keyof typeof is_banned];

interface Props {
  className?: string;
  status: UserStatusType;
}
export default function UserStatusTag({ status, className }: Props) {
  const getLabel = () => {
    if (status === "ACTIVE") return "Đang hoạt động";
    if (status === "BANNED") return "Bị khóa";
    return status;
  };

  return (
    <SWTStatustag
      status={status}
      label={getLabel()}
      className={className}
    />
  );
}