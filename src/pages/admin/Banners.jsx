import { useState, useMemo, useCallback } from "react";
import {
  Button, Modal, Form, Input, DatePicker, Switch, Row, Col, Select, Popconfirm,
} from "antd";
import dayjs from "dayjs";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { CrudTable } from "../../components/tables/CrudTable";
import { useCrudTable } from "../../hooks/useCrudTable";
import { adminCatalogService } from "../../services/admin/catalogService";

const BANNER_CATEGORIES = [
  "homepage", "category-pages", "promotions", "product",
  "featured", "seasonal", "sale", "event",
];

const BANNER_TYPES = ["featured", "promotional", "seasonal"];

const Banners = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchFn = useCallback(() => adminCatalogService.getBanners(), []);
  const updateFn = useCallback(
    (id, row) => adminCatalogService.updateBanner(id, row),
    []
  );
  const deleteFn = useCallback((id) => adminCatalogService.deleteBanner(id), []);
  const createFn = useCallback(
    (values) => {
      const payload = {
        ...values,
        startDate: values.startDate?.toISOString?.() ?? values.startDate,
        endDate: values.endDate?.toISOString?.() ?? values.endDate,
      };
      return adminCatalogService.createBanner(payload);
    },
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
    searchFields: ["bannerTitle"],
    fetchErrorMessage: "Failed to fetch banners",
    rowKeyField: "bannerId",
  });

  const columns = useMemo(() => [
    {
      title: "Banner Title",
      dataIndex: "bannerTitle",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.bannerTitle}
            onChange={(e) => handleInputChange(record.key, "bannerTitle", e.target.value)}
          />
        ) : record.bannerTitle,
    },
    {
      title: "Banner Image",
      dataIndex: "bannerImageUrl",
      render: (url) => <img src={url} alt="Banner" style={{ width: 100 }} />,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (_, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={record.category}
            onChange={(value) => handleInputChange(record.key, "category", value)}
            options={BANNER_CATEGORIES.map((c) => ({ label: c, value: c }))}
          />
        ) : record.category,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (_, record) =>
        editingKey === record.key ? (
          <DatePicker
            showTime
            defaultValue={record.startDate ? dayjs(record.startDate) : null}
            onChange={(date) =>
              handleInputChange(record.key, "startDate", date ? date.toISOString() : null)
            }
          />
        ) : dayjs(record.startDate).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (_, record) =>
        editingKey === record.key ? (
          <DatePicker
            showTime
            defaultValue={record.endDate ? dayjs(record.endDate) : null}
            onChange={(date) =>
              handleInputChange(record.key, "endDate", date ? date.toISOString() : null)
            }
          />
        ) : dayjs(record.endDate).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (_, record) =>
        editingKey === record.key ? (
          <Switch
            checked={record.isActive}
            onChange={(checked) => handleInputChange(record.key, "isActive", checked)}
          />
        ) : (record.isActive ? "Yes" : "No"),
    },
    {
      title: "Type",
      dataIndex: "bannerType",
      render: (_, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={record.bannerType}
            onChange={(value) => handleInputChange(record.key, "bannerType", value)}
            options={BANNER_TYPES.map((t) => ({ label: t, value: t }))}
          />
        ) : record.bannerType,
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
            <Button icon={<FaEdit />} onClick={() => startEditing(record)} size="small" style={{ marginRight: 8 }} />
            <Popconfirm title="Are you sure to delete this banner?" onConfirm={() => handleDelete(record.key)}>
              <Button icon={<FaTrashAlt />} size="small" danger />
            </Popconfirm>
          </span>
        );
      },
    },
  ], [editingKey, handleInputChange, startEditing, saveEdit, cancelEditing, handleDelete]);

  const handleAddBanner = async () => {
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
        <h3 className="text-2xl font-semibold">Banners</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Banner
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
        searchPlaceholder="Search banner"
      />
      <Modal
        title="Add Banner"
        open={isModalVisible}
        onOk={handleAddBanner}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            category: "homepage",
            bannerType: "featured",
            isActive: false,
          }}
        >
          <Form.Item
            label="Banner Title"
            name="bannerTitle"
            rules={[{ required: true, message: "Please input banner title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Banner Image URL"
            name="bannerImageUrl"
            rules={[{ required: true, message: "Please input banner image URL!" }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "Please select start date!" }]}
              >
                <DatePicker style={{ width: "100%" }} showTime />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: "Please select end date!" }]}
              >
                <DatePicker style={{ width: "100%" }} showTime />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select a category!" }]}
              >
                <Select options={BANNER_CATEGORIES.map((c) => ({ label: c, value: c }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Banner Type"
                name="bannerType"
                rules={[{ required: true, message: "Please select banner type!" }]}
              >
                <Select options={BANNER_TYPES.map((t) => ({ label: t, value: t }))} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Is Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Banners;
