"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Info, ShoppingCart, Star, AlertTriangle } from "lucide-react";
import { Dropdown, Badge, List, Button, Empty, ConfigProvider, theme } from "antd";
import { getNotifications, markAsRead, markAllAsRead } from "@/src/services/admin/notification/notification.service";
import { useSocket } from "@/src/@core/hooks/useSocket";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { useTheme } from "@/src/context/ThemeContext";

const typeInfo: Record<string, { icon: any, color: string }> = {
  NEW_ORDER: { icon: <ShoppingCart size={16} />, color: "#6366f1" },
  NEW_REVIEW: { icon: <Star size={16} />, color: "#f59e0b" },
  LOW_STOCK: { icon: <AlertTriangle size={16} />, color: "#ef4444" },
  EXPIRING_PRODUCT: { icon: <AlertTriangle size={16} />, color: "#f97316" },
  SYSTEM: { icon: <Info size={16} />, color: "#3b82f6" },
};

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { on, off } = useSocket(undefined, "admin");
  const { isDark } = useTheme();

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    on("admin_notification", (newNotif: any) => {
      setNotifications(prev => {
        if (prev.some(n => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
    });

    return () => {
      off("admin_notification");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const menuCard = (
    <div className={`w-[350px] shadow-2xl rounded-2xl overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className="p-4 border-b border-inherit flex items-center justify-between">
        <h3 className={`font-bold m-0 ${isDark ? 'text-white' : 'text-slate-800'}`}>Thông báo</h3>
        {unreadCount > 0 && (
          <Button 
            type="text" 
            size="small" 
            onClick={handleMarkAllRead}
            className="text-brand-600 font-bold hover:text-brand-700 p-0 h-auto"
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        <List
          dataSource={notifications}
          locale={{ emptyText: <Empty description="Không có thông báo mới" className="py-8" /> }}
          renderItem={(item) => (
            <div 
              onClick={() => !item.isRead && handleMarkAsRead(item.id)}
              className={`p-4 border-b border-inherit cursor-pointer transition-colors flex gap-3 ${
                !item.isRead 
                  ? (isDark ? 'bg-brand-500/5 hover:bg-brand-500/10' : 'bg-brand-50/50 hover:bg-brand-50') 
                  : (isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50')
              }`}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: typeInfo[item.type]?.color + '20', color: typeInfo[item.type]?.color }}
              >
                {typeInfo[item.type]?.icon || <Info size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.type.replace('_', ' ')}
                  </span>
                  {!item.isRead && <span className="w-2 h-2 bg-brand-500 rounded-full" />}
                </div>
                <h4 className={`text-sm font-bold truncate mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.title}</h4>
                <p className={`text-xs leading-relaxed mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.content}</p>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(item.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          )}
        />
      </div>
      
      <div className="p-3 text-center border-t border-inherit">
        <Button type="text" className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-brand-500">
          Xem tất cả lịch sử nhật ký
        </Button>
      </div>
    </div>
  );

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Dropdown popupRender={() => menuCard} trigger={['click']} placement="bottomRight" arrow>
        <div className="relative cursor-pointer group">
          <Badge count={unreadCount} offset={[-2, 6]} size="small" color="#f43f5e">
            <SWTIconButton
              icon={<Bell size={20} />}
              className="p-2.5 rounded-xl text-text-sub hover:bg-bg-muted dark:hover:bg-white/5 dark:hover:text-white transition-colors"
            />
          </Badge>
        </div>
      </Dropdown>
    </ConfigProvider>
  );
}
