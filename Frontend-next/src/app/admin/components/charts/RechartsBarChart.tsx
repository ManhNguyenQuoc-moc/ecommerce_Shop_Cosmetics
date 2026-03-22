import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface BarChartData {
  [key: string]: string | number;
}

interface RechartsBarChartProps {
  data: BarChartData[];
  xAxisKey: string;
  bars: {
    key: string;
    name: string;
    color: string;
  }[];
  height?: number;
}

export default function RechartsBarChart({ data, xAxisKey, bars, height = 300 }: RechartsBarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
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
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: '#F1F5F9' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {bars.map((bar, index) => (
            <Bar 
              key={bar.key} 
              dataKey={bar.key} 
              name={bar.name} 
              fill={bar.color} 
              radius={[4, 4, 0, 0]} 
              barSize={index === 0 && bars.length === 1 ? 40 : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
