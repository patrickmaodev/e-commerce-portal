import { Card, Col, Row, Typography } from "antd";
import { LayoutDashboard, ShoppingCart, Store, Users } from "lucide-react";
import { actionIcon } from "../../components/icons/menuIcon";
import PageShell from "../../components/layout/PageShell";
import StatCard from "../../components/layout/StatCard";

export default function AdminDashboard() {
  return (
    <PageShell
      title="Dashboard"
      description="High-level view of marketplace activity."
      flush
    >
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard label="Orders" value={0} icon={actionIcon(ShoppingCart, 22)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard label="Vendors" value={0} icon={actionIcon(Store, 22)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard label="Customers" value={0} icon={actionIcon(Users, 22)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard label="Active listings" value={0} icon={actionIcon(LayoutDashboard, 22)} />
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm ring-1 ring-slate-200/80" styles={{ body: { padding: 24 } }}>
        <Typography.Title level={5} className="!mb-1 !mt-0 !font-semibold">
          Getting started
        </Typography.Title>
        <Typography.Paragraph type="secondary" className="!mb-0 text-sm">
          Use the sidebar to manage vendors, orders, customers, and catalog settings.
        </Typography.Paragraph>
      </Card>
    </PageShell>
  );
}
