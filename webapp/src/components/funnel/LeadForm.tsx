import React, { useState } from "react";
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

interface SuccessStateProps {
  name: string;
  email: string;
}

function SuccessState({ name, email }: SuccessStateProps) {
  const calendlyUrl =
    `https://calendly.com/krthiefaulti/30min` +
    `?hide_landing_page_details=1&hide_gdpr_banner=1` +
    `&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ember/15 ring-2 ring-ember/30">
          <CheckCircle2 className="h-6 w-6 text-ember" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground">You're all set!</h3>
          <p className="text-sm text-muted-foreground">
            Now pick a time for your 30-minute demo
          </p>
        </div>
      </div>
      <iframe
        src={calendlyUrl}
        width="100%"
        height="650"
        frameBorder="0"
        scrolling="no"
        className="rounded-xl h-[500px] sm:h-[650px]"
        title="Schedule your demo"
      />
    </motion.div>
  );
}

interface LeadFormProps {
  compact?: boolean;
}

export function LeadForm({ compact = false }: LeadFormProps) {
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string } | null>(null);

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
    onSuccess: (_result, variables) => {
      setSubmittedData({ name: variables.name, email: variables.email });
    },
  });

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-lg border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all outline-none",
      "focus:ring-2 focus-visible:ring-ring focus:border-border",
      hasError
        ? "border-red-500/60 focus:ring-red-500"
        : "border-border hover:border-border/80"
    );

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/80 backdrop-blur-sm",
        compact ? "p-5" : "p-6 sm:p-8"
      )}
    >
      <AnimatePresence mode="wait">
        {submittedData !== null ? (
          <SuccessState key="success" name={submittedData.name} email={submittedData.email} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!compact && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Book Your Free Strategy Demo
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  See exactly how much time you're losing — and get a custom automation plan.
                </p>
              </div>
            )}
            {compact && (
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground">Book Your Free Demo</h2>
                <p className="mt-1 text-xs text-muted-foreground">
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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

              <p className="text-center text-xs text-muted-foreground/60">
                No credit card required. No spam, ever.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
