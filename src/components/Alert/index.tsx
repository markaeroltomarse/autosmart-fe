import { useMemo } from 'react';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineWarning,
} from 'react-icons/ai';
import Button from '../Button';

export interface IAlertProps {
  type: 'success' | 'error' | 'warning' | 'confirm';
  title: string;
  message: string;
  onClick?: (e?: any) => void;
  className?: string;
  onOk?: () => void;
  onCancel?: () => void;
  interval?: number;
}

export default function Alert(props: IAlertProps) {
  const colorType = useMemo(() => {
    if (props.type === 'confirm') return 'black';
    return props.type === 'success'
      ? 'green'
      : props.type === 'error'
        ? 'red'
        : 'yellow';
  }, [props.type]);

  const border = useMemo(() => {
    if (props.type === 'confirm') return;
    return props.type === 'success'
      ? 'border-green-500'
      : props.type === 'error'
        ? 'border-red-500'
        : 'border-yellow-500';
  }, [props.type]);

  const bgColor = useMemo(() => {
    if (props.type === 'confirm') return 'bg-slate-200';
    return props.type === 'success'
      ? 'bg-green-200'
      : props.type === 'error'
        ? 'bg-red-200'
        : 'bg-yellow-200';
  }, [props.type]);

  const textColor = useMemo(() => {
    if (props.type === 'confirm') return 'text-slate-500';
    return props.type === 'success'
      ? 'text-green-700'
      : props.type === 'error'
        ? 'text-red-700'
        : 'text-yellow-700';
  }, [props.type]);

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
      onClick={props.onClick}
      className={`z-[5] transition duration-500 transform hover:-translate-y-2 w-[350px] p-4 rounded-lg shadow-lg border-2 ${border} ${bgColor} flex fixed top-[5%] right-[10%] ${textColor} ${props.className}`}
    >
      <div className="w-[50px] flex items-center justify-center">
        {icon}
      </div>

      <div className="flex flex-col gap-2 ml-3">
        <h4 className={`font-bold text-${colorType}-900`}>{props.title}</h4>
        <small className="text-sm">{props.message}</small>
        {props.type === 'confirm' && (
          <div className="flex justify-end items-center space-x-2 mt-2">
            <Button title="Cancel" onClick={props.onCancel} />
            <Button
              title="Yes"
              buttonClass="bg-blue-500 text-white"
              onClick={props.onOk}
            />
          </div>
        )}
      </div>
    </div>
  );
}
