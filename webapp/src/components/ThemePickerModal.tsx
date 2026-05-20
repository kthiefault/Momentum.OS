import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { type Theme } from "@/hooks/use-theme";

interface ThemePickerModalProps {
  open: boolean;
  onChoose: (theme: Theme) => void;
}

interface FormFields {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name: string;
  email: string;
  phone: string;
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = { name: "", email: "", phone: "" };
  if (!fields.name.trim()) {
    errors.name = "Full name is required.";
  }
  if (!fields.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!fields.email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.phone.trim()) {
    errors.phone = "Phone number is required.";
  }
  return errors;
}

function hasErrors(errors: FormErrors): boolean {
  return errors.name !== "" || errors.email !== "" || errors.phone !== "";
}

export default function ThemePickerModal({ open, onChoose }: ThemePickerModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [fields, setFields] = useState<FormFields>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<FormErrors>({ name: "", email: "", phone: "" });
  const [touched, setTouched] = useState<Record<keyof FormFields, boolean>>({
    name: false,
    email: false,
    phone: false,
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      setFields({ name: "", email: "", phone: "" });
      setErrors({ name: "", email: "", phone: "" });
      setTouched({ name: false, email: false, phone: false });
    }
  }, [open]);

  function handleFieldChange(field: keyof FormFields, value: string) {
    const updated = { ...fields, [field]: value };
    setFields(updated);
    if (touched[field]) {
      const newErrors = validate(updated);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }
  }

  function handleBlur(field: keyof FormFields) {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validate(fields);
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
  }

  function handleContinue() {
    setTouched({ name: true, email: true, phone: true });
    const newErrors = validate(fields);
    setErrors(newErrors);
    if (hasErrors(newErrors)) return;
    localStorage.setItem("user-name", fields.name.trim());
    localStorage.setItem("user-email", fields.email.trim());
    localStorage.setItem("user-phone", fields.phone.trim());
    setStep(2);
  }

  const inputBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.85)",
    width: "100%",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.50)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "rgba(255,100,100,0.85)",
    marginTop: "5px",
    minHeight: "16px",
  };

  function inputStyle(field: keyof FormFields): React.CSSProperties {
    return {
      ...inputBase,
      border: `1px solid ${errors[field] && touched[field] ? "rgba(255,100,100,0.60)" : "rgba(255,255,255,0.12)"}`,
    };
  }

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
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key={1}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="mb-8 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 mb-3">
                      Welcome to Momentum.OS
                    </p>
                    <h2 className="text-2xl font-medium tracking-tight text-white/90">
                      Let's get you set up
                    </h2>
                    <p className="mt-2 text-sm text-white/40">
                      Enter your details to continue
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input
                        type="text"
                        value={fields.name}
                        onChange={e => handleFieldChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        onFocus={e => {
                          (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.30)";
                        }}
                        placeholder="Jane Smith"
                        autoComplete="name"
                        style={inputStyle("name")}
                      />
                      <div style={errorStyle}>{touched.name ? errors.name : ""}</div>
                    </div>

                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input
                        type="email"
                        value={fields.email}
                        onChange={e => handleFieldChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        onFocus={e => {
                          (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.30)";
                        }}
                        placeholder="jane@example.com"
                        autoComplete="email"
                        style={inputStyle("email")}
                      />
                      <div style={errorStyle}>{touched.email ? errors.email : ""}</div>
                    </div>

                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input
                        type="tel"
                        value={fields.phone}
                        onChange={e => handleFieldChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        onFocus={e => {
                          (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.30)";
                        }}
                        placeholder="+1 (555) 000-0000"
                        autoComplete="tel"
                        style={inputStyle("phone")}
                      />
                      <div style={errorStyle}>{touched.phone ? errors.phone : ""}</div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContinue}
                      style={{
                        background: "white",
                        color: "#0f0f10",
                        width: "100%",
                        borderRadius: "12px",
                        padding: "12px 0",
                        fontWeight: 500,
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "8px",
                      }}
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={2}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="mb-8 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 mb-3">
                      Welcome to Momentum.OS
                    </p>
                    <h2 className="text-2xl font-medium tracking-tight text-white/90">
                      Almost done — choose your appearance
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
                          {[0, 1, 2].map(i => (
                            <div key={i} className="h-2 w-2 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                          ))}
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
                          {[0, 1, 2].map(i => (
                            <div key={i} className="h-2 w-2 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
                          ))}
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
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
