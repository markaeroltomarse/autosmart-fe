import Logo from '../Logo';

export default function AdminNav() {
  return (
    <>
      <div className="bg-black text-white p-5 w-full flex px-5 md:px-[10%] justify-between items-center">
        <Logo className="w-[120px] h-[50px] rounded" />

        <div>
          <h3>Administrator</h3>
        </div>
      </div>
    </>
  );
}
