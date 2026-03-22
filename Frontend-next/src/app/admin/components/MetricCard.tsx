import { TrendingUp, TrendingDown } from "lucide-react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend: number;
  isUp: boolean;
}

export default function MetricCard({ title, value, icon: Icon, trend, isUp }: MetricCardProps) {
  return (
    <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:!shadow-xl transition-all duration-300 !rounded-2xl !border !border-slate-100 dark:!border-pink-500/20 !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl" bodyClassName="!p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-pink-400 rounded-xl mb-4 dark:shadow-[inset_0_0_10px_rgba(255,0,128,0.2)] border border-brand-200 dark:border-pink-500/30">
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{value}</h4>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 block uppercase tracking-wider">{title}</span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full border dark:shadow-[0_0_10px_currentColor] ${isUp ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30" : "bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/30"}`}>
          {isUp ? <TrendingUp size={16} strokeWidth={2.5} /> : <TrendingDown size={16} strokeWidth={2.5} />}
          {trend}%
        </div>
      </div>
    </SWTCard>
  );
}
