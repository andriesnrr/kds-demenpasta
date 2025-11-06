'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface ExportOption {
  label: string;
  description: string;
  onClick: () => void;
}

interface ExportButtonProps {
  options: ExportOption[];
  buttonText?: string;
  buttonClass?: string;
}

export default function ExportButton({
  options,
  buttonText = 'Export Excel',
  buttonClass = 'bg-green-600 hover:bg-green-700',
}: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Single option - direct export
  if (options.length === 1) {
    return (
      <button
        onClick={options[0].onClick}
        className={`${buttonClass} text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors`}
      >
        <Download size={20} />
        {buttonText}
      </button>
    );
  }

  // Multiple options - dropdown menu
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${buttonClass} text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors`}
      >
        <Download size={20} />
        {buttonText}
      </button>

      {showMenu && (
        <>
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-10">
            <div className="py-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.onClick();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="font-semibold text-brand-black">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowMenu(false)}
          />
        </>
      )}
    </div>
  );
}