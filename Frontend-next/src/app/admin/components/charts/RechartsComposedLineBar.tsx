import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/src/context/ThemeContext';

type ComposedChartData = Record<string, any>;
interface RechartsComposedLineBarProps {
  data: ComposedChartData[];
  xAxisKey: string;
  barKey: string;
  barName: string;
  barColor: string;
  lineKey: string;
  lineName: string;
  lineColor: string;
  height?: number;
}

export default function RechartsComposedLineBar({
  data,
  xAxisKey,
  barKey,
  barName,
  barColor,
  lineKey,
  lineName,
  lineColor,
  height = 300
}: RechartsComposedLineBarProps) {
  const { isDark } = useTheme();
  const textColor = isDark ? "#94A3B8" : "#64748B";

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1E293B" : "#E2E8F0"} />
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            dx={-10}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            dx={10}
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
          <Bar 
            yAxisId="left" 
            dataKey={barKey} 
            name={barName} 
            barSize={40} 
            fill={barColor} 
            radius={[4, 4, 0, 0]} 
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey={lineKey} 
            name={lineName} 
            stroke={lineColor} 
            strokeWidth={3} 
            dot={{ r: 4, fill: lineColor, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
