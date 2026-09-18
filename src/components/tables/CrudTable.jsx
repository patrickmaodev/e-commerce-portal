/**
 * Lightweight table wrapper for small reference-data CRUD screens
 * (categories, statuses, banners, etc.). For products, orders, vendors,
 * and other growing datasets, use DataTable + useServerTable instead.
 */
import { Table, Input, Button, Popconfirm, Select } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import { actionIcon } from "../icons/menuIcon";

export function CrudTableToolbar({
  pagination,
  onPaginationChange,
  searchText,
  onSearch,
  searchPlaceholder = "Search",
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-1 pb-3">
      <Select
        defaultValue={5}
        onChange={(value) => onPaginationChange(pagination.current, value)}
        options={[
          { label: "5", value: 5 },
          { label: "10", value: 10 },
          { label: "20", value: 20 },
        ]}
        style={{ marginRight: 10, width: 100 }}
      />
      <Input.Search
        placeholder={searchPlaceholder}
        value={searchText}
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: 300 }}
      />
    </div>
  );
}

export function buildEditableColumns({
  columns,
  editingKey,
  onInputChange,
  onStartEditing,
  onSaveEdit,
  onCancelEditing,
  onDelete,
  deleteTitle = "Are you sure to delete this item?",
}) {
  const dataColumns = columns.map((col) => ({
    ...col,
    render: col.editable
      ? (_, record) =>
          editingKey === record.key ? (
            <Input
              defaultValue={record[col.dataIndex]}
              onChange={(e) =>
                onInputChange(record.key, col.dataIndex, e.target.value)
              }
            />
          ) : (
            record[col.dataIndex]
          )
      : col.render,
  }));

  return [
    ...dataColumns,
    {
      title: "Actions",
      render: (_, record) => {
        const editable = editingKey === record.key;
        return editable ? (
          <span>
            <Button type="link" onClick={() => onSaveEdit(record.key)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button type="link" onClick={onCancelEditing}>Cancel</Button>
          </span>
        ) : (
          <span>
            <Button
              icon={actionIcon(Pencil)}
              onClick={() => onStartEditing(record)}
              size="small"
              style={{ marginRight: 8 }}
            />
            <Popconfirm title={deleteTitle} onConfirm={() => onDelete(record.key)}>
              <Button icon={actionIcon(Trash2)} size="small" danger />
            </Popconfirm>
          </span>
        );
      },
    },
  ];
}

export function CrudTable({
  filteredData,
  loading,
  columns,
  pagination,
  onPaginationChange,
  searchText,
  onSearch,
  searchPlaceholder,
}) {
  return (
    <Table
      dataSource={filteredData}
      loading={loading}
      columns={columns}
      rowClassName="editable-row"
      pagination={{
        pageSize: pagination.pageSize,
        current: pagination.current,
        onChange: onPaginationChange,
      }}
      title={() => (
        <CrudTableToolbar
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          searchText={searchText}
          onSearch={onSearch}
          searchPlaceholder={searchPlaceholder}
        />
      )}
    />
  );
}
