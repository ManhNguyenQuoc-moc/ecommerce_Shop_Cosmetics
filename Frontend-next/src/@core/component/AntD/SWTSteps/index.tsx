import { Steps, StepsProps } from "antd";

type SWTStepsProps = StepsProps & {
  className?: string;
};

const SWTSteps = ({ className = "", ...props }: SWTStepsProps) => {
  return (
    <Steps
      {...props}
      className={`
        custom-swt-steps
        /* Title and Description theme colors */
        [&_.ant-steps-item-title]:!text-slate-500
        dark:[&_.ant-steps-item-title]:!text-slate-400
        
        /* Active State */
        [&_.ant-steps-item-active_.ant-steps-item-title]:!text-brand-500 
        [&_.ant-steps-item-active_.ant-steps-item-icon]:!bg-brand-500
        [&_.ant-steps-item-active_.ant-steps-item-icon]:!border-brand-500
        [&_.ant-steps-item-active_.ant-steps-item-icon_.ant-steps-icon]:!text-white
        
        /* Finish State */
        [&_.ant-steps-item-finish_.ant-steps-item-icon]:!bg-brand-500 
        [&_.ant-steps-item-finish_.ant-steps-item-icon]:!border-brand-500
        [&_.ant-steps-item-finish_.ant-steps-item-icon_.ant-steps-icon]:!text-white
        [&_.ant-steps-item-finish_.ant-steps-item-title]:!text-slate-900
        dark:[&_.ant-steps-item-finish_.ant-steps-item-title]:!text-slate-100
        [&_.ant-steps-item-finish_.ant-steps-item-title]:after:!bg-brand-500
        
        /* Tail (line) between steps */
        [&_.ant-steps-item-tail]:after:!bg-slate-200
        dark:[&_.ant-steps-item-tail]:after:!bg-slate-800
        [&_.ant-steps-item-finish_.ant-steps-item-tail]:after:!bg-brand-500
        
        ${className}
      `}
    />
  );
};

export default SWTSteps;
