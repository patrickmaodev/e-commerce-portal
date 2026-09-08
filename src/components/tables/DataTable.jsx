import { Table, Input, Select, Button, Empty } from "antd";

const PAGE_SIZE_OPTIONS = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];

/**
 * Shared table infrastructure for operational/large datasets.
 * Feature pages own columns, row actions, filters, and business rules.
 */
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
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && <Button onClick={onRetry}>Retry</Button>}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowClassName="editable-row"
      scroll={{ x: "max-content" }}
      locale={{ emptyText: <Empty description="No data" /> }}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: false,
        onChange: onPaginationChange,
      }}
      title={() => (
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2 items-center">
            <Select
              value={pagination.pageSize}
              onChange={(value) => onPaginationChange(1, value)}
              options={PAGE_SIZE_OPTIONS}
              style={{ width: 100 }}
            />
            {toolbarExtra}
          </div>
          <Input.Search
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 300, maxWidth: "100%" }}
            allowClear
          />
        </div>
      )}
    />
  );
}
