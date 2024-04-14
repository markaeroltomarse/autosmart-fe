import { ChangeEventHandler } from 'react';

interface ISelectProps {
  options: string[];
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  className?: string;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  name?: string;
  label?: string
}

export default function Select({
  options,
  onChange,
  className,
  placeholder,
  required,
  value,
  name,
  label
}: ISelectProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        {required && <span className="text-red-500">*</span>}
        {label && <small>{label}</small>}
      </div>
      <div className={`px-3 border ${className}`}>
        <select
          name={name}
          className={` rounded outline-none  w-full bg-transparent`}
          onChange={onChange}
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option) =>
            option === value ? (
              <option key={option} value={option} selected>
                {option}
              </option>
            ) : (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </select>
      </div>
    </div>

  );
}
