"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Phone, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type PhoneAuthFormProps = {
  next: string;
  mode?: "login" | "signup";
};

type Step = "phone" | "otp" | "done";

// Offline OTP demo (code "123456") is only active when
// NEXT_PUBLIC_ENABLE_MOCK_AUTH="true". In production, real Supabase SMS OTP is used.
const MOCK_AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true";

function normalizePhone(value: string) {
  const trimmed = value.trim().replace(/\s+/g, "");
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.length === 10) return `+91${trimmed}`;
  return trimmed;
}

export function PhoneAuthForm({ next, mode = "login" }: PhoneAuthFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);
  const safeNext = next.startsWith("/") ? next : "/account";

  const requestOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!normalizedPhone || normalizedPhone.length < 10) {
      setError("Enter a valid mobile number.");
      return;
    }

    setPending(true);

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: fullName.trim() || null,
            phone: normalizedPhone,
          },
        },
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      setStep("otp");
      setMessage("OTP sent. Enter the code from your mobile.");
    } catch (err) {
      if (MOCK_AUTH_ENABLED) {
        console.warn("OTP delivery failed (enabling offline mock mode):", err);
        setStep("otp");
        setMessage("OTP sent (Offline Mode: Use code '123456' to log in).");
      } else {
        setError(
          "Could not send the OTP. Please check your number and try again.",
        );
      }
    } finally {
      setPending(false);
    }
  };

  const verifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!otp.trim()) {
      setError("Enter the OTP.");
      return;
    }

    if (MOCK_AUTH_ENABLED && otp.trim() === "123456") {
      document.cookie = "sb-access-token=mock-customer; path=/";
      document.cookie = "sb-refresh-token=mock-customer; path=/";
      setStep("done");
      setMessage("Account ready. Opening your panel...");
      setTimeout(() => {
        router.push(safeNext);
        router.refresh();
      }, 500);
      return;
    }

    setPending(true);

    try {
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: otp.trim(),
        type: "sms",
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      if (data.user) {
        await supabase
          .from("profiles")
          .update({
            phone: normalizedPhone,
            full_name: fullName.trim() || data.user.user_metadata?.full_name || null,
          })
          .eq("id", data.user.id);
      }

      setStep("done");
      setMessage("Account ready. Opening your panel...");
      router.push(safeNext);
      router.refresh();
    } catch {
      setError("Could not verify OTP. Try again.");
    } finally {
      setPending(false);
    }
  };

  if (step === "done") {
    return (
      <div className="rounded-sm border border-leaf/20 bg-leaf-mist p-5 text-center">
        <CheckCircle2 className="mx-auto text-leaf" size={28} />
        <p className="mt-3 font-body text-sm font-semibold text-leaf-deep">
          {message ?? "Account ready."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-leaf-mist text-leaf">
          {step === "phone" ? <Phone size={18} /> : <ShieldCheck size={18} />}
        </span>
        <div>
          <h2
            className="font-display text-2xl text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 55, 'opsz' 24" }}
          >
            {mode === "signup" ? "Create customer account" : "Customer login"}
          </h2>
          <p className="mt-1 font-body text-sm leading-relaxed text-shell">
            Use your mobile number. Orders, cart, and tracking stay connected to
            this account.
          </p>
        </div>
      </div>

      {step === "phone" ? (
        <form onSubmit={requestOtp} className="space-y-5">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="block font-mono text-[10px] uppercase tracking-wider text-shell-husk"
              >
                Your name
              </label>
              <input
                id="fullName"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                placeholder="e.g. Ravi Kumar"
                className="w-full border-b border-shell/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-shell/30 focus:border-leaf"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block font-mono text-[10px] uppercase tracking-wider text-shell-husk"
            >
              Mobile number
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className="w-full border-b border-shell/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-shell/30 focus:border-leaf"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-5">
          <div className="rounded-sm border border-shell/10 bg-kernel-deeper/40 p-3 font-body text-xs text-shell">
            OTP sent to <span className="font-semibold text-ink">{normalizedPhone}</span>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="otp"
              className="block font-mono text-[10px] uppercase tracking-wider text-shell-husk"
            >
              OTP code
            </label>
            <input
              id="otp"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              className="w-full border-b border-shell/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-shell/30 focus:border-leaf"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError(null);
                setMessage(null);
              }}
              className="btn-secondary w-full"
            >
              Change number
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && <Loader2 size={16} className="animate-spin" />}
              Verify OTP
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className="rounded-sm border border-leaf/20 bg-leaf-mist px-3 py-2 font-body text-sm text-leaf-deep">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
