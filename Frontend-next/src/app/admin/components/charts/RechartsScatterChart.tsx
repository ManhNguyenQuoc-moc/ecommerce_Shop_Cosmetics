import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ScatterData {
  x: number;
  y: number;
  z: number;
  name?: string;
}

interface RechartsScatterChartProps {
  data: ScatterData[];
  xAxisLabel: string;
  yAxisLabel: string;
  color?: string;
  height?: number;
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

export default function RechartsScatterChart({
  data,
  xAxisLabel,
  yAxisLabel,
  color = '#8b5cf6',
  height = 300
}: RechartsScatterChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name={xAxisLabel} 
            unit=" đơn" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={yAxisLabel} 
            unit=" VND" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <ZAxis type="number" dataKey="z" range={[60, 400]} name="Giá trị TB" />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Scatter name="Khách hàng" data={data} fill={color}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
