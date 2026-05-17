import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { type Theme } from "@/hooks/use-theme";

interface ThemePickerModalProps {
  open: boolean;
  onChoose: (theme: Theme) => void;
}

export default function ThemePickerModal({ open, onChoose }: ThemePickerModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
            className="w-full max-w-lg px-6"
          >
            <div className="mb-8 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 mb-3">
                Welcome to Momentum.OS
              </p>
              <h2 className="text-2xl font-medium tracking-tight text-white/90">
                Choose your appearance
              </h2>
              <p className="mt-2 text-sm text-white/40">
                You can change this anytime from the navigation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Dark option */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoose("dark")}
                className="group relative flex flex-col items-center gap-4 rounded-2xl p-6 text-left transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.20)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)";
                }}
              >
                {/* Dark preview */}
                <div
                  className="w-full rounded-xl overflow-hidden"
                  style={{ background: "hsl(230 20% 4%)", border: "1px solid rgba(255,255,255,0.08)", height: 100 }}
                >
                  <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {[0,1,2].map(i => <div key={i} className="h-2 w-2 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />)}
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="h-2 w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                    <div className="h-2 w-1/2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <div className="h-2 w-2/3 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <Moon className="h-3.5 w-3.5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white/85">Dark</p>
                    <p className="text-[11px] text-white/35">Easy on the eyes</p>
                  </div>
                </div>
              </motion.button>

              {/* Light option */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoose("light")}
                className="group relative flex flex-col items-center gap-4 rounded-2xl p-6 text-left transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.20)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)";
                }}
              >
                {/* Light preview */}
                <div
                  className="w-full rounded-xl overflow-hidden"
                  style={{ background: "hsl(30 15% 97%)", border: "1px solid rgba(0,0,0,0.08)", height: 100 }}
                >
                  <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "white" }}>
                    {[0,1,2].map(i => <div key={i} className="h-2 w-2 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />)}
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="h-2 w-3/4 rounded-full" style={{ background: "rgba(0,0,0,0.15)" }} />
                    <div className="h-2 w-1/2 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }} />
                    <div className="h-2 w-2/3 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }} />
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <Sun className="h-3.5 w-3.5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white/85">Light</p>
                    <p className="text-[11px] text-white/35">Clean and bright</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
