import { useState, useEffect, useRef } from "react";

const CustomCursor = () => {
  const [disabled] = useState(
    () =>
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let raf = 0;
    let isHovering = false;
    let magnetics: HTMLElement[] = [];
    const LERP = 0.13;
    const previousCursor = document.body.style.cursor;

    document.body.style.cursor = "none";

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const updateMagnetics = () => {
      magnetics = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    };

    const loop = () => {
      ringX = lerp(ringX, mouseX, LERP);
      ringY = lerp(ringY, mouseY, LERP);

      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

      magnetics.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const range = 90;
        if (dist < range) {
          const s = (1 - dist / range) * 0.42;
          el.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
        } else {
          el.style.transform = "";
        }
      });

      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, input, label, [data-interactive]");
      if (interactive && !isHovering) {
        isHovering = true;
        ring.classList.add("cursor-ring--hover");
        dot.classList.add("cursor-dot--hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, input, label, [data-interactive]");
      if (interactive && isHovering) {
        isHovering = false;
        ring.classList.remove("cursor-ring--hover");
        dot.classList.remove("cursor-dot--hover");
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    updateMagnetics();
    const observer = new MutationObserver(updateMagnetics);
    observer.observe(document.body, { childList: true, subtree: true });

    raf = requestAnimationFrame(loop);
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.body.style.cursor = previousCursor;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        el.style.transform = "";
      });
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" aria-hidden style={{ opacity: 0 }} />
    </>
  );
};

export default CustomCursor;
