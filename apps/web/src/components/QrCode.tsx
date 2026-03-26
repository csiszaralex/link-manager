'use client';

import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  size?: number;
}

export function QrCode({ value, size = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    // Explicit kontraszt beállítása, hogy dark módban is olvasható maradjon
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    }).catch(console.error);
  }, [value, size]);

  return <canvas ref={canvasRef} className="rounded-md" />;
}
