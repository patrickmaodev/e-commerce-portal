import { useState, useMemo, useCallback } from "react";
import { Button, Modal, Form, Input } from "antd";
import PageShell from "../../components/layout/PageShell";
import { CrudTable, buildEditableColumns } from "../../components/tables/CrudTable";
import { useCrudTable } from "../../hooks/useCrudTable";
import { adminCatalogService } from "../../services/admin/catalogService";

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchFn = useCallback(() => adminCatalogService.getCategories(), []);
  const updateFn = useCallback(
    (id, row) => adminCatalogService.updateCategory(id, row),
    []
  );
  const deleteFn = useCallback(
    (id) => adminCatalogService.deleteCategory(id),
    []
  );
  const createFn = useCallback(
    (values) => adminCatalogService.createCategory(values),
    []
  );

  const {
    filteredData,
    loading,
    editingKey,
    searchText,
    pagination,
    startEditing,
    cancelEditing,
    handleInputChange,
    saveEdit,
    handleDelete,
    handleCreate,
    handleSearch,
    handlePaginationChange,
  } = useCrudTable({
    fetchFn,
    updateFn,
    deleteFn,
    createFn,
    fetchErrorMessage: "Failed to fetch categories",
  });

  const columns = useMemo(
    () =>
      buildEditableColumns({
        columns: [
          { title: "Category Name", dataIndex: "name", editable: true },
          { title: "Description", dataIndex: "description", editable: true },
        ],
        editingKey,
        onInputChange: handleInputChange,
        onStartEditing: startEditing,
        onSaveEdit: saveEdit,
        onCancelEditing: cancelEditing,
        onDelete: handleDelete,
        deleteTitle: "Are you sure to delete this category?",
      }),
    [editingKey, handleInputChange, startEditing, saveEdit, cancelEditing, handleDelete]
  );

  const handleAddCategory = async () => {
    const values = await form.validateFields();
    const success = await handleCreate(values);
    if (success) {
      form.resetFields();
      setIsModalVisible(false);
    }
  };

  return (
    <PageShell
      title="Categories"
      actions={
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add category
        </Button>
      }
    >
      <CrudTable
          filteredData={filteredData}
          loading={loading}
          columns={columns}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          searchText={searchText}
          onSearch={handleSearch}
          searchPlaceholder="Search categories"
        />
      <Modal
        title="Add New Category"
        open={isModalVisible}
        onOk={handleAddCategory}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input category description!" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
};

export default Categories;
