import type { PrototypeUser } from "../types/prototype";

export const users: PrototypeUser[] = [
  {
    id: "multi-node-owner",
    name: "Alex Rivera",
    role: "Multi-node owner",
    canInstallApps: true,
    canManageNodes: true,
  },
  {
    id: "single-node-owner",
    name: "Jordan Lee",
    role: "Single-node owner",
    canInstallApps: true,
    canManageNodes: true,
  },
  {
    id: "no-nodes-user",
    name: "Sam Chen",
    role: "Account without nodes",
    canInstallApps: true,
    canManageNodes: false,
  },
  {
    id: "restricted-user",
    name: "Morgan Blake",
    role: "View-only operator",
    canInstallApps: false,
    canManageNodes: false,
  },
];

export function getUserById(id: string): PrototypeUser | undefined {
  return users.find((user) => user.id === id);
}
