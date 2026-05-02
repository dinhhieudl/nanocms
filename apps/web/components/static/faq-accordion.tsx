'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  q: string;
  a: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="card p-0 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between p-5 text-left"
          >
            <span className="font-semibold text-sm pr-4">{item.q}</span>
            <ChevronDown
              className={cn('h-5 w-5 text-gray-400 shrink-0 transition-transform', openIndex === i && 'rotate-180')}
            />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-5 -mt-1">
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
