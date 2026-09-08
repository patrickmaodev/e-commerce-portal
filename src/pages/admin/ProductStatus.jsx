import { useState, useMemo, useCallback } from "react";
import { Button, Modal, Form, Input } from "antd";
import Breadcrumb from "../../components/Breadcrumb";
import { CrudTable, buildEditableColumns } from "../../components/tables/CrudTable";
import { useCrudTable } from "../../hooks/useCrudTable";
import { adminCatalogService } from "../../services/admin/catalogService";

const ProductStatus = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchFn = useCallback(() => adminCatalogService.getProductStatuses(), []);
  const updateFn = useCallback(
    (id, row) => adminCatalogService.updateProductStatus(id, row),
    []
  );
  const deleteFn = useCallback(
    (id) => adminCatalogService.deleteProductStatus(id),
    []
  );
  const createFn = useCallback(
    (values) => adminCatalogService.createProductStatus(values),
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
    searchFields: ["statusName", "description"],
    fetchErrorMessage: "Failed to fetch product statuses",
  });

  const columns = useMemo(
    () =>
      buildEditableColumns({
        columns: [
          { title: "Name", dataIndex: "statusName", editable: true },
          { title: "Description", dataIndex: "description", editable: true },
        ],
        editingKey,
        onInputChange: handleInputChange,
        onStartEditing: startEditing,
        onSaveEdit: saveEdit,
        onCancelEditing: cancelEditing,
        onDelete: handleDelete,
        deleteTitle: "Are you sure to delete this product status?",
      }),
    [editingKey, handleInputChange, startEditing, saveEdit, cancelEditing, handleDelete]
  );

  const handleAddProductStatus = async () => {
    const values = await form.validateFields();
    const success = await handleCreate(values);
    if (success) {
      form.resetFields();
      setIsModalVisible(false);
    }
  };

  return (
    <div className="p-6 bg-white">
      <Breadcrumb />
      <div className="row flex justify-between mt-2">
        <h3 className="text-2xl font-semibold">Product Statuses</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Product Status
        </Button>
      </div>
      <CrudTable
        filteredData={filteredData}
        loading={loading}
        columns={columns}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        searchText={searchText}
        onSearch={handleSearch}
        searchPlaceholder="Search status"
      />
      <Modal
        title="Add Product Status"
        open={isModalVisible}
        onOk={handleAddProductStatus}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="statusName"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductStatus;
