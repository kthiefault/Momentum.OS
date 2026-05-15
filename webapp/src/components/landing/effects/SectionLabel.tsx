interface SectionLabelProps {
  index: string;
  label: string;
  tone?: "ember" | "ice";
}

const SectionLabel = ({ index, label, tone = "ember" }: SectionLabelProps) => {
  const dot = tone === "ember" ? "bg-ember" : "bg-ice";
  const text = tone === "ember" ? "text-ember" : "text-ice";
  return (
    <div className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
      <span className="font-mono-ui">{index}</span>
      <span className="h-px w-8 bg-border" />
      <span className={`relative flex h-1.5 w-1.5 rounded-full ${dot}`}>
        <span className={`absolute inset-0 rounded-full ${dot} animate-ping opacity-60`} />
      </span>
      <span className={text}>{label}</span>
    </div>
  );
};

export default SectionLabel;
