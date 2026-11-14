import React, { useState } from 'react';
import { X, Star, ThumbsUp, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, order }) => {
  const { addReview } = useStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  if (!isOpen || !order) return null;

  const currentProductId = selectedProductId || order.items[0]?.productId || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      orderId: order.id,
      productId: currentProductId,
      farmerId: order.farmerId,
      rating,
      comment: comment.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Rate & Review Produce</h3>
              <p className="text-xs text-forest-300">Order #{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-forest-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Crop to Review
            </label>
            <select
              value={currentProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
            >
              {order.items.map((item) => (
                <option key={item.productId} value={item.productId}>
                  {item.cropName} ({item.quantity} {item.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600 mb-2 font-medium">
              How was the freshness & quality from <span className="font-semibold text-forest-800">{order.farmerName}</span>?
            </p>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-hidden transition transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-amber-700 mt-1">
              {rating === 5 && '🌟 Exceptional Freshness & Taste'}
              {rating === 4 && '👍 Very Good Quality'}
              {rating === 3 && '👌 Satisfactory Produce'}
              {rating === 2 && '⚠️ Average / Disappointed'}
              {rating === 1 && '❌ Poor Quality'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Share Feedback / Verified Purchase Review
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the aroma, texture, packing, and overall experience..."
              required
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-forest-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="px-5 py-2 bg-forest-600 hover:bg-forest-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

