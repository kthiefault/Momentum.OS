import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid work email"),
  phone: z.string().optional(),
  company: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface LeadResponse {
  success: boolean;
}

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 ring-2 ring-amber-500/30">
        <CheckCircle2 className="h-8 w-8 text-amber-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">You're booked!</h3>
        <p className="text-sm leading-relaxed text-zinc-400">
          We'll reach out within 24 hours to confirm your demo time. Check your email for a
          calendar invite.
        </p>
      </div>
      <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          In the meantime, explore what's possible:
        </p>
        <ul className="space-y-3">
          {[
            { icon: "⚡", text: "Workflow automation that runs 24/7 without you" },
            { icon: "🤖", text: "AI tools that learn your business and adapt" },
            { icon: "📈", text: "Real-time dashboards tracking every metric that matters" },
          ].map((item) => (
            <li key={item.text} className="flex items-start gap-3">
              <span className="mt-0.5 text-base">{item.icon}</span>
              <span className="text-sm text-zinc-300">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

interface LeadFormProps {
  compact?: boolean;
}

export function LeadForm({ compact = false }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation<LeadResponse, Error, FormData>({
    mutationFn: (data) =>
      api.post<LeadResponse>("/api/leads/public", {
        ...data,
        source: "social-media-funnel",
      }),
  });

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-lg border bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all outline-none",
      "focus:ring-2 focus:ring-amber-500 focus:border-amber-500/60",
      hasError
        ? "border-red-500/60 focus:ring-red-500"
        : "border-zinc-700 hover:border-zinc-600"
    );

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm",
        compact ? "p-5" : "p-6 sm:p-8"
      )}
    >
      <AnimatePresence mode="wait">
        {mutation.isSuccess ? (
          <SuccessState key="success" />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!compact && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Book Your Free Strategy Demo
                </h2>
                <p className="mt-1.5 text-sm text-zinc-400">
                  See exactly how much time you're losing — and get a custom automation plan.
                </p>
              </div>
            )}
            {compact && (
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Book Your Free Demo</h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Get your custom automation plan in 24 hours.
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <input
                    {...register("name")}
                    placeholder="Full Name *"
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Work Email *"
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {!compact && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="Mobile number (optional)"
                    className={inputClass(false)}
                  />
                  <input
                    {...register("company")}
                    placeholder="Company Name (optional)"
                    className={inputClass(false)}
                  />
                </div>
              )}

              {mutation.isError && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get My Free Demo
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-zinc-600">
                No credit card required. No spam, ever.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
