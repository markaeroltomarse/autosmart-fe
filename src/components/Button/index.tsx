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
  title = 'Default title',
  onClick,
  disabled,
}: ButtonProps): JSX.Element {
  return (
    <button
      type={buttonType}
      className={`btn bg-gradient-to-r  h-12 w-full px-6 py-2.5 font-bold text-base leading-6 rounded-lg transition duration-150 ease-in-out ${
        disabled
          ? 'from-PFriends-lightYellow to-PFriends-peach text-primary/80'
          : ' from-PFriends-gold to-PFriends-amber text-primary'
      } ${buttonClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
}
