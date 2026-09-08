import { useCallback } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import DataTable from "../../components/tables/DataTable";
import { useServerTable } from "../../hooks/useServerTable";
import { customerService } from "../../services/admin/customerService";

export default function CustomersList() {
  const fetchCustomers = useCallback((params) => customerService.getCustomers(params), []);

  const {
    data: dataSource,
    loading,
    error,
    search,
    pagination,
    handlePaginationChange,
    handleSearch,
    reload,
  } = useServerTable({ fetchFn: fetchCustomers, initialPageSize: 20 });

  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "First Name", dataIndex: ["user", "firstName"] },
    { title: "Last Name", dataIndex: ["user", "lastName"] },
    { title: "Email", dataIndex: ["user", "email"] },
  ];

  return (
    <div className="p-6 bg-white">
      <Breadcrumb />
      <h3 className="text-2xl font-semibold mt-2 mb-4">Customers</h3>
      <DataTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        error={error}
        onRetry={reload}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        search={search}
        onSearch={handleSearch}
        searchPlaceholder="Search customers"
      />
    </div>
  );
}
