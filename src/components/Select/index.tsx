import { ChangeEventHandler } from 'react';

interface ISelectProps {
  options: string[];
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  className?: string;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  name?: string;
}

export default function Select({
  options,
  onChange,
  className,
  placeholder,
  required,
  value,
  name,
}: ISelectProps) {
  return (
    <div className={`px-3 border ${className}`}>
      <select
        name={name}
        className={` rounded outline-none py-2 w-full bg-transparent`}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) =>
          option === value ? (
            <option value={option} selected>
              {option}
            </option>
          ) : (
            <option value={option}>{option}</option>
          )
        )}
      </select>
    </div>
  );
}
