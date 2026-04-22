import { ArrowDown, ArrowUp, CornerDownLeft, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CLINICAL_TAG_CATEGORIES } from '../../data/clinicalTagCatalog';

type FlatRow = { categoryTitle: string; label: string };

function buildVisibleRows(query: string): FlatRow[] {
  const q = query.trim().toLowerCase();
  const rows: FlatRow[] = [];
  for (const cat of CLINICAL_TAG_CATEGORIES) {
    const tags = cat.tags.filter((t) => !q || t.toLowerCase().includes(q));
    for (const label of tags) {
      rows.push({ categoryTitle: cat.title, label });
    }
  }
  return rows;
}

function groupRowsForRender(rows: FlatRow[]): { title: string; items: FlatRow[] }[] {
  const map = new Map<string, FlatRow[]>();
  for (const row of rows) {
    const list = map.get(row.categoryTitle) ?? [];
    list.push(row);
    map.set(row.categoryTitle, list);
  }
  return [...map.entries()].map(([title, items]) => ({ title, items }));
}

export function ClinicalTagsMenu({
  open,
  onSelect,
  onDismiss,
}: {
  open: boolean;
  onSelect: (label: string) => void;
  onDismiss: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const flatRows = useMemo(() => buildVisibleRows(query), [query]);
  const sections = useMemo(() => groupRowsForRender(flatRows), [flatRows]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setSelectedIndex(0);
  }, [open]);

  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(0, flatRows.length - 1)));
  }, [flatRows.length]);

  useEffect(() => {
    if (!open || flatRows.length === 0) return;
    const el = itemRefs.current.get(selectedIndex);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [open, selectedIndex, flatRows.length]);

  const indexedSections = useMemo(() => {
    let i = 0;
    return sections.map((sec) => ({
      title: sec.title,
      items: sec.items.map((row) => ({ row, index: i++ })),
    }));
  }, [sections]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
        return;
      }
      if (flatRows.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % flatRows.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + flatRows.length) % flatRows.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const row = flatRows[selectedIndex];
        if (row) onSelect(row.label);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, flatRows, selectedIndex, onSelect, onDismiss]);

  if (!open) return null;

  return (
    <div
      id="clinical-tags-listbox"
      data-name="ClinicalTagsMenu"
      role="listbox"
      aria-label="Clinical tags"
      aria-activedescendant={flatRows[selectedIndex] ? `clinical-tag-${selectedIndex}` : undefined}
      className="absolute left-0 top-[98px] z-50 flex w-[min(100%,380px)] max-h-[min(72vh,440px)] flex-col overflow-hidden rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] shadow-[0px_16px_48px_-12px_rgba(15,23,42,0.18)]"
    >
      <div className="shrink-0 border-b border-[var(--ds-border)] px-[12px] py-[10px]">
        <div className="flex items-center gap-[8px]">
          <Search className="size-[16px] shrink-0 text-[var(--ds-text-secondary)]" strokeWidth={1.5} aria-hidden />
          <p className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
            Clinical tags
          </p>
          <span className="ml-auto font-['Inter',sans-serif] text-[12px] font-normal leading-[18px] text-[var(--ds-text-muted)]">
            Filter…
          </span>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          placeholder="Search tags…"
          className="mt-[8px] w-full rounded-[var(--ds-radius-input)] border border-[var(--ds-border)] bg-[var(--ds-bg-secondary)] px-[8px] py-[6px] font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[var(--ds-text-primary)] outline-none placeholder:text-[var(--ds-text-muted)] focus:border-[var(--ds-border-accent)]"
          aria-label="Search clinical tags"
          autoFocus
        />
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-[4px]">
        {flatRows.length === 0 ? (
          <p className="px-[12px] py-[16px] font-['Inter',sans-serif] text-[14px] text-[var(--ds-text-secondary)]">No tags match your search.</p>
        ) : (
          indexedSections.map((section) => (
            <div key={section.title} className="mb-[4px]">
              <div className="sticky top-0 z-[1] bg-[var(--ds-bg-accent-purple)] px-[12px] py-[8px] font-['Inter',sans-serif] text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[var(--ds-primary-action)]">
                {section.title}
              </div>
              <div className="px-[6px] pb-[4px] pt-[2px]">
                {section.items.map(({ row, index: idx }) => {
                  const isActive = idx === selectedIndex;
                  return (
                    <button
                      key={`${row.categoryTitle}-${row.label}`}
                      ref={(el) => {
                        if (el) itemRefs.current.set(idx, el);
                        else itemRefs.current.delete(idx);
                      }}
                      id={`clinical-tag-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(row.label);
                      }}
                      className={`flex w-full items-center justify-between gap-[8px] rounded-[var(--ds-radius-button)] px-[10px] py-[10px] text-left font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] transition-colors ${
                        isActive
                          ? 'bg-[var(--ds-primary-brand)] text-white'
                          : 'text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-accent-purple)]/60'
                      }`}
                    >
                      <span>{row.label}</span>
                      <span
                        className={`flex size-[20px] shrink-0 items-center justify-center rounded-[4px] font-medium ${
                          isActive ? 'bg-white/20 text-white' : 'text-[var(--ds-text-secondary)]'
                        }`}
                        aria-hidden
                      >
                        ›
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-[var(--ds-border)] bg-[var(--ds-bg-tertiary)] px-[12px] py-[8px] font-['Inter',sans-serif] text-[11px] font-medium leading-[16px] text-[var(--ds-text-secondary)]">
        <span className="inline-flex items-center gap-[6px]">
          <ArrowUp className="size-[14px] opacity-70" aria-hidden />
          <ArrowDown className="size-[14px] opacity-70" aria-hidden />
          Navigate
        </span>
        <span className="inline-flex items-center gap-[6px]">
          <CornerDownLeft className="size-[14px] opacity-70" aria-hidden />
          Next
        </span>
      </div>
    </div>
  );
}
