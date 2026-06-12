"use client";

import { MessageSquare } from "lucide-react";

export function ContactForm() {
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem("fullName") as HTMLInputElement).value;
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const message = (e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement).value;

    const text = `Hello, my name is ${name} (${email}). I have an enquiry:\n\n${message}`;
    const whatsappUrl = `https://wa.me/918124165047?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <form onSubmit={handleSendMessage} className="space-y-6">
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">
          Your Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          placeholder="e.g. Tamilarasan"
          className="w-full bg-transparent border-b border-shell/30 focus:border-leaf focus:outline-none transition-colors py-2 text-sm text-ink placeholder-shell/30 font-body"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="e.g. you@example.com"
          className="w-full bg-transparent border-b border-shell/30 focus:border-leaf focus:outline-none transition-colors py-2 text-sm text-ink placeholder-shell/30 font-body"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell us what you're looking for..."
          className="w-full bg-transparent border-b border-shell/30 focus:border-leaf focus:outline-none transition-colors py-2 text-sm text-ink placeholder-shell/30 font-body resize-none"
        />
      </div>

      <div className="pt-4">
        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 shadow-md hover:bg-leaf-deep transition-all">
          <MessageSquare size={16} />
          Send Message via WhatsApp
        </button>
      </div>
    </form>
  );
}
