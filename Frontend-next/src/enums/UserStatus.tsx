import SWTStatusTag from "@/src/@core/component/SWTStatusTag";
import { UserStatusType } from "@/src/enums/user.enum";
import { getStatusLabel } from "@/src/enums/status-config";

interface Props {
  className?: string;
  status: UserStatusType;
}

export default function UserStatusTag({ status, className }: Props) {
  const label = getStatusLabel(status);

  return (
    <SWTStatusTag
      status={status}
      label={label}
      className={className}
    />
  );
}