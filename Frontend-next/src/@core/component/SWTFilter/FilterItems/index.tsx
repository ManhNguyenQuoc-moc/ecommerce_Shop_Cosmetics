import clsx from "clsx";
import { FilterProps } from "..";
import SWTDatePicker from "../../AntD/SWTDatePicker";
import SWTFormItem from "../../AntD/SWTFormItem";
import SWTInput from "../../AntD/SWTInput";
import SWTSelect from "../../AntD/SWTSelect";
import SWTSearchEngineIcon from "../../SWTIcon/iconoir/search-engine";

type FilterItemsProps = {
  filterItems: FilterProps[];
};

const FilterItems = ({ filterItems }: FilterItemsProps) => {
  return filterItems.map((item: any, index: number) => {
    switch (item.type) {
      case "keyword":
        return (
          <SWTFormItem
            className={item?.className ?? ""}
            name={item.key}
            key={item?.key}
            rules={item?.rules ?? []}
          >
            <SWTInput
              showCount={item?.showCount ?? true}
              allowClear={item?.allowClear ?? true}
              label={`${item?.title.toLowerCase()}`}
              className={item?.className ?? ""}
              prefix={<SWTSearchEngineIcon />}
            />
          </SWTFormItem>
        );
      case "multiSelect":
        return (
          <SWTFormItem
            rules={item?.rules ?? []}
            className={clsx(item?.className) ?? ""}
            name={item.key}
            key={item?.key}
          >
            <SWTSelect
              mode="multiple"
              className="h-[48px]!"
              label={item?.title ?? ""}
              options={item?.options ?? []}
              allowClear={item?.allowClear ?? true}
            />
          </SWTFormItem>
        );
      case "singleSelect":
        return (
          <SWTFormItem
            rules={item?.rules ?? []}
            className={clsx(item?.className) ?? ""}
            name={item.key}
            key={item?.key}
          >
            <SWTSelect
              className="h-[48px]!"
              label={item?.title ?? ""}
              options={item?.options ?? []}
              allowClear={item?.allowClear ?? true}
            />
          </SWTFormItem>
        );
      case "dateTimePicker":
        return (
          <SWTFormItem
            rules={item?.rules ?? []}
            className={item?.className ?? ""}
            name={item.key}
            key={item?.key}
          >
            <SWTDatePicker label={item?.title ?? ""} />
          </SWTFormItem>
        );
    }
  });
};

export default FilterItems;
