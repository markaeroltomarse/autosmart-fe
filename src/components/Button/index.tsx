
interface ButtonProps {
  buttonType?: 'submit' | 'button' | 'reset';
  buttonClass?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
  loading?: boolean;
}

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export default function Button({
  buttonType = 'button',
  buttonClass,
  title = '',
  onClick,
  disabled,
  icon,
  loading,
}: ButtonProps): JSX.Element {
  return (
    <button
      type={buttonType}
      className={`btn bg-gradient-to-r font-bold text-base leading-6 rounded-lg transition duration-150 ease-in-out px-3 ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        } ${buttonClass || 'h-12 px-6 py-2.5'} ${icon && !loading ? 'flex items-center gap-2' : 'flex justify-center items-center'
        }`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {icon && <div>{icon}</div>}
          <div>{title}</div>
        </>
      )}
    </button>
  );
}
