interface ButtonProps {
  buttonType?: 'submit' | 'button' | 'reset';
  buttonClass?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  buttonType = 'button',
  buttonClass,
  title = '',
  onClick,
  disabled,
}: ButtonProps): JSX.Element {
  return (
    <button
      type={buttonType}
      className={`btn bg-gradient-to-r   w-full  font-bold text-base leading-6 rounded-lg transition duration-150 ease-in-out ${
        disabled && 'opacity-50'
      } ${buttonClass || 'h-12 px-6 py-2.5'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
}
