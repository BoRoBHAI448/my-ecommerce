"use client";

import { useState } from "react";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/format";

export function ReviewsSection({ reviews = [], rating = 5.0, count = 0 }) {
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
  }

  const sampleReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      author: "Tanvir Ahmed",
      rating: 5,
      date: "2026-09-15",
      verified: true,
      comment: "Exceptional quality fabric and immaculate stitching. The fit matches true to size and arrived in Dhaka within 24 hours.",
    },
    {
      id: 2,
      author: "Farhana Yasmin",
      rating: 5,
      date: "2026-09-28",
      verified: true,
      comment: "Colors are exactly as pictured on the site. Packaging felt very luxurious. Will definitely order again!",
    },
  ];

  return (
    <div className="py-8 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-text">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <Rating value={rating} size="md" />
            <span className="text-xs text-text-muted">
              Based on {count || sampleReviews.length} verified ratings
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          leftIcon={<MessageSquare className="w-4 h-4" />}
        >
          {showForm ? "Cancel Review" : "Write a Review"}
        </Button>
      </div>

      {submitted && (
        <div className="p-4 rounded-theme bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-6 animate-in fade-in">
          Thank you for your feedback! Your review has been submitted and will appear once approved by our moderation team.
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-theme bg-muted/40 border border-border space-y-4 mb-8">
          <h4 className="text-sm font-bold text-text">Submit Your Feedback</h4>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Your Rating:</label>
            <Rating value={userRating} interactive onChange={setUserRating} size="lg" />
          </div>

          <Input
            label="Your Name"
            placeholder="e.g. Mahfuz Khan"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
              Review Comment
            </label>
            <textarea
              rows={3}
              placeholder="What did you like or dislike about this product?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full p-3 rounded-theme border border-border bg-surface text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button type="submit" variant="primary" size="md">
            Submit Review
          </Button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {sampleReviews.map((rev) => (
          <div key={rev.id} className="p-4 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-text">{rev.author}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-[11px] text-text-muted">{formatDate(rev.date)}</span>
            </div>

            <Rating value={rev.rating} size="sm" />

            <p className="text-xs text-text leading-relaxed pt-1">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
