import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { useTheme } from '@/src/context/ThemeContext';

type AreaData = Record<string, any>;

interface RechartsAreaChartProps {
  data: AreaData[];
  xAxisKey: string;
  areas: {
    key: string;
    name: string;
    color: string;
  }[];
  height?: number;
  showAverage?: boolean;
}

export default function RechartsAreaChart({
  data,
  xAxisKey,
  areas,
  height = 300,
  showAverage = false
}: RechartsAreaChartProps) {
  const { isDark } = useTheme();
  const textColor = isDark ? "#94A3B8" : "#64748B";

  const averageValue = showAverage && data.length > 0 
    ? data.reduce((acc, curr) => acc + (curr[areas[0].key] || 0), 0) / data.length 
    : 0;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {areas.map((area) => (
              <linearGradient key={`gradient-${area.key}`} id={`color-${area.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={area.color} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1E293B" : "#E2E8F0"} />
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              color: isDark ? '#F1F5F9' : '#1E293B'
            }}
            itemStyle={{ color: isDark ? '#F1F5F9' : '#1E293B' }}
            labelStyle={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 'bold' }}
          />
          <Legend />
          {showAverage && (
            <ReferenceLine 
              y={averageValue} 
              label={{ position: 'right', value: 'Avg', fill: isDark ? '#94A3B8' : '#94a3b8', fontSize: 10 }} 
              stroke="#94a3b8" 
              strokeDasharray="3 3" 
            />
          )}
          {areas.map((area) => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              stroke={area.color}
              fillOpacity={1}
              fill={`url(#color-${area.key})`}
              stackId="1"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
