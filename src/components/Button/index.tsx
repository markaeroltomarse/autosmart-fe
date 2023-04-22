interface ButtonProps {
  buttonType?: 'submit' | 'button' | 'reset';
  buttonClass?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
}

export default function Button({
  buttonType = 'button',
  buttonClass,
  title = '',
  onClick,
  disabled,
  icon,
}: ButtonProps): JSX.Element {
  return (
    <button
      type={buttonType}
      className={`btn bg-gradient-to-r font-bold text-base leading-6 rounded-lg transition duration-150 ease-in-out px-3 ${
        disabled && 'opacity-50'
      } ${buttonClass || 'h-12 px-6 py-2.5'} ${
        icon && 'flex items-center gap-2'
      } `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <div>{icon}</div>}
      <div>{title}</div>
    </button>
  );
}
