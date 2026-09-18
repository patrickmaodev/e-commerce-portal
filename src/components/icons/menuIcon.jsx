/** Consistent Lucide sizing for Ant Design Menu and buttons. */
export const MENU_ICON_SIZE = 18;

export function menuIcon(Icon, size = MENU_ICON_SIZE) {
  return <Icon size={size} strokeWidth={1.75} className="shrink-0" aria-hidden />;
}

export function actionIcon(Icon, size = 16) {
  return <Icon size={size} strokeWidth={2} className="shrink-0" aria-hidden />;
}
