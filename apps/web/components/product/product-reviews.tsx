'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  user_name?: string;
  created_at: string;
  helpful?: number;
}

interface ProductReviewsProps {
  productId: string;
  avgRating?: number;
  reviewCount?: number;
}

// Mock reviews for demo
const mockReviews: Review[] = [
  {
    id: '1',
    rating: 5,
    title: 'Excellent quality!',
    body: 'The fabric is really soft and the fit is perfect. I ordered size M and it fits exactly as expected. Will definitely buy more colors.',
    user_name: 'Minh A.',
    created_at: '2026-04-28T10:00:00Z',
    helpful: 12,
  },
  {
    id: '2',
    rating: 4,
    title: 'Good value for money',
    body: 'Nice material, comfortable to wear all day. The stitching is solid. Only minor issue is the color is slightly different from the photos.',
    user_name: 'Linh T.',
    created_at: '2026-04-25T14:30:00Z',
    helpful: 8,
  },
  {
    id: '3',
    rating: 5,
    title: 'My new favorite!',
    body: 'This is hands down the best tee I have owned. The organic cotton feels premium and it washes really well without shrinking.',
    user_name: 'Dũng P.',
    created_at: '2026-04-20T09:15:00Z',
    helpful: 15,
  },
];

export function ProductReviews({ productId, avgRating = 0, reviewCount = 0 }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', body: '' });
  const [submitted, setSubmitted] = useState(false);

  const displayRating = avgRating || (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length);
  const displayCount = reviewCount || reviews.length;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowWriteReview(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-900">{displayRating.toFixed(1)}</p>
          <div className="flex justify-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-5 w-5',
                  star <= Math.round(displayRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-200'
                )}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{displayCount} reviews</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-right text-gray-500">{star}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-gray-400 text-xs">{count}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowWriteReview(!showWriteReview)}
          className="btn-secondary gap-2 shrink-0"
        >
          <MessageSquare className="h-4 w-4" />
          Write a Review
        </button>
      </div>

      {/* Write review form */}
      {showWriteReview && (
        <form onSubmit={handleSubmitReview} className="card space-y-4">
          <h3 className="font-bold">Write Your Review</h3>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview((r) => ({ ...r, rating: star }))}
                  className="p-0.5"
                >
                  <Star
                    className={cn(
                      'h-6 w-6 transition-colors',
                      star <= newReview.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200 hover:text-amber-200'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview((r) => ({ ...r, title: e.target.value }))}
              className="input-field"
              placeholder="Summarize your review"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Review</label>
            <textarea
              value={newReview.body}
              onChange={(e) => setNewReview((r) => ({ ...r, body: e.target.value }))}
              className="input-field min-h-[100px] resize-y"
              placeholder="What did you like or dislike?"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">Submit Review</button>
            <button type="button" onClick={() => setShowWriteReview(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          Thank you for your review! It will be visible after moderation.
        </div>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-4 w-4',
                          star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                        )}
                      />
                    ))}
                  </div>
                  {review.title && (
                    <span className="font-semibold text-sm">{review.title}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {review.user_name || 'Anonymous'} · {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              {review.helpful !== undefined && (
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-600">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {review.helpful}
                </button>
              )}
            </div>
            {review.body && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.body}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
