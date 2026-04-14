import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

interface RechartsRadarChartProps {
  data: RadarData[];
  name: string;
  color: string;
  height?: number;
}

export default function RechartsRadarChart({ 
  data, 
  name, 
  color, 
  height = 300 
}: RechartsRadarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748B', fontSize: 12 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name={name}
            dataKey="A"
            stroke={color}
            fill={color}
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }} 
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
