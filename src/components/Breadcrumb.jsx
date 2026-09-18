import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { actionIcon } from "./icons/menuIcon";
import { PATH } from "../constants/PATH";

const segmentLabel = (segment) =>
  segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="dashboard-breadcrumb flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
    >
      <Link
        to={PATH.HOME}
        className="inline-flex items-center text-slate-400 transition hover:text-violet-600"
      >
        {actionIcon(Home, 14)}
      </Link>

      {pathnames.map((segment, index) => {
        const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={pathTo} className="inline-flex items-center gap-1.5">
            <span className="text-slate-300" aria-hidden>/</span>
            {isLast ? (
              <span className="font-medium text-slate-600">{segmentLabel(segment)}</span>
            ) : (
              <Link to={pathTo} className="transition hover:text-violet-600">
                {segmentLabel(segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
