import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, MessageSquare, Shield, User, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    name: string;
    phone?: string;
    role: 'farmer' | 'consumer';
    farmName?: string;
    location?: string;
  } | null;
  orderId?: string;
  orderNumber?: string;
  cropName?: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  orderId,
  orderNumber,
  cropName,
}) => {
  const { currentUser, userRole, chatMessages, sendChatMessage } = useStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const threadMessages = chatMessages.filter(
    (m) =>
      ((m.senderId === currentUser?.id && m.receiverId === targetUser?.id) ||
        (m.senderId === targetUser?.id && m.receiverId === currentUser?.id)) &&
      (!orderId || m.orderId === orderId || !m.orderId)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages, isOpen]);

  if (!isOpen || !targetUser || !currentUser) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(targetUser.id, inputText, orderId, cropName);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col h-[560px] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-800 border border-forest-700 flex items-center justify-center font-bold text-forest-200">
              {targetUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{targetUser.name}</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-forest-700 text-forest-200">
                  {targetUser.role}
                </span>
              </div>
              <p className="text-xs text-forest-300">
                {targetUser.farmName || targetUser.location || 'Verified Member'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Call option: Protected display where appropriate */}
            {targetUser.phone && (
              <a
                href={`tel:${targetUser.phone}`}
                className="p-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-forest-100 transition flex items-center gap-1.5 text-xs font-medium"
                title={`Call ${targetUser.name}`}
              >
                <Phone className="w-3.5 h-3.5 text-forest-300" />
                <span className="hidden sm:inline">Call</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-forest-800/80 hover:bg-forest-700 text-forest-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order / Crop Context Pill */}
        {(orderNumber || cropName) && (
          <div className="bg-forest-50 px-4 py-2 border-b border-forest-100 text-xs text-forest-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Context:</span>
              {orderNumber && (
                <span className="bg-white px-2 py-0.5 rounded border border-forest-200 font-mono text-[11px]">
                  Order #{orderNumber}
                </span>
              )}
              {cropName && (
                <span className="bg-white px-2 py-0.5 rounded border border-forest-200 font-medium">
                  {cropName}
                </span>
              )}
            </div>
            <span className="text-[10px] text-forest-700 flex items-center gap-1">
              <Shield className="w-3 h-3 text-forest-600" /> Safe In-App Channel
            </span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          <div className="text-center my-2">
            <span className="text-[10px] text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
              Direct Farmer-Consumer Communication • Keep discussions professional
            </span>
          </div>

          {threadMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No previous messages in this thread.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Say hello or ask questions regarding crop harvesting, packing, or delivery instructions!
              </p>
            </div>
          ) : (
            threadMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-slate-500">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-forest-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder={`Message ${targetUser.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-forest-600 hover:bg-forest-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

