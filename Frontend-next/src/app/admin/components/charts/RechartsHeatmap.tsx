import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

interface RechartsHeatmapProps {
  data: HeatmapData[];
  height?: number;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function RechartsHeatmap({
  data,
  height = 350
}: RechartsHeatmapProps) {
  // Normalize data for scatter
  const scatterData = data.map(d => ({
    x: d.hour,
    y: DAYS.indexOf(d.day),
    z: d.value
  }));

  const getColor = (value: number) => {
    const max = Math.max(...data.map(d => d.value), 1);
    const ratio = value / max;
    // Simple transition from light to dark brand color
    if (ratio > 0.8) return '#7c3aed';
    if (ratio > 0.6) return '#8b5cf6';
    if (ratio > 0.4) return '#a78bfa';
    if (ratio > 0.2) return '#c4b5fd';
    return '#ddd6fe';
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={[0, 23]} 
            name="Giờ" 
            unit="h" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 10 }}
            ticks={HOURS}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            domain={[0, 6]} 
            name="Ngày" 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => DAYS[val]?.substring(0, 3)}
            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }}
            ticks={[0, 1, 2, 3, 4, 5, 6]}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(val, name) => [val, name === 'z' ? 'Số đơn' : name]}
          />
          <Scatter data={scatterData}>
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
