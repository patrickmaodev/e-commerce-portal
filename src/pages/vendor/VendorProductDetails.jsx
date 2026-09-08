import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Spin, message, Upload, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/vendor/productService';
import { vendorCatalogService } from '../../services/vendor/catalogService';
import defaultProductImage from "../../assets/product-image.jpg";

const { Option } = Select;

export default function VendorProductDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [imageSource, setImageSource] = useState('upload');
    const [file, setFile] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await productService.getVendorProduct(id);
                const subCategoryId = productData.subCategoryId;

                const [categoriesRes, subCategoriesRes, specificationsRes, statusesRes] = await Promise.all([
                    vendorCatalogService.getCategories(),
                    vendorCatalogService.getSubCategories(),
                    subCategoryId
                        ? vendorCatalogService.getSpecificationsBySubCategory(subCategoryId)
                        : Promise.resolve([]),
                    vendorCatalogService.getProductStatuses(),
                ]);

                const mappedProduct = {
                    ...productData,
                    category: productData.categoryId,
                    subCategory: productData.subCategoryId,
                    productStatus: productData.productStatusId,
                };

                const mappedProductSpecifications = productData.specifications.map(spec => ({
                    name: spec.name,
                    value: spec.value,
                    id: spec.id,
                }));

                const subCategorySpecs = specificationsRes;
                const mappedSubCategorySpecifications = subCategorySpecs.filter(
                    spec => spec.subCategoryId === productData.subCategoryId
                );

                const allSpecifications = [
                    ...mappedProductSpecifications,
                    ...mappedSubCategorySpecifications.filter(subSpec =>
                        !mappedProductSpecifications.some(productSpec => productSpec.id === subSpec.id)
                    ),
                ];

                setProduct(mappedProduct);
                setCategories(categoriesRes);
                setSubCategories(subCategoriesRes);
                setSpecifications(allSpecifications);
                setStatuses(statusesRes);

                const defaultSource = productData.imageUrl?.startsWith('http') ? 'url' : 'upload';
                setImageSource(defaultSource);

                form.setFieldsValue({ ...mappedProduct, imageSource: defaultSource, specifications: allSpecifications });
            } catch (error) {
                message.error('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form, id]);

    useEffect(() => {
        if (product?.subCategory) {
            const filteredSpecifications = specifications.filter(spec => spec.subCategoryId === product.subCategory);
            form.setFieldsValue({ specifications: filteredSpecifications });
            setProduct(prev => ({ ...prev, specifications: filteredSpecifications }));
        }
    }, [product?.subCategory, specifications, form]);

    const handleSave = async (values) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('categoryId', values.category);
            formData.append('subCategoryId', values.subCategory);
            formData.append('productStatusId', values.productStatus);
            formData.append('specifications', values.specifications);
            formData.append('price', values.price);
            formData.append('description', values.description);

            if (imageSource === 'upload' && file) {
                formData.append('imageFile', file);
            } else if (imageSource === 'url') {
                formData.append('imageUrl', values.imageUrl);
            }

            // Send update request
            const response = await productService.updateProduct(product.id, formData);

            setProduct(response.data);
            form.setFieldsValue({
                ...response.data,
                category: response.data.categoryId,
                subCategory: response.data.subCategoryId,
                productStatus: response.data.productStatusId,
            });

            message.success('Product updated successfully!');
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message || 'Failed to update product');
            } else {
                message.error('Failed to update product');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubCategoryChange = async (subCategoryId) => {
        try {
            const subCategorySpecifications = await vendorCatalogService.getSpecificationsBySubCategory(subCategoryId);
    
            setSpecifications(subCategorySpecifications);
    
            form.setFieldsValue({
                specifications: [],
            });
        } catch (error) {
            message.error('Failed to fetch sub-category specifications');
        }
    };

    const handleSourceChange = (value) => {
        setImageSource(value);
        form.resetFields(['imageFile', 'imageUrl']);
        setFile(null);
    };

    const getProductImageSrc = (imagePath) => {
        if (!imagePath) return defaultProductImage;
        const isOnlineLink = imagePath.startsWith('http');
        return isOnlineLink
            ? imagePath
            : `${import.meta.env.VITE_URL}${import.meta.env.VITE_PATH}${imagePath.split(import.meta.env.VITE_PATH).pop()}`;
    };
    

    if (loading) {
        return (
            <div className="p-6 bg-white flex justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-white">
            <Breadcrumb />
            <h3 className="text-2xl font-semibold pb-4">Edit Product Details</h3>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                <Form.Item label="Current Product Image">
                    <img
                        src={getProductImageSrc(product.imageUrl)}
                        alt="Product"
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                        onError={(e) => {
                            e.target.src = defaultProductImage;
                        }}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Image Source"
                            name="imageSource"
                            rules={[{ required: true, message: "Please select an image source!" }]}
                        >
                            <Select
                                value={imageSource}
                                options={[
                                    { label: "Upload File", value: "upload" },
                                    { label: "Provide URL", value: "url" },
                                ]}
                                onChange={handleSourceChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {imageSource === 'upload' ? (
                            <Form.Item
                            label="Product Image (Upload)"
                            name="imageFile"
                            rules={[{ required: false, message: "Please upload an image!" }]}
                        >
                            <Upload
                                fileList={file ? [file] : []}
                                beforeUpload={(file) => {
                                    setFile(file);
                                    return false;
                                }}
                                showUploadList={false}
                                accept="image/png,image/jpeg"
                            >
                                <Button icon={<UploadOutlined />}>Choose File</Button>
                            </Upload>
                        </Form.Item>
                        ) : (
                            <Form.Item
                                label="Product Image URL"
                                name="imageUrl"
                                rules={[
                                    { type: 'url', required: true, message: "Please provide a valid URL!" },
                                ]}
                            >
                                <Input placeholder="Enter image URL" />
                            </Form.Item>
                        )}
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Product Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter the product name' }]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                        >
                            <Select placeholder="Select a category">
                                {categories.map((category) => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Description"
                            name="description"
                             rules={[{ required: true, message: "Please input product description!" }]}
                        >
                        <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Sub Category"
                            name="subCategory"
                            rules={[{ required: true, message: 'Please select a sub-category' }]}
                        >
                            <Select placeholder="Select a sub-category" onChange={handleSubCategoryChange}>
                                {subCategories.map((subCategory) => (
                                    <Option key={subCategory.id} value={subCategory.id}>
                                        {subCategory.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.List name="specifications">
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
                                {fields.map(({ key, name, fieldKey, ...restField }) => {
                                    const spec = specifications[key];
                                    return (
                                        <Row
                                            gutter={[16, 16]}
                                            key={key}
                                            align="middle"
                                            style={{ marginBottom: "10px" }}
                                        >
                                            <Col span={10}>
                                                <Form.Item {...restField} name={[name, "name"]}>
                                                    <Input
                                                        value={spec?.name}
                                                        disabled
                                                        style={{ backgroundColor: "#f5f5f5" }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "value"]}
                                                    initialValue={spec?.value}
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
                                    );
                                })}
                            </>
                        )}
                    </Form.List>

                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Status"
                            name="productStatus"
                            rules={[{ required: true, message: 'Please select a status' }]}
                        >
                            <Select placeholder="Select a status">
                                {statuses.map((status) => (
                                    <Option key={status.id} value={status.id}>
                                        {status.statusName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please enter the price' }]}
                        >
                            <Input type="number" placeholder="Enter price" />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="flex justify-end">
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    );
}
