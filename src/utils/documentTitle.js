const APP_NAME = "Commerce";

export function portalLabelFromPath(pathname = "") {
  if (pathname.startsWith("/vendor")) return "Vendor";
  if (pathname.startsWith("/admin")) return "Admin";
  if (pathname.startsWith("/auth")) return null;
  return null;
}

export function portalLabelFromVariant(variant) {
  if (variant === "vendor") return "Vendor";
  if (variant === "admin") return "Admin";
  return null;
}

/** e.g. "Dashboard · Commerce Vendor" or "Commerce Vendor" */
export function formatDocumentTitle({ pageTitle, portal }) {
  const suffix = portal ? `${APP_NAME} ${portal}` : APP_NAME;
  return pageTitle ? `${pageTitle} · ${suffix}` : suffix;
}

export function setDocumentTitle({ pageTitle, portal }) {
  document.title = formatDocumentTitle({ pageTitle, portal });
}
