import {
  SidebarInset,
  SidebarProvider,
} from "@relume_io/relume-ui";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "@boxicons/react";
import type { CSSProperties } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { WalletDrawerProvider } from "./WalletDrawer";
import {
  getDefaultPageChrome,
  mergePageChrome,
  PageChromeProvider,
  usePageChromeOverride,
} from "./pageChrome";

const sidebarProviderStyle = {
  "--sidebar-width": "250px",
  "--sidebar-width-icon": "80px",
} as CSSProperties;

function PageChromeBar() {
  const location = useLocation();
  const { override } = usePageChromeOverride();
  const chrome = mergePageChrome(
    getDefaultPageChrome(location.pathname),
    override,
  );
  const actions = chrome.actions ?? [];
  const hasChrome = Boolean(chrome.backTo) || actions.length > 0;

  if (!hasChrome) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
      {chrome.backTo ? (
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="touch-target shrink-0 gap-2"
        >
          <Link to={chrome.backTo} aria-label={chrome.backLabel ?? "Go back"}>
            <ArrowLeft pack="basic" className="size-3" aria-hidden="true" />
            <span className="hidden sm:inline">
              {chrome.backLabel ?? "Back"}
            </span>
          </Link>
        </Button>
      ) : (
        <span />
      )}

      {actions.length > 0 ? (
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
        </div>
      ) : null}
    </div>
  );
}

export function AppShell() {
  return (
    <PageChromeProvider>
      <WalletDrawerProvider>
        <SidebarProvider style={sidebarProviderStyle}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-border-primary focus:bg-background-primary focus:px-4 focus:py-2 focus:text-text-primary"
          >
            Skip to main content
          </a>

          <AppSidebar />

          <SidebarInset className="bg-background-secondary-base">
            <AppHeader />
            <main
              id="main-content"
              tabIndex={-1}
              className="flex flex-1 flex-col bg-background-secondary-base outline-none"
            >
              <PageChromeBar />
              <div className="flex flex-1 flex-col p-4 md:p-6">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </WalletDrawerProvider>
    </PageChromeProvider>
  );
}
