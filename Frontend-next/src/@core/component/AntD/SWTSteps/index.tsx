import { Steps, StepsProps } from "antd";
import React from "react";

type SWTStepsProps = StepsProps & {
  sizeVariant?: "sm" | "md" | "lg";
  className?: string;
};

const sizeStyles = {
  sm: "[&_.ant-steps-item-icon]:!w-10 [&_.ant-steps-item-icon]:!h-10 [&_.ant-steps-item-icon]:!leading-[38px] [&_.ant-steps-item-icon_.ant-steps-icon]:!text-[16px] [&_.ant-steps-item-title]:!text-[12px]",
  md: "[&_.ant-steps-item-icon]:!w-12 [&_.ant-steps-item-icon]:!h-12 [&_.ant-steps-item-icon]:!leading-[44px] [&_.ant-steps-item-icon_.ant-steps-icon]:!text-[20px] [&_.ant-steps-item-title]:!text-[13px]",
  lg: "[&_.ant-steps-item-icon]:!w-14 [&_.ant-steps-item-icon]:!h-14 [&_.ant-steps-item-icon]:!leading-[52px] [&_.ant-steps-item-icon_.ant-steps-icon]:!text-[24px] [&_.ant-steps-item-title]:!text-[15px]",
};

const SWTSteps = ({
  className = "",
  sizeVariant = "lg",
  direction = "horizontal",
  ...props
}: SWTStepsProps) => {
  const isVertical = direction === "vertical";

  return (
    <Steps
      {...props}
      direction={direction}
      className={`
        custom-swt-steps
        ${sizeStyles[sizeVariant]}

        /* Alignment & Vertical Centering */
        ${!isVertical ? `
          [&_.ant-steps-item-container]:!flex
          [&_.ant-steps-item-container]:!items-center
          [&_.ant-steps-item-section]:!flex
          [&_.ant-steps-item-section]:!items-center
          [&_.ant-steps-item-header]:!flex
          [&_.ant-steps-item-header]:!items-center
          [&_.ant-steps-item-header]:!mb-0
          [&_.ant-steps-item-content]:!flex
          [&_.ant-steps-item-content]:!items-center
          [&_.ant-steps-item-title]:!flex
          [&_.ant-steps-item-title]:!items-center
          [&_.ant-steps-item-title]:!m-0
          [&_.ant-steps-item-title]:!p-0
          [&_.ant-steps-item-title]:!leading-none
        ` : ""}

        /* Icon Base Styles */
        [&_.ant-steps-item-icon]:!flex
        [&_.ant-steps-item-icon]:!items-center
        [&_.ant-steps-item-icon]:!justify-center
        [&_.ant-steps-item-icon]:!font-black
        [&_.ant-steps-item-icon]:!border-[3px]
        [&_.ant-steps-item-icon]:!transition-all
        [&_.ant-steps-item-icon]:!flex-shrink-0
        [&_.ant-steps-item-icon]:!m-0
        [&_.ant-steps-item-icon]:!mr-4

        /* Icon (Tick) internal styles */
        [&_.ant-steps-icon]:!flex
        [&_.ant-steps-icon]:!items-center
        [&_.ant-steps-icon]:!justify-center
        [&_.ant-steps-icon_svg]:!w-full
        [&_.ant-steps-icon_svg]:!h-full
        [&_.ant-steps-icon_svg]:!p-[25%]
        [&_.ant-steps-icon_svg]:!stroke-[4]

        /* Title Typography */
        [&_.ant-steps-item-title]:!font-black
        [&_.ant-steps-item-title]:!uppercase
        [&_.ant-steps-item-title]:!tracking-tight
        [&_.ant-steps-item-title]:!text-slate-400
        dark:[&_.ant-steps-item-title]:!text-slate-500

        /* Active */
        [&_.ant-steps-item-active_.ant-steps-item-title]:!text-brand-600 
        dark:[&_.ant-steps-item-active_.ant-steps-item-title]:!text-brand-400
        [&_.ant-steps-item-active_.ant-steps-item-icon]:!bg-brand-500
        [&_.ant-steps-item-active_.ant-steps-item-icon]:!border-brand-500
        [&_.ant-steps-item-active_.ant-steps-item-icon_.ant-steps-icon]:!text-white
        [&_.ant-steps-item-active_.ant-steps-item-icon]:!shadow-[0_0_0_4px_rgba(255,77,148,0.15)]

        /* Finish */
        [&_.ant-steps-item-finish_.ant-steps-item-icon]:!bg-emerald-50 
        [&_.ant-steps-item-finish_.ant-steps-item-icon]:!border-emerald-500
        [&_.ant-steps-item-finish_.ant-steps-item-icon_.ant-steps-icon]:!text-emerald-500
        [&_.ant-steps-item-finish_.ant-steps-item-title]:!text-slate-900
        dark:[&_.ant-steps-item-finish_.ant-steps-item-title]:!text-slate-100
        [&_.ant-steps-item-finish_.ant-steps-item-title]:after:!bg-emerald-500

        /* Wait */
        [&_.ant-steps-item-wait_.ant-steps-item-icon]:!bg-slate-50
        dark:[&_.ant-steps-item-wait_.ant-steps-item-icon]:!bg-slate-800/50
        [&_.ant-steps-item-wait_.ant-steps-item-icon]:!border-slate-200
        dark:[&_.ant-steps-item-wait_.ant-steps-item-icon]:!border-slate-800
        [&_.ant-steps-item-wait_.ant-steps-item-icon_.ant-steps-icon]:!text-slate-400

        /* Tail (line) between steps */
        [&_.ant-steps-item-tail]:!block
        [&_.ant-steps-item-tail]:!top-1/2
        [&_.ant-steps-item-tail]:!-translate-y-1/2
        [&_.ant-steps-item-tail]:after:!bg-slate-100
        dark:[&_.ant-steps-item-tail]:after:!bg-slate-800/50
        [&_.ant-steps-item-tail]:after:!h-[3.5px]
        [&_.ant-steps-item-finish_.ant-steps-item-tail]:after:!bg-emerald-500

        ${className}
      `}
    />
  );
};

export default SWTSteps;
