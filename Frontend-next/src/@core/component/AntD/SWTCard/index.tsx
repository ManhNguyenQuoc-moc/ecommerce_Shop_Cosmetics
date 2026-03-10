import { Card, CardProps } from "antd";
import { SWTSkeleton } from "../SWTSkeleton";

type SWTCardProps = CardProps & {
  children: React.ReactNode;
  loading?: boolean;
  height?: string | number | "table";
};

const SWTCard = ({ children, loading, height, ...props }: SWTCardProps) => {
  if (loading && loading === true) {
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
    >
      {children}
    </Card>
  );
};

export default SWTCard;