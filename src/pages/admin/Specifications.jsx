import { useState, useCallback, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Breadcrumb from "../../components/Breadcrumb";
import { FaTrashAlt } from "react-icons/fa";
import { CrudTableToolbar } from "../../components/tables/CrudTable";
import { useCrudTable } from "../../hooks/useCrudTable";
import { adminCatalogService } from "../../services/admin/catalogService";

const Specifications = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    adminCatalogService.getSubCategories().then(setSubCategories).catch(() => {});
  }, []);

  const fetchFn = useCallback(() => adminCatalogService.getSpecificationsList(), []);
  const deleteFn = useCallback((id) => adminCatalogService.deleteSpecification(id), []);

  const {
    filteredData,
    loading,
    searchText,
    pagination,
    handleDelete,
    handleSearch,
    handlePaginationChange,
    reload,
  } = useCrudTable({
    fetchFn,
    deleteFn,
    searchFields: ["name", "description"],
    fetchErrorMessage: "Failed to fetch specifications",
  });

  const handleAddSpecifications = async () => {
    const values = await form.validateFields();
    try {
      const created = await adminCatalogService.createSpecifications(values);
      message.success("Specifications added successfully");
      form.resetFields();
      setIsModalVisible(false);
      await reload();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to add specifications");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this specification?"
          onConfirm={() => handleDelete(record.key)}
        >
          <Button icon={<FaTrashAlt />} size="small" danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white">
      <Breadcrumb />
      <div className="row flex justify-between mt-2">
        <h3 className="text-2xl font-semibold">Specifications</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Specification
        </Button>
      </div>
      <Table
        dataSource={filteredData}
        loading={loading}
        columns={columns}
        rowClassName="editable-row"
        pagination={{
          pageSize: pagination.pageSize,
          current: pagination.current,
          onChange: handlePaginationChange,
        }}
        title={() => (
          <CrudTableToolbar
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            searchText={searchText}
            onSearch={handleSearch}
            searchPlaceholder="Search specification"
          />
        )}
      />
      <Modal
        title="Add Specifications"
        open={isModalVisible}
        onOk={handleAddSpecifications}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ specifications: [{ name: "", description: "" }] }}
        >
          <Form.Item
            label="Sub Category"
            name="subCategoryId"
            rules={[{ required: true, message: "Please select a sub-category!" }]}
          >
            <Select
              placeholder="Select a sub-category"
              options={subCategories.map((cat) => ({ label: cat.name, value: cat.id }))}
            />
          </Form.Item>
          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center" }}>
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Please input the name!" }]}
                      style={{ flex: 1, marginRight: 8 }}
                    >
                      <Input placeholder="Specification Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      rules={[{ required: true, message: "Please input the description!" }]}
                      style={{ flex: 1, marginRight: 8 }}
                    >
                      <Input.TextArea placeholder="Description" rows={1} />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />} danger>
                      Remove
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} style={{ width: "100%" }} icon={<PlusOutlined />}>
                    Add Specification
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default Specifications;
