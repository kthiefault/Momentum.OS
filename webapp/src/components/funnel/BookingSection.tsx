import React from "react";

const CALENDLY_URL =
  "https://calendly.com/krthiefaulti/30min?hide_landing_page_details=1&hide_gdpr_banner=1";

export function BookingSection() {
  return (
    <section
      id="book"
      className="bg-card/60 border-y border-border px-4 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to See It in Action?
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Pick a time that works for you — 30-minute demo, zero pressure.
          </p>
        </div>
        <iframe
          src={CALENDLY_URL}
          width="100%"
          height="700"
          frameBorder="0"
          scrolling="no"
          className="rounded-2xl h-[500px] sm:h-[700px] w-full"
          title="Book a 30-minute demo"
        />
      </div>
    </section>
  );
}
