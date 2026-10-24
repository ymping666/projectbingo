export function ChoiceGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  detailed = false,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; detail?: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  detailed?: boolean;
}) {
  return (
    <fieldset
      className={`choice-field ${detailed ? 'choice-field-detailed' : ''}`}
      disabled={disabled}
    >
      <legend>{label}</legend>
      <div className="choice-options">
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            <span>{option.label}</span>
            {option.detail && <small>{option.detail}</small>}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
