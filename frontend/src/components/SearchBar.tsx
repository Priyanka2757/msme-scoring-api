import { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';

interface Props {
  onSearch: (gstin: string) => void;
  disabled?: boolean;
}

const SAMPLE = ['27AABCS1234L1Z5', '33AAHFC8765K1Z2', '29AALCM4521P1Z8'];

export default function SearchBar({ onSearch, disabled }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim().toUpperCase();
    if (trimmed.length !== 15) {
      setError('GSTIN must be 15 characters');
      return;
    }
    setError('');
    onSearch(trimmed);
  };

  const useSample = (s: string) => {
    setValue(s);
    setError('');
    onSearch(s);
  };

  return (
    <div className="w-full">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value.toUpperCase());
              if (error) setError('');
            }}
            placeholder="Enter any 15-digit GSTIN (e.g. 27AABCS1234L1Z5)"
            disabled={disabled}
            className="w-full rounded-xl border border-navy-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-navy-900 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 disabled:opacity-60"
            maxLength={15}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500/30 disabled:opacity-60"
        >
          Generate Health Card
        </button>
      </form>

      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs text-navy-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Try a sample:
        </span>
        {SAMPLE.map((s) => (
          <button
            key={s}
            onClick={() => useSample(s)}
            disabled={disabled}
            className="rounded-md border border-navy-200 bg-white px-2.5 py-1 font-mono text-xs text-navy-600 transition-colors hover:border-navy-400 hover:bg-navy-50 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
