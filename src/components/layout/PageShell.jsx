import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import Breadcrumb from "../Breadcrumb";
import { portalLabelFromPath, setDocumentTitle } from "../../utils/documentTitle";

export default function PageShell({
  title,
  description,
  actions,
  children,
  bodyClassName = "",
  noPadding = false,
  flush = false,
}) {
  const location = useLocation();

  useEffect(() => {
    const portal = portalLabelFromPath(location.pathname);
    setDocumentTitle({ pageTitle: title, portal });
  }, [title, location.pathname]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-page-header">
        <Breadcrumb />

        <div className="dashboard-page-title-row">
          <div className="min-w-0 flex-1">
            <Typography.Title
              level={2}
              className="!mb-0 !text-xl !font-semibold !leading-tight !text-slate-900"
            >
              {title}
            </Typography.Title>
            {description ? (
              <Typography.Text type="secondary" className="mt-1 block text-sm">
                {description}
              </Typography.Text>
            ) : null}
          </div>

          {actions ? <div className="dashboard-page-actions shrink-0">{actions}</div> : null}
        </div>
      </header>

      {flush ? (
        <div className={`dashboard-page-body ${bodyClassName}`}>{children}</div>
      ) : (
        <section
          className={[
            "dashboard-surface",
            noPadding ? "dashboard-surface--flush" : "",
            bodyClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </section>
      )}
    </div>
  );
}
