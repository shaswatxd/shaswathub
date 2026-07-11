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
      const res = await fetch("https://formsubmit.co/ajax/srijankumardeo777@gmail.com", {
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
      setToast({ message: "Transmission failed. Try again or email directly.", type: "error" });
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
    
    let border = "border-white/[0.08]";
    if (isFocused) border = "border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.15)]";
    else if (isError) border = "border-[#ff3d9a] shadow-[0_0_12px_rgba(255,61,154,0.15)]";
    else if (isFilled) border = "border-[#3ef07c]/40";

    return `w-full bg-[#05070f]/80 rounded-xl px-4 pt-6 pb-2 border text-[#e8edf8] font-mono text-xs focus:outline-none transition-all duration-300 ${border}`;
  };

  return (
    <motion.div
      id="contact"
      className="max-w-[760px] mx-auto px-8 mb-20 relative"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[500px] h-[350px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.05)_0%,rgba(139,107,255,0.02)_40%,transparent_70%)] pointer-events-none z-0" />
      
      {/* Container */}
      <div className="relative z-10 p-6 sm:p-10 bg-white/[0.01] border border-white/[0.08] rounded-3xl overflow-hidden glass-panel">
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, #00f0ff, transparent)' }} />
        
        <div className="text-center mb-8">
          <div className="font-mono text-[9px] tracking-[3px] uppercase mb-3 text-[#00f0ff] glow-cyan">
            [TRANSMIT_PAYLOAD]
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight tracking-tight text-[#e8edf8] mb-3">
            Let&apos;s Build Something{' '}
            <span style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff, #ff3d9a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Together.
            </span>
          </h2>
          <p className="max-w-[480px] mx-auto text-[#8895b0] text-[11px] leading-relaxed">
            Have an idea, open-source sync, or technical challenge? Submit your query to broadcast a ping directly to my terminal dashboard.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`absolute left-4 pointer-events-none transition-all duration-300 select-none ${focused.name || form.name ? 'top-1.5 text-[8.5px] text-[#00f0ff] font-bold' : 'top-4 text-xs text-[#8895b0]'}`}
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
                className={`absolute left-4 pointer-events-none transition-all duration-300 select-none ${focused.email || form.email ? 'top-1.5 text-[8.5px] text-[#00f0ff] font-bold' : 'top-4 text-xs text-[#8895b0]'}`}
              >
                EMAIL_ADDRESS
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
              className={`absolute left-4 pointer-events-none transition-all duration-300 select-none ${focused.message || form.message ? 'top-2 text-[8.5px] text-[#00f0ff] font-bold' : 'top-4 text-xs text-[#8895b0]'}`}
            >
              PAYLOAD_BODY
            </label>
            {errors.message && (
              <div className="text-[#ff3d9a] font-mono text-[8.5px] mt-1 pl-1">{errors.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center font-mono text-[10px] tracking-wider uppercase font-bold px-7 py-3 rounded-xl transition-all duration-300 cursor-pointer text-[#020204]"
              style={{
                background: 'linear-gradient(135deg, #00f0ff, #8b6bff)',
                boxShadow: submitting ? 'none' : '0 4px 18px rgba(0,240,255,0.22)',
                opacity: submitting ? 0.75 : 1,
              }}
            >
              <span>{submitting ? "UPLOADING DATA..." : "BROADCAST MESSAGE"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Floating Toast Notification System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-[#060812] border border-white/[0.08] p-4 rounded-xl shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              boxShadow: toast.type === "success" 
                ? '0 10px 30px -10px rgba(0,0,0,0.8), 0 0 20px -5px rgba(62,240,124,0.15)'
                : '0 10px 30px -10px rgba(0,0,0,0.8), 0 0 20px -5px rgba(255,61,154,0.15)',
              borderColor: toast.type === "success" ? 'rgba(62,240,124,0.2)' : 'rgba(255,61,154,0.2)'
            }}
          >
            {/* Alert Status Icon */}
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                backgroundColor: toast.type === "success" ? 'rgba(62,240,124,0.12)' : 'rgba(255,61,154,0.12)',
                color: toast.type === "success" ? '#3ef07c' : '#ff3d9a',
                border: `1px solid ${toast.type === "success" ? '#3ef07c33' : '#ff3d9a33'}`
              }}
            >
              {toast.type === "success" ? "✓" : "✕"}
            </div>
            
            <div className="font-mono text-[10.5px] text-[#e8edf8]">
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
