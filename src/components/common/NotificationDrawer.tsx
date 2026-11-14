import React from 'react';
import {
  X,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  MessageSquare,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Notification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToOrder?: (orderId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToOrder,
}) => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useStore();

  if (!isOpen) return null;

  const userNotifications = notifications.filter(
    (n) => n.userId === (currentUser?.id ?? '')
  );

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_request':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'order_accepted':
        return <CheckCircle className="w-5 h-5 text-forest-600" />;
      case 'order_rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'status_update':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-500">
                  {userNotifications.filter((n) => !n.read).length} unread updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentUser && userNotifications.some((n) => !n.read) && (
                <button
                  onClick={() => markAllNotificationsRead(currentUser.id)}
                  className="text-xs text-forest-700 hover:text-forest-800 font-medium flex items-center gap-1 hover:underline px-2 py-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {userNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  You'll be notified of new purchase requests, approvals, and deliveries here.
                </p>
              </div>
            ) : (
              userNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                    n.read
                      ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      : 'bg-forest-50/60 border-forest-200 text-slate-900 shadow-xs'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-forest-600"></span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {n.relatedOrderId && onNavigateToOrder && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationRead(n.id);
                              onClose();
                              onNavigateToOrder(n.relatedOrderId!);
                            }}
                            className="text-[11px] font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1"
                          >
                            View Order <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

