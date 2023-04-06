export interface CloseButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {}

const CloseButton: React.FC<CloseButtonProps> = (props) => {
  return (
    <button className='w-min' {...props}>
      <svg
        width='20'
        height='20'
        viewBox='0 0 21 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M15.5 5L5.5 15M5.5 5L15.5 15'
          stroke='#FAFAFA'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </button>
  );
};

export default CloseButton;
