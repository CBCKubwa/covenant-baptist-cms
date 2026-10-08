type FormFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
};

export default function FormField({
  label,
  value,
  onChange,
  required,
  textarea,
  placeholder,
  type = "text",
}: FormFieldProps) {
  const cls =
    "w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold";
  return (
    <div>
      <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={onChange} rows={4} className={cls} placeholder={placeholder} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={cls}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
