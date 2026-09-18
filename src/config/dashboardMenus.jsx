import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  UserCircle,
  Settings,
  Tags,
  List,
  LayoutGrid,
  Image,
  Package,
  Warehouse,
  DollarSign,
  MessageSquare,
  Truck,
  Store,
} from "lucide-react";
import { menuIcon } from "../components/icons/menuIcon";
import { PATH } from "../constants/PATH";
import { MENU } from "../constants/MENU";

/** Leaf menu keys must be route paths for navigation. */
export function buildAdminMenuItems() {
  return [
    {
      key: PATH.ADMIN_DASHBOARD,
      icon: menuIcon(LayoutDashboard),
      label: "Dashboard",
    },
    {
      key: "vendors",
      icon: menuIcon(Users),
      label: "Vendors",
      children: [{ key: PATH.ADMIN_VENDORS, label: "Vendor list" }],
    },
    {
      key: PATH.ADMIN_ORDERS,
      icon: menuIcon(ShoppingCart),
      label: "Orders",
    },
    {
      key: PATH.ADMIN_CUSTOMERS,
      icon: menuIcon(UserCircle),
      label: "Customers",
    },
    {
      key: "admin_settings",
      icon: menuIcon(Settings),
      label: "Catalog settings",
      children: [
        { key: PATH.ADMIN_CATEGORIES, icon: menuIcon(Tags), label: "Categories" },
        { key: PATH.ADMIN_SUBCATEGORIES, icon: menuIcon(Tags), label: "Sub categories" },
        { key: PATH.ADMIN_PRODUCT_STATUSES, icon: menuIcon(List), label: "Product statuses" },
        { key: PATH.ADMIN_SPECIFICATIONS, icon: menuIcon(LayoutGrid), label: "Specifications" },
        { key: PATH.ADMIN_BANNERS, icon: menuIcon(Image), label: "Banners" },
      ],
    },
  ];
}

export function buildVendorMenuItems() {
  return [
    {
      key: PATH.VENDOR_DASHBOARD,
      icon: menuIcon(LayoutDashboard),
      label: "Dashboard",
    },
    {
      key: PATH.VENDOR_PRODUCTS,
      icon: menuIcon(Package),
      label: "Products",
    },
    {
      key: "vendor_orders",
      icon: menuIcon(ShoppingCart),
      label: "Orders",
      children: [
        { key: PATH.VENDOR_ORDERS, label: "Manage orders" },
        { key: PATH.VENDOR_BULK_ORDERS, label: "Bulk actions" },
        { key: PATH.VENDOR_SHIPPING_ORDERS, icon: menuIcon(Truck), label: "Shipping" },
      ],
    },
    {
      key: PATH.VENDOR_INVETORY,
      icon: menuIcon(Warehouse),
      label: "Inventory",
    },
    {
      key: "pricing",
      icon: menuIcon(Tags),
      label: "Pricing",
      children: [
        { key: PATH.VENDOR_COUPONS, label: "Coupons" },
        { key: PATH.VENDOR_FLASH_SALES, label: "Flash sales" },
      ],
    },
    {
      key: "vendor_customer_interaction",
      icon: menuIcon(MessageSquare),
      label: "Customers",
      children: [
        { key: PATH.VENDOR_REVIEWS, label: "Reviews" },
        { key: PATH.VENDOR_RATINGS, label: "Ratings" },
        { key: PATH.VENDOR_MESSAGING, label: "Messaging" },
        { key: PATH.VENDOR_RETURNS, label: "Returns" },
      ],
    },
    {
      key: "vendor_store",
      icon: menuIcon(Store),
      label: "Store",
      children: [{ key: PATH.VENDOR_SETTINGS, label: "Settings" }],
    },
    {
      key: PATH.VENDOR_PAYMENTS,
      icon: menuIcon(DollarSign),
      label: "Payments",
    },
  ];
}

export function getMenuItemsForRole(role) {
  if (role === "SUPERADMIN") return buildAdminMenuItems();
  if (role === "VENDOR") return buildVendorMenuItems();
  return [];
}

export function getOpenMenuKeys(pathname) {
  return Object.entries(MENU)
    .filter(([, paths]) => paths.some((path) => pathname.startsWith(path)))
    .map(([key]) => key);
}

export function getSelectedMenuKey(pathname, items) {
  const paths = collectLeafKeys(items);
  const match = paths
    .filter((path) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ? [match] : [];
}

function collectLeafKeys(items) {
  const keys = [];
  for (const item of items) {
    if (item.children?.length) {
      keys.push(...collectLeafKeys(item.children));
    } else if (typeof item.key === "string" && item.key.startsWith("/")) {
      keys.push(item.key);
    }
  }
  return keys;
}
