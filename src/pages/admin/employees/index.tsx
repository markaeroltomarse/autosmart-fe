import AdminView from "@/components/Views/admin.view";

export interface EmployeesPageProps {

}

const EmployeesPage: React.FC<EmployeesPageProps> = (props) => {
    const { } = props;

    return <AdminView page="Employees">
        <h3 className="font-bold text-lg text-slate-600 mb-4">Employees Record</h3>
    </AdminView>;
};

export default EmployeesPage;
