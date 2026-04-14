import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { useTheme } from '@/src/context/ThemeContext';

type BarChartData = Record<string, any>;

const CustomLabel = (props: any) => {
  const { x, y, value, isDark } = props;
  return (
    <text 
      x={x} 
      y={y - 8} 
      fill={isDark ? "#94A3B8" : "#64748B"} 
      fontSize={12} 
      fontWeight="500"
      textAnchor="start"
    >
      {value}
    </text>
  );
};

interface RechartsBarChartProps {
  data: BarChartData[];
  xAxisKey: string;
  bars: {
    key: string;
    name: string;
    color: string;
    stackId?: string;
  }[];
  height?: number;
  cellColors?: string[];
  layout?: 'horizontal' | 'vertical';
  showLabelOnTop?: boolean;
  showGrid?: boolean;
}

export default function RechartsBarChart({ 
  data, 
  xAxisKey, 
  bars, 
  height = 300, 
  cellColors,
  layout = 'horizontal',
  showLabelOnTop = false,
  showGrid = true
}: RechartsBarChartProps) {
  const isVertical = layout === 'vertical';
  const { isDark } = useTheme();
  
  const textColor = isDark ? "#94A3B8" : "#64748B";

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout={layout}
          margin={{ 
            top: showLabelOnTop ? 30 : 20, 
            right: 30, 
            left: (isVertical && !showLabelOnTop) ? 100 : 20, 
            bottom: 5 
          }}
          barGap={showLabelOnTop ? 20 : 4}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1E293B" : "#E2E8F0"} />}
          <XAxis 
            type={isVertical ? "number" : "category"}
            dataKey={isVertical ? undefined : xAxisKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 11 }}
            dy={isVertical ? 0 : 10}
            tickFormatter={!isVertical ? (value) => value.length > 20 ? `${value.substring(0, 20)}...` : value : undefined}
          />
          <YAxis 
            type={isVertical ? "category" : "number"}
            dataKey={isVertical ? xAxisKey : undefined}
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 11 }}
            dx={isVertical ? -10 : -10}
            width={isVertical ? (showLabelOnTop ? 0 : 120) : 60}
            hide={showLabelOnTop && isVertical}
          />
          <Tooltip 
            cursor={false}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              color: isDark ? '#F1F5F9' : '#1E293B'
            }}
            itemStyle={{ color: isDark ? '#F1F5F9' : '#1E293B' }}
            labelStyle={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {bars.map((bar, index) => (
            <Bar 
              key={bar.key} 
              dataKey={bar.key} 
              name={bar.name} 
              fill={bar.color} 
              stackId={bar.stackId}
              radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]} 
              barSize={isVertical ? 24 : (index === 0 && bars.length === 1 ? 40 : undefined)}
            >
              {showLabelOnTop && isVertical && (
                <LabelList dataKey={xAxisKey} content={<CustomLabel isDark={isDark} />} />
              )}
              {cellColors && data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={cellColors[idx % cellColors.length]} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
