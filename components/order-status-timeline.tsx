import { CheckCircle2, Circle, Clock } from "lucide-react";

const STEPS = [
  { key: "pending", label: "Order placed" },
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const ORDER = ["pending","processing","packed","shipped","delivered"];

type Event = { status: string; note: string | null; created_at: string };

export function OrderStatusTimeline({ currentStatus, events }: { currentStatus: string; events: Event[] }) {
  const currentIdx = ORDER.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled" || currentStatus === "refunded";

  if (isCancelled) {
    return (
      <div className="rounded-[6px] bg-red-50 border border-red-200 p-4">
        <p className="font-body text-sm font-bold text-red-700 capitalize">Order {currentStatus}</p>
        {events.slice(-1).map((e) => <p key={e.created_at} className="font-body text-xs text-red-500 mt-1">{e.note}</p>)}
      </div>
    );
  }

  return (
    <div className="relative">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx || (idx === currentIdx && currentStatus === "delivered");
        const active = idx === currentIdx && currentStatus !== "delivered";
        const event = events.find((e) => e.status === step.key);
        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                done ? "bg-[#356f3b] text-white" : active ? "bg-[#edf6ee] border-2 border-[#356f3b] text-[#356f3b]" : "bg-[#f0f0f0] text-[#98a2b3]"
              }`}>
                {done ? <CheckCircle2 size={14} /> : active ? <Clock size={13} /> : <Circle size={13} />}
              </div>
              {idx < STEPS.length - 1 && <div className={`w-0.5 flex-1 mt-1 mb-1 ${done ? "bg-[#356f3b]" : "bg-[#e0e0e0]"}`} style={{ minHeight: 24 }} />}
            </div>
            <div className="pb-4 min-w-0">
              <p className={`font-body text-sm ${active ? "font-extrabold text-[#111827]" : done ? "font-bold text-[#356f3b]" : "text-[#98a2b3]"}`}>{step.label}</p>
              {event && <p className="font-body text-xs text-[#667085] mt-0.5">{new Date(event.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
