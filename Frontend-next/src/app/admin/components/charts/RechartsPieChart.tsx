import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/src/context/ThemeContext';

type PieChartData = Record<string, any>;
interface RechartsPieChartProps {
  data: PieChartData[];
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = ['#00f0ff', '#ff007f', '#b026ff', '#fcd34d', '#34d399', '#f87171']; // Neon palette

export default function RechartsPieChart({ data, colors = DEFAULT_COLORS, height = 300 }: RechartsPieChartProps) {
  const { isDark } = useTheme();

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              color: isDark ? '#F1F5F9' : '#1E293B'
            }}
            itemStyle={{ color: isDark ? '#F1F5F9' : '#1E293B', fontWeight: 'bold' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
