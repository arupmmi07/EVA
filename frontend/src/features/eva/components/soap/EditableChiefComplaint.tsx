import { ClinicalTagsMenu } from './ClinicalTagsMenu';

export function EditableChiefComplaint({
  label,
  value,
  editable,
  focused,
  mentionVisible,
  onChange,
  onFocusChange,
  onSelectMention,
  onDismissClinicalTags,
}: {
  label: string;
  value: string;
  editable: boolean;
  focused: boolean;
  mentionVisible: boolean;
  onChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  onSelectMention: (value: string) => void;
  onDismissClinicalTags: () => void;
}) {
  return (
    <div className="relative" data-name="EditableChiefComplaint">
      <p className="mb-[8px] font-['Inter',sans-serif] text-[12px] font-semibold uppercase leading-[18px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
        {label}
      </p>
      {editable ? (
        <div
          className={`rounded-[var(--ds-radius-card)] border px-[12px] py-[8px] ${
            focused ? 'border-[var(--ds-primary-accent)]' : 'border-[var(--ds-border)]'
          }`}
        >
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => onFocusChange(true)}
            onBlur={() => window.setTimeout(() => onFocusChange(false), 120)}
            className="min-h-[58px] w-full resize-none border-none bg-transparent font-['Inter',sans-serif] text-[14px] font-normal leading-[28px] text-[var(--ds-text-primary)] outline-none"
            aria-label={label}
            aria-controls={mentionVisible ? 'clinical-tags-listbox' : undefined}
            aria-expanded={mentionVisible}
            aria-autocomplete="list"
          />
          <p className="font-['Inter',sans-serif] text-[11px] leading-[16px] text-[var(--ds-text-secondary)]">Type `@` to insert a clinical tag.</p>
        </div>
      ) : (
        <p className="font-['Inter',sans-serif] text-[14px] font-normal leading-[28px] text-[var(--ds-text-primary)]">{value}</p>
      )}

      {editable && mentionVisible && (
        <ClinicalTagsMenu open={mentionVisible} onSelect={onSelectMention} onDismiss={onDismissClinicalTags} />
      )}
    </div>
  );
}
