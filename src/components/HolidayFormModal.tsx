import React, { useState, useEffect } from 'react';
import { Holiday, Country } from '../types.ts';
import { X, Calendar as CalIcon } from 'lucide-react';

interface HolidayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  holiday?: Holiday | null;
  countries: Country[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export const HolidayFormModal: React.FC<HolidayFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  holiday = null,
  countries
}) => {
  const [name, setName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [dateStr, setDateStr] = useState('2026-01-01');
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState(2026);
  const [day, setDay] = useState('Thursday');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Public');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (holiday) {
      setName(holiday.holidayName);
      setCountryId(String(holiday.countryId));
      setDateStr(holiday.date);
      setMonth(holiday.month);
      setYear(holiday.year);
      setDay(holiday.day);
      setDescription(holiday.description);
      setType(holiday.type);
      setIsPublic(holiday.isPublic);
    } else {
      setName('');
      setCountryId(countries[0]?.id ? String(countries[0].id) : '');
      setDateStr('2026-01-01');
      setMonth('January');
      setYear(2026);
      setDay('Thursday');
      setDescription('');
      setType('Public');
      setIsPublic(true);
    }
  }, [holiday, isOpen, countries]);

  // Smart inference of month, year, and day from selected date
  const handleDateChange = (val: string) => {
    setDateStr(val);
    if (!val) return;
    try {
      const parsedDate = new Date(val);
      if (isNaN(parsedDate.getTime())) return;
      
      const inferredYear = parsedDate.getFullYear();
      const inferredMonthIndex = parsedDate.getMonth();
      const inferredDayIndex = parsedDate.getDay();
      
      setYear(inferredYear);
      setMonth(MONTHS[inferredMonthIndex]);
      setDay(DAYS[inferredDayIndex]);
    } catch (e) {
      console.error("Failed to parse date for inference", e);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !countryId || !dateStr || !description || !type) {
      alert("Please fill in all fields.");
      return;
    }
    
    onSubmit({
      holidayName: name,
      countryId: Number(countryId),
      date: dateStr,
      month,
      year: Number(year),
      day,
      description,
      type,
      isPublic
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div 
        className="relative bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all transform scale-100"
        id="holiday-form-modal"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
            <CalIcon className="w-5 h-5 text-emerald-600" />
            {holiday ? 'Edit Public Holiday' : 'Add Public Holiday'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
            id="close-holiday-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Holiday Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Holiday Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Independence Day, Mashujaa Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              id="field-holiday-name"
            />
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Country</label>
            <select
              required
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              id="field-country-select"
            >
              <option value="" disabled>Select Country</option>
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.flag} {c.countryName}</option>
              ))}
            </select>
          </div>

          {/* Date Selector with Autocomplete info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Select Date</label>
              <input 
                type="date" 
                required
                value={dateStr}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                id="field-holiday-date"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Holiday Type</label>
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                id="field-holiday-type"
              >
                <option value="Public">Public Holiday</option>
                <option value="Religious">Religious Holiday</option>
                <option value="National">National Holiday</option>
                <option value="Observance">Observance</option>
              </select>
            </div>
          </div>

          {/* Inferred attributes */}
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex flex-wrap gap-x-6 gap-y-2 justify-between text-xs text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
            <div>Inferred Month: <strong className="text-zinc-900 dark:text-zinc-200">{month}</strong></div>
            <div>Inferred Year: <strong className="text-zinc-900 dark:text-zinc-200">{year}</strong></div>
            <div>Inferred Day: <strong className="text-zinc-900 dark:text-zinc-200">{day}</strong></div>
          </div>

          {/* Reason / Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Reason / Description</label>
            <textarea 
              rows={3}
              required
              placeholder="e.g. Celebrates the freedom and birth of the republic."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              id="field-holiday-desc"
            />
          </div>

          {/* Is Public Switch */}
          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/20 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
            <div>
              <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Is Public Holiday</h4>
              <p className="text-[10px] text-zinc-500">Is this holiday a legally recognized day off from work?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
                id="field-holiday-is-public"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl cursor-pointer"
              id="cancel-holiday-modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/10 hover:bg-emerald-700 hover:scale-102 transition-all cursor-pointer"
              id="save-holiday-modal-btn"
            >
              Save Holiday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
