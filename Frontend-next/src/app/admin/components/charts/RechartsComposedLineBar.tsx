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

interface ComposedChartData {
  [key: string]: string | number;
}

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
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            dx={-10}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            dx={10}
          />
          <Tooltip 
            cursor={{ fill: '#F1F5F9' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
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
