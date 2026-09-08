const API = {

    /**
     * AUTH API
     */
    ADMIN_LOGIN: "/auth/admin/login",
    VENDOR_LOGIN: "/auth/vendor/login",
    VENDOR_REGISTER: "/auth/vendor/register",
    LOGOUT: "/auth/logout",

    /**
     * ADMIN API
     */
    VENDORS: "/admin/vendors",
    CATEGORIES: "/admin/categories",
    PRODUCT_STATUSES: "/admin/product-statuses",
    ADMIN_PRODUCTS: "/admin/products",
    ADMIN_ORDERS: "/admin/orders",
    ADMIN_CUSTOMERS: "/admin/customers",
    ADMIN_BANNERS: '/admin/banners',
    ADMIN_BANNER:(bannerId) => `/admin/banners/${bannerId}`,
    ADMIN_BANNERS_UPDATE:(bannerId) => `/admin/banners/${bannerId}`,
    ADMIN_BANNERS_ARCHIVE:(bannerId) => `/admin/banners/${bannerId}/archive`,
    ADMIN_SPECIFICATIONS: '/admin/specifications',
    ADMIN_SUBCATEGORY_SPECIFICATIONS: (subCategoryId) => `/admin/specifications/sub-category/${subCategoryId}`,
    ADMIN_SPECIFICATION:(id) => `/admin/specifications/${id}`,
    ADMIN_SPECIFICATIONS_UPDATE:(id) => `/admin/specifications/${id}`,
    ADMIN_SUBCATEGORIES: '/admin/sub-categories',
    ADMIN_CATEGORY_SUBCATEGORIES:(categoryId) => `/admin/sub-categories/category/${categoryId}`,
    ADMIN_SUBCATEGORY:(id) => `/admin/sub-categories/${id}`,
    ADMIN_SUBCATEGORIES_UPDATE:(id) => `/admin/sub-categories/${id}`,

    /**
     * VENDOR API
     */
    VENDOR_PRODUCTS: "/vendor/products",
    VENDOR_PRODUCT:(id) => `/vendor/products/${id}`,
    VENDOR_PRODUCT_UPDATE:(id) => `/vendor/products/${id}`,
    VENDOR_ORDERS: "/vendor/orders",

    /**
     * VENDOR CATALOG API (read-only metadata for product management)
     */
    VENDOR_CATEGORIES: "/vendor/catalog/categories",
    VENDOR_SUBCATEGORIES: "/vendor/catalog/sub-categories",
    VENDOR_CATEGORY_SUBCATEGORIES: (categoryId) => `/vendor/catalog/sub-categories/category/${categoryId}`,
    VENDOR_SUBCATEGORY_SPECIFICATIONS: (subCategoryId) => `/vendor/catalog/specifications/sub-category/${subCategoryId}`,
    VENDOR_PRODUCT_STATUSES: "/vendor/catalog/product-statuses",
  };
  
  export default API;
  