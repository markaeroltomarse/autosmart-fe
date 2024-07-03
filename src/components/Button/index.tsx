
interface ButtonProps {
  buttonType?: 'submit' | 'button' | 'reset';
  buttonClass?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  isNotRounded?: boolean
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

const getVariantClasses = (variant: 'primary' | 'secondary' | 'danger' | 'success' | undefined) => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 hover:bg-blue-700 text-white';
    case 'secondary':
      return 'bg-gray-600 hover:bg-gray-700 text-white';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white';
    case 'success':
      return 'bg-green-600 hover:bg-green-700 text-white';
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white';
  }
};

const getSizeClasses = (size: 'small' | 'medium' | 'large' | undefined) => {
  switch (size) {
    case 'small':
      return 'h-8 px-3 text-sm';
    case 'medium':
      return 'h-10 px-5 text-base';
    case 'large':
      return 'h-12 px-6 text-lg';
    default:
      return 'h-10 px-5 text-base';
  }
};

export default function Button({
  buttonType = 'button',
  buttonClass,
  title = '',
  onClick,
  disabled,
  icon,
  loading,
  variant = 'primary',
  size = 'medium',
  isNotRounded
}: ButtonProps): JSX.Element {
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <button
      type={buttonType}
      className={`btn font-bold leading-6 ${!isNotRounded && 'rounded-lg'} transition duration-150 ease-in-out ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        } ${variantClasses} ${sizeClasses} ${buttonClass} ${icon && !loading ? 'flex items-center gap-2' : 'flex justify-center items-center'
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
