"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState({ name: false, email: false, message: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Toast Alert State
  const [toast, setToast] = useState(null); // { message, type }

  const validate = () => {
    const tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Identifier name required.";

    if (!form.email.trim()) {
      tempErrors.email = "IP/Email address required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Invalid format structure.";
    }

    if (!form.message.trim()) {
      tempErrors.message = "Payload body cannot be empty.";
    } else if (form.message.trim().length < 10) {
      tempErrors.message = "Message must exceed 10 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFocus = (field) => setFocused({ ...focused, [field]: true });

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
    // Trigger validation on blur for active feedback
    setTimeout(validate, 50);
  };

  const handleChange = (field, val) => {
    setForm({ ...form, [field]: val });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ message: "Transmission failed. Check parameters.", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_FORM_ENDPOINT || "", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `ShaswatHub · New message from ${form.name}`,
        }),
      });

      if (!res.ok) throw new Error("Delivery failed");

      setToast({ message: "Message encrypted and transmitted successfully!", type: "success" });
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    } catch {
      setToast({ message: "Transmission failed. Please try again later.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-close toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getInputClass = (field) => {
    const isError = !!errors[field];
    const isFocused = focused[field];
    const isFilled = form[field].length > 0;

    let border = "border-[#e8e8e8] dark:border-white/15";
    if (isFocused) border = "border-cyan";
    else if (isError) border = "border-[#ff3d9a]";
    else if (isFilled) border = "border-[#0a0a0a] dark:border-white/40";

    return `w-full bg-white dark:bg-[#0a0a0a] rounded-none px-4 pt-6 pb-2 border text-[#0a0a0a] dark:text-[#f2f2f2] font-mono text-xs focus:outline-none transition-all duration-300 ${border}`;
  };

  return (
    <motion.div
      id="contact"
      className="max-w-[1000px] mx-auto px-6 lg:px-16 py-20 relative"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center mb-12">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan mb-4 inline-block">Let&apos;s Connect</span>
        <h2 className="font-semibold text-4xl lg:text-6xl tracking-tight mb-6 leading-[1.05] text-[#0a0a0a] dark:text-[#f2f2f2]">
          Got a build in mind?<br />Let&apos;s ship it.
        </h2>
        <p className="text-[#555] dark:text-[#aaa] max-w-md mx-auto">
          Have an idea, open-source sync, or technical challenge? Submit your query to broadcast a ping directly to my terminal dashboard.
        </p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="max-w-[640px] mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              value={form.name}
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              onChange={(e) => handleChange("name", e.target.value)}
              className={getInputClass("name")}
            />
            <label
              className={`absolute left-4 pointer-events-none transition-all duration-300 select-none ${focused.name || form.name ? 'top-1.5 text-[8.5px] text-cyan font-bold' : 'top-4 text-xs text-[#666] dark:text-[#999]'}`}
            >
              SENDER_NAME
            </label>
            {errors.name && (
              <div className="text-[#ff3d9a] font-mono text-[8.5px] mt-1 pl-1">{errors.name}</div>
            )}
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              value={form.email}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              onChange={(e) => handleChange("email", e.target.value)}
              className={getInputClass("email")}
            />
            <label
              className={`absolute left-4 pointer-events-none transition-all duration-300 select-none ${focused.email || form.email ? 'top-1.5 text-[8.5px] text-cyan font-bold' : 'top-4 text-xs text-[#666] dark:text-[#999]'}`}
            >
              YOUR_EMAIL_ADDRESS
            </label>
            {errors.email && (
              <div className="text-[#ff3d9a] font-mono text-[8.5px] mt-1 pl-1">{errors.email}</div>
            )}
          </div>
        </div>

        {/* Message Area */}
        <div className="relative">
          <textarea
            value={form.message}
            rows={4}
            onFocus={() => handleFocus("message")}
            onBlur={() => handleBlur("message")}
            onChange={(e) => handleChange("message", e.target.value)}
            className={`${getInputClass("message")} resize-none pt-7 min-h-[100px]`}
          />
          <label
            className={`absolute left-4 pointer-events-none transition-all duration-300 select-none ${focused.message || form.message ? 'top-2 text-[8.5px] text-cyan font-bold' : 'top-4 text-xs text-[#666] dark:text-[#999]'}`}
          >
            SEND_MESSAGE_TO_SHASWAT
          </label>
          {errors.message && (
            <div className="text-[#ff3d9a] font-mono text-[8.5px] mt-1 pl-1">{errors.message}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-xs uppercase tracking-wider text-white transition-all duration-300"
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? "Uploading Data..." : "Broadcast Message"}
          </button>
        </div>
      </form>

      {/* Floating Toast Notification System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-white dark:bg-[#111] border border-[#0a0a0a] dark:border-white/20 p-4 shadow-lg"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* Alert Status Icon */}
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border"
              style={{
                backgroundColor: toast.type === "success" ? 'rgba(62,240,124,0.12)' : 'rgba(255,61,154,0.12)',
                color: toast.type === "success" ? '#3ef07c' : '#ff3d9a',
                borderColor: toast.type === "success" ? '#3ef07c' : '#ff3d9a',
              }}
            >
              {toast.type === "success" ? "✓" : "✕"}
            </div>

            <div className="font-mono text-[10.5px] text-[#0a0a0a] dark:text-[#f2f2f2]">
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
