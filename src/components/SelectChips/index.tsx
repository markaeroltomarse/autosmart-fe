import Button from '../Button';

interface ISelecteChipsProps {
  options: string[] | number[];
  multiple?: boolean;
  onSelectOne: (selectedValue: string | number) => void;
  defaultValueOne?: any;
}

export default function SelectChips(props: ISelecteChipsProps) {
  return (
    <div className="flex gap-2">
      {props.options.map((value: string | number) => (
        <Button
          key={value}
          title={String(value)}
          buttonClass={`max-w-[500px] border-2 px-3 py-2 rounded  focus:border-red-500 ${
            String(value).toLowerCase() === props.defaultValueOne.toLowerCase()
              ? 'border-red-500'
              : 'border-slate-400'
          }`}
          onClick={() => {
            if (!props.multiple) {
              props.onSelectOne(value);
            } else {
              // insert in array
            }
          }}
        />
      ))}
    </div>
  );
}
