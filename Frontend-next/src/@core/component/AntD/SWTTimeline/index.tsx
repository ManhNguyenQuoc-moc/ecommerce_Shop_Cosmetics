"use client";

import { Timeline, TimelineProps } from "antd";
import React from "react";

export type SWTTimelineProps = TimelineProps & {
  className?: string;
};

const SWTTimeline = ({ className = "", ...props }: SWTTimelineProps) => {
  return (
    <Timeline
      {...props}
      className={`
        custom-swt-timeline
        /* Tail styles */
        [&_.ant-timeline-item-tail]:!border-slate-200
        dark:[&_.ant-timeline-item-tail]:!border-slate-800
        
        /* Content text */
        [&_.ant-timeline-item-content]:!text-slate-600
        dark:[&_.ant-timeline-item-content]:!text-slate-400
        
        ${className}
      `}
    />
  );
};

export default SWTTimeline;
