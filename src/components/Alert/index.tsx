import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineWarning,
} from 'react-icons/ai';

interface IAlertProps {
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
}

export default function Alert(props: IAlertProps) {
  const colorType =
    props.type === 'success'
      ? 'green'
      : props.type === 'error'
      ? 'red'
      : 'yellow';

  const border =
    props.type === 'success'
      ? 'border-green-500'
      : props.type === 'error'
      ? 'border-red-500'
      : 'border-yellow-500';

  const bgColor =
    props.type === 'success'
      ? 'bg-green-200'
      : props.type === 'error'
      ? 'bg-red-200'
      : 'bg-yellow-200';

  const textColor =
    props.type === 'success'
      ? 'text-green-700'
      : props.type === 'error'
      ? 'text-red-700'
      : 'text-yellow-700';

  const icon =
    props.type === 'success' ? (
      <AiOutlineCheckCircle color={colorType} size={30} />
    ) : props.type === 'error' ? (
      <AiOutlineCloseCircle color={colorType} size={30} />
    ) : (
      <AiOutlineWarning color={colorType} size={30} />
    );
  return (
    <div
      className={`transition duration-500 transform hover:-translate-x-4 w-[300px] p-3 rounded border-2 ${border} ${bgColor} flex fixed top-[100] right-[10%] ${textColor}`}
    >
      <div className="w-[50px]">{icon}</div>

      <div>
        <h4 className={`font-bold text-${colorType}-900`}>{props.title}</h4>
        <small>{props.message}</small>
      </div>
    </div>
  );
}
