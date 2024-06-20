import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';
import InventoryPredictionChart from '@/components/Charts/InventoryPredictionChart';
import SalesPredictionChart from '@/components/Charts/SalesPredictionData';
import SummaryDashboard from '@/components/SummaryDashboard';

export default function Dashboard() {
  return (
    <>
      <main className="">
        <AdminNav />
        <div className="px-5 md:px-[10%] w-full">
          <h1 className="font-bold text-2xl text-slate-500 my-5">Dashboard</h1>
          <div className="flex min-h-[80vh] w-full  ">
            <div className="flex-none">
              <AdminMenu defaultValue="Dashboard" />
            </div>
            <div className='w-[100%] px-5'>
              <SummaryDashboard />
              <br />
              <SalesPredictionChart />
              <br />
              <InventoryPredictionChart />
              <br />
              <br />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
