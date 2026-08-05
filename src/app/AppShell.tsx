import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@relume_io/relume-ui";
import { ArrowLeft } from "@boxicons/react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { navigationIcons } from "../icons/iconMap";
import {
  getDefaultPageChrome,
  mergePageChrome,
  PageChromeProvider,
  usePageChromeOverride,
} from "./pageChrome";
import { WalletMenu } from "../components/shared/WalletMenu";

type NavItem = {
  label: string;
  to: string;
  iconKey: keyof typeof navigationIcons;
  end?: boolean;
};

const navItems: NavItem[] = [
  { label: "Overview", to: "/", iconKey: "overview", end: true },
  { label: "My Nodes", to: "/nodes", iconKey: "nodes" },
  { label: "Marketplace", to: "/marketplace", iconKey: "marketplace" },
  { label: "Installed Apps", to: "/installed", iconKey: "installed" },
  { label: "Rewards", to: "/rewards", iconKey: "rewards" },
  { label: "Activity", to: "/activity", iconKey: "activity" },
  { label: "Settings", to: "/settings", iconKey: "settings" },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Overview";
  if (
    pathname.startsWith("/marketplace/apps/") &&
    pathname.includes("/install/results")
  ) {
    return "Installation Results";
  }
  if (
    pathname.startsWith("/marketplace/apps/") &&
    pathname.includes("/install/progress")
  ) {
    return "Installation Progress";
  }
  if (
    pathname.startsWith("/marketplace/apps/") &&
    pathname.includes("/install/review")
  ) {
    return "Review Installation";
  }
  if (
    pathname.startsWith("/marketplace/apps/") &&
    pathname.endsWith("/install")
  ) {
    return "Install on Nodes";
  }
  if (pathname.startsWith("/marketplace/apps/")) return "App Detail";
  if (pathname.startsWith("/marketplace/search")) return "Search Marketplace";
  if (pathname.startsWith("/marketplace")) return "Marketplace";
  if (pathname.match(/^\/installed\/[^/]+\/nodes\//)) return "Node Installation";
  if (pathname.startsWith("/installed/")) return "Installed App";
  if (pathname.startsWith("/installed")) return "Installed Apps";
  if (pathname.startsWith("/nodes/")) return "Node Detail";
  if (pathname.startsWith("/nodes")) return "My Nodes";
  if (pathname.startsWith("/rewards")) return "Rewards";
  if (pathname.startsWith("/activity")) return "Activity";
  if (pathname.startsWith("/onboarding/developer")) return "Developer Onboarding";
  if (pathname.startsWith("/onboarding/")) return "Onboarding Flow";
  if (pathname.startsWith("/onboarding")) return "Onboarding";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Node Marketplace";
}

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.end) return pathname === item.to;
  if (item.to === "/marketplace") {
    return pathname === "/marketplace" || pathname.startsWith("/marketplace/");
  }
  if (item.to === "/installed") {
    return pathname === "/installed" || pathname.startsWith("/installed/");
  }
  if (item.to === "/nodes") {
    return pathname === "/nodes" || pathname.startsWith("/nodes/");
  }
  if (item.to === "/onboarding") {
    return pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

function AppHeader() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const { override } = usePageChromeOverride();
  const chrome = mergePageChrome(
    getDefaultPageChrome(location.pathname),
    override,
  );
  const actions = chrome.actions ?? [];

  return (
    <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border-primary bg-background-primary px-4 py-3 md:px-6">
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <SidebarTrigger aria-label="Open or close navigation" />
        {chrome.backTo ? (
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="touch-target shrink-0 gap-2"
          >
            <Link to={chrome.backTo} aria-label={chrome.backLabel ?? "Go back"}>
              <ArrowLeft pack="basic" size="sm" aria-hidden="true" />
              <span className="hidden sm:inline">
                {chrome.backLabel ?? "Back"}
              </span>
            </Link>
          </Button>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text-muted">
            Node Marketplace
          </p>
          <p
            className="truncate text-sm font-semibold tracking-tight text-text-primary"
            aria-current="page"
          >
            {pageTitle}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {actions.map((action) => {
          const variant = action.variant ?? "secondary";
          if (action.to && !action.disabled) {
            return (
              <Button
                key={action.id}
                asChild
                size="sm"
                variant={variant}
                className="touch-target"
              >
                <Link to={action.to} title={action.title}>
                  {action.label}
                </Link>
              </Button>
            );
          }
          return (
            <Button
              key={action.id}
              type="button"
              size="sm"
              variant={variant}
              className="touch-target"
              disabled={action.disabled}
              title={action.title}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          );
        })}
        <WalletMenu context="operator" />
      </div>
    </header>
  );
}

export function AppShell() {
  const location = useLocation();

  return (
    <PageChromeProvider>
      <SidebarProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-background-primary focus:px-4 focus:py-2 focus:text-link-primary focus:shadow-focus"
        >
          Skip to main content
        </a>

        <Sidebar className="border-r border-border-primary bg-background">
          <SidebarHeader className="gap-1 px-3 py-4">
            <p className="text-sm font-semibold tracking-tight text-text-primary">
              Node Marketplace
            </p>
            <p className="text-xs text-text-muted">Prototype</p>
          </SidebarHeader>
          <SidebarSeparator className="bg-border-primary" />
          <SidebarContent className="px-2">
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {navItems.map((item) => {
                    const Icon = navigationIcons[item.iconKey];
                    const active = isNavActive(location.pathname, item);

                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className="rounded-sm text-text-secondary hover:bg-background-tertiary hover:text-text-primary data-[active=true]:bg-background-tertiary data-[active=true]:font-medium data-[active=true]:text-text-primary"
                        >
                          <NavLink to={item.to} end={item.end}>
                            <Icon
                              pack={active ? "filled" : "basic"}
                              size="sm"
                              aria-hidden="true"
                            />
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-background">
          <AppHeader />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex flex-1 flex-col gap-4 p-4 outline-none md:gap-6 md:p-6"
          >
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </PageChromeProvider>
  );
}
