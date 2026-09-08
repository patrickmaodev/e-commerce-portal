import { useState, useCallback } from "react";
import { Input, Button, Popconfirm, message, Modal, Form } from "antd";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumb";
import DataTable from "../../components/tables/DataTable";
import { useServerTable } from "../../hooks/useServerTable";
import { vendorService } from "../../services/admin/vendorService";

export default function VendorsList() {
  const [submitting, setSubmitting] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchVendors = useCallback(
    (params) => vendorService.getVendors(params),
    []
  );

  const {
    data: dataSource,
    setData,
    loading,
    error,
    search,
    pagination,
    handlePaginationChange,
    handleSearch,
    reload,
  } = useServerTable({ fetchFn: fetchVendors, initialPageSize: 20 });

  const startEditing = (record) => setEditingKey(record.key);
  const cancelEditing = () => setEditingKey("");

  const saveEdit = async (key) => {
    const row = dataSource.find((item) => item.key === key);
    setSubmitting(true);
    try {
      await vendorService.updateVendor(key, {
        user: {
          firstName: row.user.firstName,
          lastName: row.user.lastName,
          email: row.user.email,
        },
      });
      message.success("Vendor updated successfully");
      setEditingKey("");
      reload();
    } catch {
      message.error("Failed to update vendor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (key, column, value) => {
    setData((prev) => {
      const next = [...prev];
      const index = next.findIndex((item) => item.key === key);
      if (index > -1 && ["firstName", "lastName", "email"].includes(column)) {
        next[index] = {
          ...next[index],
          user: { ...next[index].user, [column]: value },
        };
      }
      return next;
    });
  };

  const handleDelete = async (key) => {
    try {
      await vendorService.deleteVendor(key);
      message.success("Vendor deleted successfully");
      reload();
    } catch {
      message.error("Failed to delete vendor");
    }
  };

  const handleAddVendor = async () => {
    const values = await form.validateFields();
    try {
      setSubmitting(true);
      await vendorService.createVendor(values);
      message.success("Vendor added successfully");
      form.resetFields();
      setIsModalVisible(false);
      reload();
    } catch (err) {
      message.error(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: ["user", "firstName"],
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.user.firstName}
            onChange={(e) => handleInputChange(record.key, "firstName", e.target.value)}
          />
        ) : (
          record.user.firstName
        ),
    },
    {
      title: "Last Name",
      dataIndex: ["user", "lastName"],
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.user.lastName}
            onChange={(e) => handleInputChange(record.key, "lastName", e.target.value)}
          />
        ) : (
          record.user.lastName
        ),
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.user.email}
            onChange={(e) => handleInputChange(record.key, "email", e.target.value)}
          />
        ) : (
          record.user.email
        ),
    },
    {
      title: "Actions",
      render: (_, record) => {
        const editable = editingKey === record.key;
        return editable ? (
          <span>
            <Button type="link" onClick={() => saveEdit(record.key)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button type="link" onClick={cancelEditing}>Cancel</Button>
          </span>
        ) : (
          <span>
            <Button
              icon={<FaEdit />}
              onClick={() => startEditing(record)}
              size="small"
              style={{ marginRight: 8 }}
            />
            <Popconfirm
              title="Are you sure to delete this vendor?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button icon={<FaTrashAlt />} size="small" danger />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white">
      <Breadcrumb />

      <div className="row flex justify-between mt-2">
        <h3 className="text-2xl font-semibold">Vendors List</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Vendor
        </Button>
      </div>

      <div className="mt-2 overflow-x-auto">
        <DataTable
          columns={columns}
          dataSource={dataSource}
          loading={loading || submitting}
          error={error}
          onRetry={reload}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          search={search}
          onSearch={handleSearch}
          searchPlaceholder="Search vendors"
        />
      </div>

      <Modal
        title="Add New Vendor"
        open={isModalVisible}
        onOk={handleAddVendor}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
