import { useRouter } from 'next/router';
import ButtonGroup from '../ButtonGroup';

interface IAdminMenuProps {
  defaultValue: string;
}
export default function AdminMenu({ defaultValue }: IAdminMenuProps) {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-start items-center mt-[20%] border-r pr-10">
        <ButtonGroup
          values={['Home', 'Inventory', 'Orders', 'Category', 'Riders']}
          isVertical={true}
          onClick={(data) => {
            router.replace(
              `/admin/${data.selected === 'Home' ? '/' : data.selected.toLowerCase()
              }`
            );
          }}
          defaultValue={defaultValue}
        />
      </div>
    </>
  );
}
