import { Button, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Star } from "lucide-react";
import { actionIcon } from "../../components/icons/menuIcon";
import PageShell from "../../components/layout/PageShell";
import StatCard from "../../components/layout/StatCard";
import { PATH } from "../../constants/PATH";

export default function VendorDashboard() {
  return (
    <PageShell
      title="Dashboard"
      description="Monitor your store performance and pending work."
      flush
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard label="Products" value={0} icon={actionIcon(Package, 22)} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard label="Open orders" value={0} icon={actionIcon(ShoppingCart, 22)} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard label="Avg. rating" value={0} icon={actionIcon(Star, 22)} />
        </Col>
      </Row>

      <Card bordered={false} className="vendor-dashboard-links shadow-sm ring-1 ring-slate-200/80">
        <Typography.Title level={5} className="!mb-1 !mt-0 !text-base !font-semibold">
          Quick links
        </Typography.Title>
        <Typography.Paragraph type="secondary" className="!mb-3 text-sm">
          Jump to common tasks for your store.
        </Typography.Paragraph>
        <div className="flex flex-wrap gap-2">
          <Link to={PATH.VENDOR_PRODUCTS}>
            <Button type="primary">Manage products</Button>
          </Link>
          <Link to={PATH.VENDOR_ORDERS}>
            <Button>View orders</Button>
          </Link>
          <Link to={PATH.VENDOR_PROFILE}>
            <Button>Store profile</Button>
          </Link>
        </div>
      </Card>
    </PageShell>
  );
}
