import React, { useState, useEffect } from 'react';
import { Country } from '../types.ts';
import { X, Globe } from 'lucide-react';

interface CountryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  country?: Country | null;
}

// Helper to convert 2-letter ISO code to flag emoji
function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return '';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '🌍';
  }
}

export const CountryFormModal: React.FC<CountryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  country = null
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [flag, setFlag] = useState('🌍');

  useEffect(() => {
    if (country) {
      setName(country.countryName);
      setCode(country.code);
      setFlag(country.flag || '🌍');
    } else {
      setName('');
      setCode('');
      setFlag('🌍');
    }
  }, [country, isOpen]);

  const handleCodeChange = (val: string) => {
    const filteredVal = val.toUpperCase().slice(0, 2).replace(/[^A-Z]/g, '');
    setCode(filteredVal);
    if (filteredVal.length === 2) {
      setFlag(getFlagEmoji(filteredVal));
    } else {
      setFlag('🌍');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || code.length !== 2) {
      alert("Please enter a valid Country Name and 2-Letter ISO Code.");
      return;
    }
    onSubmit({
      countryName: name,
      code,
      flag
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div 
        className="relative bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all transform scale-100"
        id="country-form-modal"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-500" />
            {country ? 'Edit African Country' : 'Add African Country'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
            id="close-country-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Country Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Country Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Kenya, South Africa, Senegal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              id="field-country-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Country Code */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">2-Letter ISO Code</label>
              <input 
                type="text" 
                required
                maxLength={2}
                placeholder="e.g. KE, ZA, NG"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 uppercase font-mono text-center tracking-widest"
                id="field-country-code"
              />
            </div>

            {/* Generated Flag emoji preview */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 text-center">Derived Flag</label>
              <div className="w-full flex items-center justify-center h-[43px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-3xl">
                <span>{flag}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center">
            The flag is computed dynamically from the 2-letter ISO standard country code (e.g. <code>KE</code> for Kenya, <code>ZA</code> for South Africa, etc.)
          </p>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl cursor-pointer"
              id="cancel-country-modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-amber-500 text-white rounded-xl shadow-md shadow-amber-500/10 hover:bg-amber-600 hover:scale-102 transition-all cursor-pointer"
              id="save-country-modal-btn"
            >
              Save Country
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
