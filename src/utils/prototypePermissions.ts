import type { PrototypeOverrides, PrototypeUser } from "../types/prototype";

export function canInstallApps(
  user: PrototypeUser | undefined,
  overrides: PrototypeOverrides,
): boolean {
  return Boolean(user?.canInstallApps) && !overrides.userPermissionChanged;
}

export function canManageApps(
  user: PrototypeUser | undefined,
  overrides: PrototypeOverrides,
): boolean {
  return Boolean(user?.canManageNodes) && !overrides.userPermissionChanged;
}
