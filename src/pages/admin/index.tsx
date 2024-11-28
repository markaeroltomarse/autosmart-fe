import InventoryPredictionChart from '@/components/Charts/InventoryPredictionChart';
import SalesPredictionChart from '@/components/Charts/SalesPredictionData';
import SummaryDashboard from '@/components/SummaryDashboard';
import AdminView from '@/components/Views/admin.view';

export default function Dashboard() {
  return (
    <>
      <AdminView page="Dashboard">
        <SummaryDashboard />
        <br />
        <SalesPredictionChart />
        <br />
        <InventoryPredictionChart />
        <br />
        <br />
      </AdminView>
    </>
  );
}
