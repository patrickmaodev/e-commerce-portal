import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, Popconfirm, message, Modal, Form, Select, Upload, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import DataTable from "../../components/tables/DataTable";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { productService } from "../../services/vendor/productService";
import { vendorCatalogService } from "../../services/vendor/catalogService";
import { useServerTable } from "../../hooks/useServerTable";
import { PATH } from "../../constants/PATH";
import defaultProductImage from "../../assets/product-image.jpg";

const VendorProducts = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [imageSource, setImageSource] = useState("upload");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [productStatuses, setProductStatuses] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [loadingSpecifications, setLoadingSpecifications] = useState(false);

  const fetchProducts = useCallback(
    (params) => productService.getVendorProducts(params),
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
  } = useServerTable({ fetchFn: fetchProducts, initialPageSize: 20 });


  const handleSourceChange = (value) => {
    setImageSource(value);
    setFile(null);
    form.setFieldsValue({ imageFile: undefined, imageUrl: undefined });
  };

  // Load catalog metadata once (small reference data — client-side is fine)
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [categoriesRes, subCategoriesRes, statusesRes] = await Promise.all([
          vendorCatalogService.getCategories(),
          vendorCatalogService.getSubCategories(),
          vendorCatalogService.getProductStatuses(),
        ]);
        setCategories(categoriesRes);
        setSubCategories(subCategoriesRes);
        setProductStatuses(statusesRes);
      } catch {
        message.error("Failed to fetch catalog metadata");
      }
    };
    fetchCatalog();
  }, []);

  // Handle category change event
  const handleCategoryChange = async (value) => {
    form.setFieldsValue({ subCategoryId: null, specifications: []});
    setSelectedCategory(value);
    setSelectedSubCategory(null);
    setSubCategories([]);
    setLoadingSubCategories(true);
    try {
      const subCategories = await vendorCatalogService.getSubCategoriesByCategory(value);
      setSubCategories(subCategories);
    } catch (error) {
      message.error("Failed to fetch sub-categories");
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // Handle fetch specifications dynamically
  const handleSubCategoryChange = async (value) => {
    setSelectedSubCategory(value);
    setLoadingSpecifications(true);
    form.setFieldsValue({ specifications: [] });
    try {
      const specs = (await vendorCatalogService.getSpecificationsBySubCategory(value)).map((spec) => ({
        id: spec.id,
        name: spec.name,
        value: "",
      }));
      setSpecifications(specs);
      form.setFieldsValue({ specifications: specs });
    } catch (error) {
      message.error("Failed to fetch specifications");
    } finally {
      setLoadingSpecifications(false);
    }
  };

  const showModal = () => {
    setSelectedCategory(null);
    setSubCategories([]);
    setSpecifications([]);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setSubCategories([]);
    setSpecifications([]);
    form.resetFields();
    setTimeout(() => setIsModalVisible(false), 10);
  };
  
  // Start editing a row
  const startEditing = (record) => {
    setEditingKey(record.key);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingKey("");
  };

  // Save edited changes
  const saveEdit = async (key) => {
    const row = dataSource.find((item) => item.key === key);
    setSubmitting(true);
    try {
      await productService.updateProduct(key, row);
      message.success("Product updated successfully");
      setEditingKey("");
      reload();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (key, column, value) => {
    setData((prev) => {
      const next = [...prev];
      const index = next.findIndex((item) => item.key === key);
      if (index > -1) {
        next[index] = { ...next[index], [column]: value };
      }
      return next;
    });
  };

  const handleDelete = async (key) => {
    try {
      await productService.deleteProduct(key);
      message.success("Product deleted successfully");
      reload();
    } catch {
      message.error("Failed to delete product");
    }
  };

  // Validate image uploaded
  const validateFile = (rule, value) => {
    if (!file) {
      return Promise.reject(new Error("Please upload an image!"));
    }
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return Promise.reject(new Error("Only PNG or JPEG images are allowed!"));
    }
    if (file.size > 2 * 1024 * 1024) {
      return Promise.reject(new Error("File size must not exceed 2MB!"));
    }
    return Promise.resolve();
  };

  // Add new product
  const handleAddProduct = async () => {
    const values = await form.validateFields();

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("categoryId", values.categoryId);
    formData.append("subCategoryId", values.subCategoryId);
    formData.append("productStatusId", values.productStatusId);
  
    if (values.imageSource === "upload" && file) {
      formData.append("imageFile", file);
    } else if (values.imageSource === "url") {
      formData.append("imageUrl", values.imageUrl);
    } else {
      message.error("Please provide a valid image source.");
      return;
    }

    values.specifications.forEach((spec, index) => {
      formData.append(`specifications[${index}].specificationId`, spec.id);
      formData.append(`specifications[${index}].specificationName`, spec.name);
      formData.append(`specifications[${index}].value`, spec.value);
    });    

    try {
      setSubmitting(true);
      await productService.createProduct(formData);
      message.success("Product added successfully");
      form.resetFields();
      setFile(null);
      setIsModalVisible(false);
      reload();
    } catch {
      message.error("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => {
        if (!text) {
          return (
            <img
              src={defaultProductImage}
              alt="Default Placeholder"
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          );
        }
    
        const isOnlineLink = text && text.startsWith("http");
        const imageSrc = isOnlineLink
          ? text
          : `${import.meta.env.VITE_URL}${import.meta.env.VITE_PATH}${text.split(import.meta.env.VITE_PATH).pop()}`;
    
        return (
          <img
            src={imageSrc}
            alt="Product"
            style={{ width: 50, height: 50, objectFit: "cover" }}
            onError={(e) => {
              e.target.src = defaultProductImage;
            }}
          />
        );
      },
    },
    {
      title: "Product Name",
      dataIndex: "name",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.name}
            onChange={(e) =>
              handleInputChange(record.key, "name", e.target.value)
            }
          />
        ) : (
          record.name
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.description}
            onChange={(e) =>
              handleInputChange(record.key, "description", e.target.value)
            }
          />
        ) : (
          record.description
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            type="number"
            defaultValue={record.price}
            onChange={(e) =>
              handleInputChange(record.key, "price", parseFloat(e.target.value))
            }
          />
        ) : (
          record.price
        ),
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (categoryId, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={categoryId}
            onChange={(value) =>
              handleInputChange(record.key, "categoryId", value)
            }
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />
        ) : (
          categories.find((category) => category.id === categoryId)?.name || "-"
        ),
    },
    {
      title: "Sub Category",
      dataIndex: "subCategoryId",
      render: (subCategoryId, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={subCategoryId}
            onChange={(value) =>
              handleInputChange(record.key, "subCategoryId", value)
            }
            options={subCategories.map((subCategory) => ({
              value: subCategory.id,
              label: subCategory.name,
            }))}
          />
        ) : (
          subCategories.find((subCategory) => subCategory.id === subCategoryId)?.name || "-"
        ),
    },
    {
      title: "Product Status",
      dataIndex: "productStatusId",
      render: (productStatusId, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={productStatusId}
            onChange={(value) =>
              handleInputChange(record.key, "productStatusId", value)
            }
            options={productStatuses.map((status) => ({
              value: status.id,
              label: status.statusName,
            }))}
          />
        ) : (
          productStatuses.find((status) => status.id === productStatusId)?.statusName || "-"
        ),
    },
    {
      title: "Actions",
      render: (_, record) => {
        const editable = editingKey === record.key;
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => saveEdit(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button type="link" onClick={cancelEditing}>
              Cancel
            </Button>
          </span>
        ) : (
          <span>
            <Button
              icon={<FaEye />}
              onClick={() => navigate(PATH.VENDOR_PRODUCT(record.id))}
              size="small"
              style={{ marginRight: 8 }}
            >
              View
            </Button>
            <Button
              icon={<FaEdit />}
              onClick={() => startEditing(record)}
              size="small"
              style={{ marginRight: 8 }}
            />
            <Popconfirm
              title="Are you sure to delete this product?"
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
        <h3 className="text-2xl font-semibold">Products</h3>
        <Button type="primary" onClick={showModal}>
          Add Product
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
          searchPlaceholder="Search products"
        />
      </div>
      <Modal
        title="Add New Product"
        open={isModalVisible}
        onOk={handleAddProduct}
        onCancel={handleCloseModal}
        confirmLoading={submitting}
        width={800}

      >
        <Form form={form} layout="vertical" initialValues={{imageSource: "upload",}}
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input product description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input product price!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
              onChange={handleCategoryChange}
            />
          </Form.Item>
          <Form.Item
            label="Sub Category"
            name="subCategoryId"
            rules={[{ required: true, message: "Please select a sub category!" }]}
          >
            <Select
              options={subCategories.map((subCat) => ({
                label: subCat.name,
                value: subCat.id,
              }))}
              loading={loadingSubCategories}
              disabled={!selectedCategory || loadingSubCategories}
              onChange={handleSubCategoryChange}
            />
          </Form.Item>
          
          {selectedSubCategory && specifications.length > 0 && (
          <Form.List name="specifications" initialValue={specifications}>
            {(fields, { add, remove }) => (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
                  <Col span={10}>
                    <strong>Specification</strong>
                  </Col>
                  <Col span={10}>
                    <strong>Value</strong>
                  </Col>
                  <Col span={4}>
                    <strong>Action</strong>
                  </Col>
                </Row>
                {fields.map(({ key, name, ...restField }) => (
                  <Row
                    gutter={[16, 16]}
                    key={key}
                    align="middle"
                    style={{ marginBottom: "10px" }}
                  >
                    <Col span={10}>
                      <Form.Item {...restField} name={[name, "name"]}>
                        <Input
                          value={specifications[key]?.name}
                          disabled
                          style={{ backgroundColor: "#f5f5f5" }}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "id"]}
                        hidden
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[{ required: true, message: "Please enter a value!" }]}
                      >
                        <Input placeholder="Enter value" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button type="link" danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                {/* <Button
                  type="dashed"
                  onClick={() => add({ id: "", name: "", value: "" })}
                  block
                  style={{ marginTop: "10px" }}
                >
                  Add Specification
                </Button> */}
              </>
            )}
          </Form.List>
          )}
          <Form.Item
            label="Product Status"
            name="productStatusId"
            rules={[
              { required: true, message: "Please select a product status!" },
            ]}
          >
            <Select
              options={productStatuses.map((status) => ({
                label: status.statusName,
                value: status.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Image Source"
            name="imageSource"
            rules={[{ required: true, message: "Please select an image source!" }]}
          >
            <Select
              options={[
                { label: "Upload File", value: "upload" },
                { label: "Provide URL", value: "url" },
              ]}
              onChange={handleSourceChange}
            />
          </Form.Item>

          {imageSource === "upload" ? (
            <Form.Item
              label="Product Image (Upload)"
              name="imageFile"
              rules={[
                { required: true, message: "Please upload an image!" },
                { validator: validateFile },
              ]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                value={file ? file.name : ""}
                readOnly
                placeholder="No file selected"
                style={{ marginRight: "10px", flex: 1 }}
              />
              <Upload
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
                showUploadList={false}
                accept="image/png,image/jpeg"
              >
                <Button icon={<UploadOutlined />}>Choose File</Button>
              </Upload>
            </div>
            </Form.Item>
          ) : (
            <Form.Item
              label="Product Image URL"
              name="imageUrl"
              rules={[
                {
                  type: "url",
                  message: "Please provide a valid URL!",
                  required: true,
                },
              ]}
            >
          <Input placeholder="Enter image URL" />
          </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default VendorProducts;
