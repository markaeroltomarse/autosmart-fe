import { ChangeEventHandler } from 'react';

interface IInputProps {
  type: string;
  className?: string;
  placeholder?: string;
  isIconLeft?: boolean;
  icon?: JSX.Element;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  value?: number | string;
  width?: number;
  pattern?: string;
  title?: string;
  required?: boolean;
  name?: string;
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
}: IInputProps) {
  return (
    <div
      className={`flex flex-row items-center relative bg-white border rounded p-2 gap-2 ${
        isIconLeft ? 'justify-start' : 'flex-row-reverse'
      } ${className}`}
    >
      <div className="flex-none">{icon}</div>
      <div className="relative flex-1">
        <input
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={`outline-none bg-transparent  ${
            width ? `w-[${width}px]` : 'w-full'
          } `}
          value={value}
          min={0}
          pattern={pattern}
          title={title}
          required={required}
          name={name}
        />
      </div>
    </div>
  );
}
