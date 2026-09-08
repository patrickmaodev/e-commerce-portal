import { useState, useMemo, useCallback, useEffect } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import Breadcrumb from "../../components/Breadcrumb";
import { CrudTable, buildEditableColumns } from "../../components/tables/CrudTable";
import { useCrudTable } from "../../hooks/useCrudTable";
import { adminCatalogService } from "../../services/admin/catalogService";

const SubCategories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    adminCatalogService.getCategoriesRaw().then(setCategories).catch(() => {});
  }, []);

  const fetchFn = useCallback(() => adminCatalogService.getSubCategories(), []);
  const updateFn = useCallback(
    (id, row) => adminCatalogService.updateSubCategory(id, row),
    []
  );
  const deleteFn = useCallback((id) => adminCatalogService.deleteSubCategory(id), []);
  const createFn = useCallback(
    (values) => adminCatalogService.createSubCategory(values),
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
    fetchErrorMessage: "Failed to fetch subcategories",
  });

  const columns = useMemo(
    () =>
      buildEditableColumns({
        columns: [
          { title: "SubCategory Name", dataIndex: "name", editable: true },
          { title: "Description", dataIndex: "description", editable: true },
        ],
        editingKey,
        onInputChange: handleInputChange,
        onStartEditing: startEditing,
        onSaveEdit: saveEdit,
        onCancelEditing: cancelEditing,
        onDelete: handleDelete,
        deleteTitle: "Are you sure to delete this subcategory?",
      }),
    [editingKey, handleInputChange, startEditing, saveEdit, cancelEditing, handleDelete]
  );

  const handleAddSubCategory = async () => {
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
        <h3 className="text-2xl font-semibold">SubCategories</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add SubCategory
        </Button>
      </div>
      <div className="mt-2">
        <CrudTable
          filteredData={filteredData}
          loading={loading}
          columns={columns}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          searchText={searchText}
          onSearch={handleSearch}
          searchPlaceholder="Search subcategories"
        />
      </div>
      <Modal
        title="Add New SubCategory"
        open={isModalVisible}
        onOk={handleAddSubCategory}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
              placeholder="Select a category"
              options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
            />
          </Form.Item>
          <Form.Item
            label="SubCategory Name"
            name="name"
            rules={[{ required: true, message: "Please input subcategory name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input subcategory description!" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubCategories;
