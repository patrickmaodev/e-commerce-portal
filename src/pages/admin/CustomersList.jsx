import { useCallback } from "react";
import PageShell from "../../components/layout/PageShell";
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
    <PageShell
      title="Customers"
      description="Browse and search registered customer accounts."
      noPadding
    >
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
    </PageShell>
  );
}
