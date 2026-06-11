import { cn } from "@/lib/utils";

interface BatchStampProps {
  batch: string;       // e.g. "042"
  pressed: string;     // e.g. "FEB 2026"
  origin?: string;     // e.g. "COIMBATORE"
  className?: string;
}

/**
 * The page's recurring signature.
 * Treats every product like a vintage: traceable, dated, sourced.
 * Renders as a monospaced ribbon with a single gold dot anchor.
 */
export function BatchStamp({
  batch,
  pressed,
  origin = "MADURAI",
  className,
}: BatchStampProps) {
  return (
    <div className={cn("batch-stamp", className)}>
      <span className="batch-stamp__dot" aria-hidden />
      <span>BATCH {batch}</span>
      <span className="opacity-40" aria-hidden>/</span>
      <span>PRESSED {pressed}</span>
      <span className="opacity-40" aria-hidden>/</span>
      <span>{origin}</span>
    </div>
  );
}
