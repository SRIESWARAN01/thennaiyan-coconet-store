"use client";

import { useState, useTransition } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";

async function submitReviewAction(data: { productId: string; orderId: string; rating: number; title: string; body: string }) {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export function ReviewForm({ productId, orderId }: { productId: string; orderId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (rating === 0) { setError("Please select a rating."); return; }
    setError("");
    startTransition(async () => {
      const result = await submitReviewAction({ productId, orderId, rating, title, body });
      if (result.error) setError(result.error);
      else setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-[#356f3b]">
        <CheckCircle2 size={16} />
        <span className="font-body text-sm font-semibold">Review submitted — pending approval.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[1,2,3,4,5].map((s) => (
          <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}>
            <Star size={22} className={(hovered || rating) >= s ? "text-yellow-500 fill-yellow-400" : "text-gray-300"} />
          </button>
        ))}
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
        className="w-full border border-[#d0d5dd] rounded-[6px] px-3 py-2 font-body text-sm outline-none focus:border-[#356f3b]" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your review (optional)" rows={3}
        className="w-full border border-[#d0d5dd] rounded-[6px] px-3 py-2 font-body text-sm outline-none focus:border-[#356f3b] resize-none" />
      {error && <p className="font-body text-xs text-red-600">{error}</p>}
      <button onClick={submit} disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#356f3b] px-4 py-2 font-body text-sm font-bold text-white disabled:opacity-60">
        {isPending && <Loader2 size={13} className="animate-spin" />} Submit review
      </button>
    </div>
  );
}
