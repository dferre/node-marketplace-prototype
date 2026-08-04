import {
  AlertTriangle,
  Apps,
  BadgeCheck,
  BookOpen,
  Brain,
  Bug,
  CheckCircle,
  CheckShield,
  Chip,
  Cloud,
  CodeAlt,
  Cog,
  Database,
  Filter,
  Gift,
  HardDrive,
  History,
  Home,
  InfoCircle,
  Lock,
  NetworkChart,
  Package,
  Save,
  Search,
  Server,
  Shield,
  Slider,
  Star,
  Store,
  Video,
  Wifi,
} from "@boxicons/react";
import type { AppCategory } from "../types/prototype";

export const navigationIcons = {
  overview: Home,
  nodes: Server,
  marketplace: Store,
  installed: Package,
  rewards: Gift,
  activity: History,
  onboarding: BookOpen,
  settings: Cog,
} as const;

export const debuggerIcons = {
  bug: Bug,
  slider: Slider,
  apps: Apps,
} as const;

export const marketplaceIcons = {
  search: Search,
  filter: Filter,
  verified: BadgeCheck,
  security: CheckShield,
  warning: AlertTriangle,
  success: CheckCircle,
  info: InfoCircle,
  lock: Lock,
  star: Star,
  storage: HardDrive,
  compute: Chip,
  networking: Wifi,
  ai: Brain,
  data: Database,
  infrastructure: CodeAlt,
  media: Video,
  utility: Save,
  securityCategory: Shield,
  cloud: Cloud,
  network: NetworkChart,
} as const;

export const categoryIcons: Record<
  AppCategory,
  (typeof marketplaceIcons)[keyof typeof marketplaceIcons]
> = {
  storage: marketplaceIcons.storage,
  compute: marketplaceIcons.compute,
  networking: marketplaceIcons.networking,
  ai: marketplaceIcons.ai,
  data: marketplaceIcons.data,
  infrastructure: marketplaceIcons.infrastructure,
  security: marketplaceIcons.securityCategory,
  media: marketplaceIcons.media,
  utility: marketplaceIcons.utility,
};

export type NavigationIconKey = keyof typeof navigationIcons;
