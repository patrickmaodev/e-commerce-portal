import { useCallback } from "react";
import PageShell from "../../components/layout/PageShell";
import DataTable from "../../components/tables/DataTable";
import { useServerTable } from "../../hooks/useServerTable";
import { orderService } from "../../services/admin/orderService";

export default function OrdersAdmin() {
  const fetchOrders = useCallback((params) => orderService.getOrders(params), []);

  const {
    data: dataSource,
    loading,
    error,
    search,
    pagination,
    handlePaginationChange,
    handleSearch,
    reload,
  } = useServerTable({ fetchFn: fetchOrders, initialPageSize: 20 });

  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    {
      title: "Date",
      dataIndex: "orderDate",
      render: (value) => (value ? new Date(value).toLocaleString() : "—"),
    },
    { title: "Customer", dataIndex: "customerName" },
    { title: "Email", dataIndex: "customerEmail" },
    { title: "Status", dataIndex: "statusName" },
    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (value) => (value != null ? `$${Number(value).toFixed(2)}` : "—"),
    },
  ];

  return (
    <PageShell title="Orders" description="Track and search marketplace orders." noPadding>
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
        searchPlaceholder="Search orders"
      />
    </PageShell>
  );
}
