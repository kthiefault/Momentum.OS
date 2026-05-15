interface GridBackdropProps {
  className?: string;
  fine?: boolean;
}

const GridBackdrop = ({ className = "", fine = false }: GridBackdropProps) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 mask-radial ${fine ? "bg-grid-fine" : "bg-grid"} ${className}`}
  />
);

export default GridBackdrop;
