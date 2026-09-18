import { Table, Input, Select, Button, Empty } from "antd";

const PAGE_SIZE_OPTIONS = [
  { label: "10 / page", value: 10 },
  { label: "20 / page", value: 20 },
  { label: "50 / page", value: 50 },
];

export default function DataTable({
  columns,
  dataSource,
  loading,
  error,
  onRetry,
  pagination,
  onPaginationChange,
  search,
  onSearch,
  searchPlaceholder = "Search",
  toolbarExtra,
}) {
  if (error) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="mb-4 text-red-500">{error}</p>
        {onRetry && (
          <Button type="primary" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      size="middle"
      scroll={{ x: "max-content" }}
      locale={{ emptyText: <Empty description="No records found" /> }}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: false,
        onChange: onPaginationChange,
        className: "dashboard-table-pagination",
      }}
      title={() => (
        <div className="dashboard-table-toolbar flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={pagination.pageSize}
              onChange={(value) => onPaginationChange(1, value)}
              options={PAGE_SIZE_OPTIONS}
              style={{ width: 120 }}
            />
            {toolbarExtra}
          </div>
          <Input.Search
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 280, maxWidth: "100%" }}
            allowClear
          />
        </div>
      )}
    />
  );
}
