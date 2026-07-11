"use client";

import { useEffect } from 'react';

export default function FaviconAnimator() {
  useEffect(() => {
    const SIZE = 64;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');

    // S path scaled 2x from original 32x32 SVG viewBox
    // Original: M22 11.5 C22 8.5 19.5 7 16 7 C12.5 7 10 8.5 10 11.5
    //           C10 14.5 13 15.2 16 16 C19 16.8 22 17.5 22 20.5
    //           C22 23 19.5 25 16 25 C12.5 25 10 23 10 20.5
    const sPath = new Path2D(
      'M44 23 C44 17 39 14 32 14 C25 14 20 17 20 23 ' +
      'C20 29 26 30.4 32 32 C38 33.6 44 35 44 41 ' +
      'C44 46 39 50 32 50 C25 50 20 46 20 41'
    );

    // Approximate total stroke length of the S path at 2x scale
    const TOTAL = 118;
    let drawn = 0;
    let dir = 1;
    let raf;

    const drawFrame = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Dark rounded background
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath();
      const r = 10;
      ctx.moveTo(r, 0);
      ctx.lineTo(SIZE - r, 0);
      ctx.arcTo(SIZE, 0, SIZE, r, r);
      ctx.lineTo(SIZE, SIZE - r);
      ctx.arcTo(SIZE, SIZE, SIZE - r, SIZE, r);
      ctx.lineTo(r, SIZE);
      ctx.arcTo(0, SIZE, 0, SIZE - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
      ctx.fill();

      // Animated S stroke
      ctx.save();
      ctx.strokeStyle = '#00c2d1';
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([drawn, TOTAL]);
      ctx.lineDashOffset = 0;
      ctx.stroke(sPath);
      ctx.restore();

      // Inject into favicon
      const link = document.querySelector("link[rel='icon'], link[rel='shortcut icon']");
      if (link) link.href = canvas.toDataURL('image/png');

      // Ease the animation speed
      drawn += dir * 1.0;
      if (drawn >= TOTAL + 4) dir = -1;
      else if (drawn <= -4) dir = 1;

      raf = requestAnimationFrame(drawFrame);
    };

    drawFrame();
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
