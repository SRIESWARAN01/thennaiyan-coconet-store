"use client";

export function ContactForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="space-y-1.5">
        <label className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">
          Your Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Tamilarasan"
          className="w-full bg-transparent border-b border-shell/30 focus:border-leaf focus:outline-none transition-colors py-2 text-sm text-ink placeholder-shell/30 font-body"
        />
      </div>

      <div className="space-y-1.5">
        <label className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">
          Email Address
        </label>
        <input
          type="email"
          required
          placeholder="e.g. you@example.com"
          className="w-full bg-transparent border-b border-shell/30 focus:border-leaf focus:outline-none transition-colors py-2 text-sm text-ink placeholder-shell/30 font-body"
        />
      </div>

      <div className="space-y-1.5">
        <label className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">
          Message
        </label>
        <textarea
          required
          rows={4}
          placeholder="Tell us what you're looking for..."
          className="w-full bg-transparent border-b border-shell/30 focus:border-leaf focus:outline-none transition-colors py-2 text-sm text-ink placeholder-shell/30 font-body resize-none"
        />
      </div>

      <div className="pt-4">
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Send Message
        </button>
      </div>
    </form>
  );
}
