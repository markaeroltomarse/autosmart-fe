import { useEffect, useState } from 'react';
import Button from '../Button';

interface IButtonGroupProps {
  values: string[];
  onClick: (e: any) => any;
  isVertical?: boolean;
  className?: string;
  defaultValue?: string;
}

export default function ButtonGroup({
  values,
  onClick,
  isVertical,
  className,
  defaultValue,
}: IButtonGroupProps) {
  const [buttons, setButtons] = useState<{ value: string; id: number }[]>([]);
  const [selected, setSelected] = useState<number | null>(0);

  useEffect(() => {
    setButtons(values.map((val, i) => ({ value: val, id: i })));

    if (defaultValue) {
      values.forEach((val, i) => {
        if (val === defaultValue) setSelected(i);
      });
    }
  }, [values, defaultValue]);

  return (
    <div
      className={`flex ${isVertical ? 'flex-col' : 'flex-row'} w-fit bg-transparent ${className}`}
    >
      {buttons.map((button, i) => (
        <Button
          isNotRounded
          key={button.id}
          buttonClass={`p-3 
            ${isVertical
              ? `${i === 0 ? 'rounded-t-md' : ''} ${i === buttons.length - 1 ? 'rounded-b-md' : ''}`
              : `${i === 0 ? 'rounded-l-md' : ''} ${i === buttons.length - 1 ? 'rounded-r-md' : ''}`
            }   
            ${button.id === selected
              ? 'bg-green-500 text-green-100'
              : 'hover:bg-green-300'
            }`}
          title={button.value}
          onClick={() => {
            onClick({
              selected: button.value,
            });
            setSelected(button.id);
          }}
        />
      ))}
    </div>
  );
}
