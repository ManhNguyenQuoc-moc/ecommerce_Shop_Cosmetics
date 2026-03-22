"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MonthlySalesDTO } from "@/src/services/models/admin/dashboard.dto";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Props {
  data: MonthlySalesDTO[];
}

export default function MonthlySalesChart({ data }: Props) {
  const options: ApexOptions = {
    colors: ["#ec4899", "#3b82f6"], // brand-500 equivalent and blue
    chart: {
      fontFamily: "inherit",
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.map((d) => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    yaxis: {
      title: { text: "Doanh thu" },
      labels: {
        formatter: (val) => {
          if (val >= 1000000) return `${(val / 1000000).toFixed(0)} Tr`;
          return `${val}`;
        }
      }
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)} Triệu VNĐ`;
            return `${val} đơn`;
        },
      },
    },
  };
  
  const series = [
    {
      name: "Doanh thu (VNĐ)",
      data: data.map((d) => d.revenue),
    },
    {
      name: "Số đơn hàng",
      data: data.map((d) => d.sales),
    }
  ];

  return (
    <div className="w-full">
      <div className="-ml-2 min-w-[650px] xl:min-w-full pl-2">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      </div>
    </div>
  );
}
