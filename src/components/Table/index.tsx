import { useEffect, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';
import TableOptions from './action-options';

interface ITableProps {
  headers: {
    value: string;
    id?: string;
    columnClassName?: string;
    key: string;
  }[];
  data: { [key: string]: any }[];
  rowClassName?: {
    key: string;
    className?: string;
    customElement?: (value: any, id: string) => JSX.Element;
  }[];
  title: string;
  onSelectAction?: (data: { id: string; type: 'edit' | 'delete' | '' }) => void;
  selectedItem?: any;
}

export default function Table({
  headers,
  data,
  rowClassName,
  title,
  onSelectAction,
  selectedItem,
}: ITableProps) {
  const [actionSelected, setActionSelected] = useState<{
    id: string;
    type: 'edit' | 'delete' | '';
  } | null>(null);

  useEffect(() => {
    if (onSelectAction && actionSelected) {
      onSelectAction(actionSelected);
    }
  }, [actionSelected, onSelectAction]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header.id ?? header.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.columnClassName}`}
              >
                {header.value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              {headers.map((header) => {
                if (header.key === 'action') {
                  return (
                    <td
                      key={header.key}
                      className="py-4 whitespace-nowrap flex justify-center"
                    >
                      <MdMoreVert
                        size={25}
                        onClick={() =>
                          actionSelected?.id !== item.id
                            ? setActionSelected({ id: item.id, type: '' })
                            : setActionSelected({ id: '', type: '' })
                        }
                        className="cursor-pointer"
                      />
                      {actionSelected?.id === item.id && selectedItem && (
                        <TableOptions
                          id={item.id}
                          setActionSelected={setActionSelected}
                        />
                      )}
                    </td>
                  );
                }

                const config = rowClassName?.find((row) => row.key === header.key);
                return (
                  <td
                    key={header.key}
                    className={`px-6 py-4 whitespace-nowrap ${config?.className}`}
                  >
                    {config?.customElement
                      ? config.customElement(item[header.key], item.id)
                      : item[header.key]}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td colSpan={headers.length}>
              <div className="py-3 px-5 flex justify-between">
                <div></div>
                <div>
                  <h3 className="text-xl font-bold">
                    {title}: {data.length}
                  </h3>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
