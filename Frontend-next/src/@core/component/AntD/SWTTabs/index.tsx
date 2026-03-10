import { Tabs, TabsProps } from "antd";
import SWTBadge, { BadgeColor, BadgeSize, BadgeVariant } from "../../SWTBadge";

type SWTTabsProps = Omit<TabsProps, "items"> & {
  items: SWTTabItemsProps;
};

export type SWTPrefixProps = {
  value: number;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
};

type AntTabItemType = NonNullable<TabsProps["items"]>[number];

type SWTTabItemsProps = Array<
  AntTabItemType & {
    prefix?: SWTPrefixProps;
    permission?: boolean;
  }
>;

const SWTTabs = ({ ...props }: SWTTabsProps) => {
  const filteredItems = props.items?.filter((item) => {
    if (item.permission === undefined) return true;
    return item.permission === true;
  });

  const renderItems = (): TabsProps["items"] => {
    return filteredItems.map((item, index) => ({
      ...item,
      label: (
        <span key={index} className="inline-flex items-center gap-2 flex-nowrap">
          <SWTBadge
            variant={item.prefix?.variant ?? "light"}
            color={item.prefix?.color ?? "primary"}
            size={item.prefix?.size ?? 'sm'}
          >
            {item.prefix?.value}
          </SWTBadge>
          <span className="truncate">{item.label}</span>
        </span>
      ),
    }));
  };

  return (
    <Tabs
      defaultActiveKey={props?.defaultActiveKey}
      activeKey={props?.activeKey}
      items={renderItems()}
      onChange={props?.onChange}
    />
  );
};

export default SWTTabs;
