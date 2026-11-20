import React from 'react';
import { formatWhatsappNumber } from '../lib/whatsapp';

interface FloatingWhatsAppProps {
  whatsappPhone: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappPhone,
}) => {
  const href = `https://wa.me/${formatWhatsappNumber(whatsappPhone || '81922013')}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Chez Moni"
      className="fixed bottom-5 end-5 z-40 w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-current"
        aria-hidden="true"
      >
        <path d="M16.002 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.256.59 4.46 1.712 6.404L3.1 28.8l6.558-1.72a12.74 12.74 0 0 0 6.344 1.688h.005c7.058 0 12.795-5.74 12.795-12.8 0-3.42-1.332-6.634-3.75-9.052A12.71 12.71 0 0 0 16.002 3.2zm7.47 18.21c-.315.887-1.835 1.694-2.548 1.802-.65.098-1.472.14-2.375-.148-.548-.174-1.25-.406-2.15-.795-3.78-1.63-6.248-5.43-6.437-5.683-.188-.252-1.537-2.044-1.537-3.898 0-1.855.97-2.766 1.315-3.144.346-.378.755-.472 1.007-.472.252 0 .504.003.724.013.232.012.543-.088.85.648.315.755 1.07 2.61 1.164 2.8.095.188.158.41.032.66-.126.252-.19.41-.378.63-.189.22-.397.49-.567.658-.189.189-.386.394-.166.772.22.378.978 1.613 2.1 2.613 1.443 1.287 2.658 1.686 3.036 1.875.378.189.598.157.82-.095.22-.252.944-1.102 1.196-1.48.252-.378.504-.315.85-.189.346.126 2.203 1.039 2.58 1.228.378.189.63.284.725.441.095.157.095.912-.22 1.799z" />
      </svg>
    </a>
  );
};
