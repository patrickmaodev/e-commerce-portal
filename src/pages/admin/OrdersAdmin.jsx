import { useCallback } from "react";
import Breadcrumb from "../../components/Breadcrumb";
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
    <div className="p-6 bg-white">
      <Breadcrumb />
      <h3 className="text-2xl font-semibold mt-2 mb-4">Orders</h3>
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
    </div>
  );
}
