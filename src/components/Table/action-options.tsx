interface ITableOptionsProps {
  id: string;
  setActionSelected: (data: { id: string; type: 'edit' | 'delete' | '' }) => void
}

export default function TableOptions({
  id,
  setActionSelected,
}: ITableOptionsProps) {
  return (
    <div className="flex flex-col bg-slate-200 shadow-md absolute p-3 rounded my-1 gap-1 ml-[100px]">
      <button onClick={() => setActionSelected({ id: id, type: 'edit' })}>
        Edit
      </button>
      <button onClick={() => setActionSelected({ id: id, type: 'delete' })}>
        Delete
      </button>
    </div>
  );
}
