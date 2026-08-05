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
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { usePrototypeStore } from "../../store/prototypeStore";
import { developerNavIcons } from "../../icons/iconMap";
import {
  PageChromeProvider,
  getDefaultPageChrome,
  mergePageChrome,
  usePageChromeOverride,
} from "../../app/pageChrome";
import { WalletMenu } from "../shared/WalletMenu";
import { Link } from "react-router-dom";
import { ArrowLeft } from "@boxicons/react";

type NavItem = {
  label: string;
  to: string;
  iconKey: keyof typeof developerNavIcons;
  end?: boolean;
};

const navItems: NavItem[] = [
  { label: "Overview", to: "/developer", iconKey: "overview", end: true },
  { label: "My Apps", to: "/developer/apps", iconKey: "apps" },
  { label: "Create App", to: "/developer/apps/new", iconKey: "create" },
  { label: "Submissions", to: "/developer/submissions", iconKey: "submissions" },
  { label: "Releases", to: "/developer/releases", iconKey: "releases" },
  { label: "Analytics", to: "/developer/analytics", iconKey: "analytics" },
  { label: "Rewards", to: "/developer/rewards", iconKey: "rewards" },
  { label: "Organization", to: "/developer/organization", iconKey: "organization" },
  { label: "Team", to: "/developer/team", iconKey: "team" },
  { label: "Developer Profile", to: "/developer/profile", iconKey: "profile" },
  { label: "Verification", to: "/developer/verification", iconKey: "verification" },
  { label: "Documentation", to: "/developer/docs", iconKey: "documentation" },
  { label: "Support", to: "/developer/support", iconKey: "support" },
  { label: "Settings", to: "/developer/settings", iconKey: "settings" },
];

function getDeveloperPageTitle(pathname: string): string {
  if (pathname === "/developer") return "Developer Overview";
  if (pathname === "/developer/apps/new") return "Create App";
  if (pathname.includes("/listing")) return "Marketplace Listing";
  if (pathname.includes("/media")) return "Media";
  if (pathname.includes("/build")) return "Build and Runtime";
  if (pathname.includes("/compatibility")) return "Compatibility";
  if (pathname.includes("/permissions")) return "Permissions";
  if (pathname.includes("/rewards-dashboard")) return "App Rewards";
  if (pathname.includes("/rewards")) return "Benefits and Rewards";
  if (pathname.includes("/testing")) return "Testing";
  if (pathname.includes("/preview")) return "Public Preview";
  if (pathname.includes("/submit")) return "Submit for Review";
  if (pathname.includes("/submission")) return "Submission";
  if (pathname.includes("/review")) return "Review Feedback";
  if (pathname.includes("/releases/new")) return "Create Release";
  if (pathname.includes("/releases")) return "Releases";
  if (pathname.includes("/analytics")) return "App Analytics";
  if (pathname.includes("/installations")) return "Installations";
  if (pathname.includes("/settings")) return "App Settings";
  if (pathname.includes("/edit")) return "Edit App";
  if (pathname.match(/^\/developer\/apps\/[^/]+$/)) return "App Dashboard";
  if (pathname.startsWith("/developer/apps")) return "My Apps";
  if (pathname.startsWith("/developer/submissions")) return "Submissions";
  if (pathname.startsWith("/developer/releases")) return "Releases";
  if (pathname.startsWith("/developer/organization")) return "Organization";
  if (pathname.startsWith("/developer/team")) return "Team";
  if (pathname.startsWith("/developer/profile")) return "Developer Profile";
  if (pathname.startsWith("/developer/verification")) return "Verification";
  if (pathname.startsWith("/developer/docs")) return "Documentation";
  if (pathname.startsWith("/developer/support")) return "Support";
  if (pathname.startsWith("/developer/settings")) return "Developer Settings";
  if (pathname.startsWith("/developer/analytics")) return "Analytics";
  if (pathname.startsWith("/developer/rewards")) return "Rewards";
  return "Developer Portal";
}

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.end) return pathname === item.to;
  if (item.to === "/developer/apps") {
    return (
      pathname === "/developer/apps" ||
      (pathname.startsWith("/developer/apps/") &&
        pathname !== "/developer/apps/new")
    );
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

function DeveloperHeader() {
  const location = useLocation();
  const pageTitle = getDeveloperPageTitle(location.pathname);
  const { override } = usePageChromeOverride();
  const chrome = mergePageChrome(
    getDefaultPageChrome(location.pathname),
    override,
  );
  const developer = usePrototypeStore((state) =>
    state.developerPortal.developers.find(
      (item) => item.id === state.developerPortal.activeDeveloperId,
    ),
  );

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
            <Link to={chrome.backTo}>
              <ArrowLeft pack="basic" size="sm" aria-hidden="true" />
              <span className="hidden sm:inline">
                {chrome.backLabel ?? "Back"}
              </span>
            </Link>
          </Button>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text-muted">
            Developer Portal
            {developer ? ` · ${developer.displayName}` : ""}
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
        {(chrome.actions ?? []).map((action) =>
          action.to && !action.disabled ? (
            <Button
              key={action.id}
              asChild
              size="sm"
              variant={action.variant ?? "secondary"}
              className="touch-target"
            >
              <Link to={action.to}>{action.label}</Link>
            </Button>
          ) : (
            <Button
              key={action.id}
              type="button"
              size="sm"
              variant={action.variant ?? "secondary"}
              className="touch-target"
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ),
        )}
        <WalletMenu context="developer" />
      </div>
    </header>
  );
}

export function DeveloperShell() {
  const location = useLocation();

  return (
    <PageChromeProvider>
      <SidebarProvider>
        <a
          href="#developer-main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-background-primary focus:px-4 focus:py-2 focus:text-link-primary focus:shadow-focus"
        >
          Skip to main content
        </a>
        <Sidebar className="border-r border-border-primary bg-background">
          <SidebarHeader className="gap-1 px-3 py-4">
            <p className="text-sm font-semibold tracking-tight text-text-primary">
              Developer Portal
            </p>
            <p className="text-xs text-text-muted">Prototype</p>
          </SidebarHeader>
          <SidebarSeparator className="bg-border-primary" />
          <SidebarContent className="px-2">
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Developer
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {navItems.map((item) => {
                    const Icon = developerNavIcons[item.iconKey];
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
          <DeveloperHeader />
          <main
            id="developer-main"
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

/** Keeps React Router happy when nested app routes need the param. */
export function useDeveloperAppIdParam() {
  const { appId = "" } = useParams();
  return appId;
}
