"use client";

import { useEffect } from 'react';

export default function AnimatedFavicon({ prefersReduced }) {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    let animationFrameId;
    let lastUpdate = 0;
    const interval = 80;

    const draw = (timestamp) => {
      if (prefersReduced) {
        ctx.clearRect(0, 0, 32, 32);

        const bgGrad = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
        bgGrad.addColorStop(0, '#0f1326');
        bgGrad.addColorStop(1, '#05070f');
        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(16, 16, 13.5, 0, Math.PI * 2);
        ctx.stroke();

        const grad = ctx.createLinearGradient(10, 10, 22, 22);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(0.5, '#8b6bff');
        grad.addColorStop(1, '#ff3d9a');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(22, 10);
        ctx.lineTo(14, 10);
        ctx.arcTo(10, 10, 10, 16, 4);
        ctx.arcTo(10, 16, 22, 16, 4);
        ctx.lineTo(18, 16);
        ctx.arcTo(22, 16, 22, 22, 4);
        ctx.arcTo(22, 22, 10, 22, 4);
        ctx.lineTo(10, 22);
        ctx.stroke();

        link.href = canvas.toDataURL('image/png');
        return;
      }

      animationFrameId = requestAnimationFrame(draw);

      if (timestamp - lastUpdate < interval) return;
      lastUpdate = timestamp;

      ctx.clearRect(0, 0, 32, 32);

      const bgGrad = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
      bgGrad.addColorStop(0, '#0f1326');
      bgGrad.addColorStop(1, '#05070f');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(16, 16, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(139, 107, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(16, 16, 13.5, 0, Math.PI * 2);
      ctx.stroke();

      const angle = (timestamp / 450) % (Math.PI * 2);
      const px = 16 + Math.cos(angle) * 13.5;
      const py = 16 + Math.sin(angle) * 13.5;

      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();

      const grad = ctx.createLinearGradient(10, 10, 22, 22);
      grad.addColorStop(0, `hsl(${(timestamp / 12) % 360}, 100%, 65%)`);
      grad.addColorStop(0.5, `hsl(${(timestamp / 12 + 60) % 360}, 100%, 60%)`);
      grad.addColorStop(1, `hsl(${(timestamp / 12 + 120) % 360}, 100%, 55%)`);

      const glowIntensity = Math.sin(timestamp / 150) * 1.5 + 4.5;

      ctx.strokeStyle = grad;
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = `hsl(${(timestamp / 12 + 30) % 360}, 100%, 60%)`;
      ctx.shadowBlur = glowIntensity;

      ctx.beginPath();
      ctx.moveTo(22, 10);
      ctx.lineTo(14, 10);
      ctx.arcTo(10, 10, 10, 16, 4);
      ctx.arcTo(10, 16, 22, 16, 4);
      ctx.lineTo(18, 16);
      ctx.arcTo(22, 16, 22, 22, 4);
      ctx.arcTo(22, 22, 10, 22, 4);
      ctx.lineTo(10, 22);
      ctx.stroke();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      link.href = canvas.toDataURL('image/png');
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [prefersReduced]);

  return null;
}
