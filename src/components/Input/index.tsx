import { ChangeEventHandler, FocusEventHandler } from 'react';

interface IInputProps {
  type: string;
  className?: string;
  placeholder?: string;
  isIconLeft?: boolean;
  icon?: JSX.Element;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  onFocus?: FocusEventHandler<HTMLInputElement> | undefined;
  value?: number | string;
  width?: number;
  pattern?: string;
  title?: string;
  required?: boolean;
  name?: string;
  label?: string;
  minLength?: number
  maxLength?: number
}

export default function Input({
  type,
  className,
  placeholder,
  isIconLeft,
  icon,
  onChange,
  value,
  width,
  pattern,
  title,
  required,
  name,
  onBlur,
  onFocus,
  label,
  ...rest
}: IInputProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        {required && <span className="text-red-500">*</span>}
        {label && <small>{label}</small>}
      </div>
      <div
        className={`flex flex-row items-center relative bg-white border rounded p-2 gap-2 ${isIconLeft ? 'justify-start' : 'flex-row-reverse'
          } ${className}`}
      >
        <div className="flex-none">{icon}</div>
        <div className="relative flex-1 flex ">
          <input
            {...rest}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className={`outline-none bg-transparent  ${width ? `w-[${width}px]` : 'w-full'
              } `}
            value={value}
            pattern={pattern}
            title={title}
            required={required}
            name={name}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        </div>
      </div>
    </div>
  );
}
