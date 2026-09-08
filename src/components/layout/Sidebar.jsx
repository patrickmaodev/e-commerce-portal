import { NavLink, useLocation } from "react-router-dom";
import { FaUsers, FaChevronDown, FaChevronUp, FaShoppingCart, FaCog, FaTags, FaListAlt, FaTachometerAlt, FaBoxes, FaUserAlt, FaTruck,
  FaWarehouse, FaTicketAlt, FaBolt, FaImage, FaStar, FaThumbsUp, FaEnvelope, FaUndo, FaStore, FaMoneyCheckAlt ,FaClipboardList, FaTasks} from "react-icons/fa";
import { MENU } from "../../constants/MENU";

export default function Sidebar({ toggleSubMenu, subMenuOpen, PATH, sidebarVisible, role }) {
    if (!sidebarVisible) return null;

    const location = useLocation();
  
    const isAdmin = role === "SUPERADMIN";
    const isVendor = role === "VENDOR";

    const isSubMenuActive = (menuKey) =>
    MENU[menuKey]?.some((path) => location.pathname.startsWith(path));
  
    return (
      <aside className="sidebar bg-white p-4 shadow-md h-screen flex flex-col">
        <h2 className="text-2xl font-bold mb-6 sidebarTitle sticky top-0 bg-white z-10 p-4 shadow-sm">
          {isAdmin ? "Admin Panel" : isVendor ? "Vendor Panel" : ""}
        </h2>
  
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-4">
            {isAdmin ? (
              <>
                <li>
                  <NavLink
                    to={PATH.ADMIN_DASHBOARD}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaTachometerAlt className="text-xl" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
  
                <li>
                  <div
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      isSubMenuActive("vendors") ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu("vendors")}
                  >
                    <div className="flex items-center gap-3">
                      <FaUsers className="text-xl" />
                      <span>Vendors</span>
                    </div>
                    {subMenuOpen.vendors ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {subMenuOpen.vendors && (
                    <ul className="ml-8">
                      <li>
                        <NavLink
                          to={PATH.ADMIN_VENDORS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <div className="flex items-center gap-3">
                            <FaUserAlt className="text-xl" />
                            <span>Vendor List</span>
                          </div>
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
  
                <li>
                  <NavLink
                    to={PATH.ADMIN_ORDERS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaShoppingCart className="text-xl" />
                    <span>Orders</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={PATH.ADMIN_CUSTOMERS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaUserAlt className="text-xl" />
                    <span>Customers</span>
                  </NavLink>
                </li>

                <li>
                  <div
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      isSubMenuActive("admin_settings") ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu("admin_settings")}
                  >
                    <div className="flex items-center gap-3">
                      <FaCog className="text-xl" />
                      <span>Settings</span>
                    </div>
                    {subMenuOpen.admin_settings ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {subMenuOpen.admin_settings && (
                    <ul className="ml-8">
                      <li>
                        <NavLink
                          to={PATH.ADMIN_CATEGORIES}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaTags className="text-xl" />
                          <span>Categories</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.ADMIN_SUBCATEGORIES}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaTags className="text-xl" />
                          <span>Sub Categories</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.ADMIN_PRODUCT_STATUSES}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaListAlt className="text-xl" />
                          <span>Product Statuses</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.ADMIN_SPECIFICATIONS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaClipboardList className="text-xl" />
                          <span>Specifications</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.ADMIN_BANNERS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaImage className="text-lg" />
                          Banners
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            ) : isVendor ? (
              <>
                <li>
                  <NavLink
                    to={PATH.VENDOR_DASHBOARD}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaTachometerAlt className="text-xl" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={PATH.VENDOR_PRODUCTS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaBoxes className="text-xl" />
                    <span>Products</span>
                  </NavLink>
                </li>
                <li>
                  <div
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      isSubMenuActive("vendor_orders") ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu("vendor_orders")}
                  >
                    <div className="flex items-center gap-3">
                      <FaShoppingCart className="text-xl" />
                      <span>Orders</span>
                    </div>
                    {subMenuOpen.vendor_orders ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {subMenuOpen.vendor_orders && (
                    <ul className="ml-8">
                      <li>
                        <NavLink
                          to={PATH.VENDOR_ORDERS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaClipboardList className="text-lg" />
                          Manage Orders
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.VENDOR_BULK_ORDERS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaTasks className="text-lg" />
                          Bulk Actions
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.VENDOR_SHIPPING_ORDERS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaTruck className="text-lg" />
                          Shipping & Delivery
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <NavLink
                    to={PATH.VENDOR_INVETORY}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaWarehouse className="text-xl" />
                    <span>Inventory Management</span>
                  </NavLink>
                </li>
                <li>
                  <div
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      isSubMenuActive("pricing") ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu("pricing")}
                  >
                    <div className="flex items-center gap-3">
                      <FaTags className="text-xl" />
                      <span>Pricing & Promotions</span>
                    </div>
                    {subMenuOpen.pricing ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {subMenuOpen.pricing && (
                    <ul className="ml-8">
                      <li>
                        <NavLink
                          to={PATH.VENDOR_COUPONS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaTicketAlt className="text-lg" />
                          Coupons & Discounts
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.VENDOR_FLASH_SALES}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaBolt className="text-lg" />
                          Flash Sales
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <div
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      isSubMenuActive("vendor_customer_interaction") ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu("vendor_customer_interaction")}
                  >
                    <div className="flex items-center gap-3">
                      <FaUsers className="text-xl" />
                      <span>Customer Interaction</span>
                    </div>
                    {subMenuOpen.vendor_customer_interaction ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {subMenuOpen.vendor_customer_interaction && (
                    <ul className="ml-8">
                      <li>
                        <NavLink
                          to={PATH.VENDOR_REVIEWS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaStar className="text-lg" />
                          Reviews
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.VENDOR_RATINGS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaThumbsUp className="text-lg" />
                          Ratings
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.VENDOR_MESSAGING}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaEnvelope className="text-lg" />
                          Messaging
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.VENDOR_RETURNS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaUndo className="text-lg" />
                          Returns & Refunds
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <div
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      isSubMenuActive("vendor_store") ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu("vendor_store")}
                  >
                    <div className="flex items-center gap-3">
                      <FaStore className="text-xl" />
                      <span>Store</span>
                    </div>
                    {subMenuOpen.vendor_store ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {subMenuOpen.vendor_store && (
                    <ul className="ml-8">
                      <li>
                        <NavLink
                          to={PATH.VENDOR_SETTINGS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaCog className="text-lg" />
                          Settings
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <NavLink
                    to={PATH.VENDOR_PAYMENTS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaMoneyCheckAlt className="text-xl" />
                    <span>Payments & Financials</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="text-red-600">Access Denied</li>
            )}
          </ul>
        </nav>
      </aside>
    );
}
