import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';

export default function Dashboard() {
  return (
    <>
      <main className="">
        <AdminNav />
        <div className="px-5 md:px-[10%]">
          <h1 className="font-bold text-2xl text-slate-500">Dashboard</h1>
          <div className="flex min-h-[80vh]">
            <div>
              <AdminMenu defaultValue="Home" />
            </div>
            <div className=""></div>
          </div>
        </div>
      </main>
    </>
  );
}
