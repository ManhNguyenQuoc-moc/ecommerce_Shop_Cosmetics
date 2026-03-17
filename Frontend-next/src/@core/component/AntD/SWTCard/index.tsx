import { Card, CardProps } from "antd";
import { SWTSkeleton } from "../SWTSkeleton";

type SWTCardProps = CardProps & {
  children: React.ReactNode;
  loading?: boolean;
  height?: string | number | "table";
  bodyClassName?: string;
};

const SWTCard = ({
  children,
  loading,
  height,
  bodyClassName,
  ...props
}: SWTCardProps) => {

  if (loading) {
    return (
      <SWTSkeleton.Node
        loading={loading}
        className="w-full mt-3"
        height={height}
      />
    );
  }

  return (
    <Card
      {...props}
      variant="borderless"
      bodyStyle={{ padding: 0 }}
      classNames={{
        body: bodyClassName,
      }}
    >
      {children}
    </Card>
  );
};

export default SWTCard;