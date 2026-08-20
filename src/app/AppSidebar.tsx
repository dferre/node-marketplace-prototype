import { Sidebar, useSidebar } from "@relume_io/relume-ui";
import type { CSSProperties } from "react";
import { Link, NavLink } from "react-router-dom";
import appsIcon from "../assets/sidebar/apps.svg";
import developersIcon from "../assets/sidebar/developers.svg";
import discoverIcon from "../assets/sidebar/discover.svg";
import homeIcon from "../assets/sidebar/home.svg";
import nodesIcon from "../assets/sidebar/nodes.svg";
import notificationsIcon from "../assets/sidebar/notifications.svg";
import rewardsIcon from "../assets/sidebar/rewards.svg";
import settingsIcon from "../assets/sidebar/settings.svg";
import supportIcon from "../assets/sidebar/support.svg";
import walletIcon from "../assets/sidebar/wallet.svg";
import { useWalletDrawer } from "./WalletDrawer";
import { WebstackLogo } from "./WebstackLogo";
import { WebstackLogomark } from "./WebstackLogomark";

function SidebarGlyph({ src }: { src: string }) {
  return (
    <span
      className="app-sidebar-glyph size-5 shrink-0"
      style={{ "--app-sidebar-glyph": `url("${src}")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}

type NavItem =
  | { label: string; icon: string; to: string; end?: boolean }
  | { label: string; icon: string; action: "wallet" };

const primaryNavItems: NavItem[] = [
  { label: "Home", to: "/", icon: homeIcon, end: true },
  { label: "My Nodes", to: "/nodes", icon: nodesIcon },
  { label: "Wallet", icon: walletIcon, action: "wallet" },
  { label: "Apps", to: "/installed", icon: appsIcon },
  { label: "Discover", to: "/marketplace", icon: discoverIcon },
  { label: "Rewards", to: "/rewards", icon: rewardsIcon },
  { label: "Notifications", to: "/activity", icon: notificationsIcon },
  { label: "Developers", to: "/onboarding", icon: developersIcon },
];

const itemLayoutClass =
  "flex h-11 w-full cursor-pointer items-center gap-3 overflow-hidden rounded-06 p-3 no-underline hover:no-underline";

const footerLayoutClass =
  "flex w-full cursor-pointer appearance-none items-center gap-3 overflow-hidden rounded-06 border-0 px-3 py-2 text-left shadow-none no-underline hover:no-underline";

export function AppSidebar() {
  const { setOpenMobile, state, isMobile } = useSidebar();
  const { open: walletOpen, setOpen: setWalletOpen } = useWalletDrawer();
  const closeMobile = () => setOpenMobile(false);
  const iconOnly = state === "collapsed" && !isMobile;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border-base bg-background-primary-base p-0"
    >
      <div className="flex h-full min-h-0 w-full flex-col justify-between overflow-hidden bg-background-primary-base">
        <div
          className={`flex flex-col ${iconOnly ? "gap-6 pt-6" : "gap-8 pt-8"}`}
        >
          <div className={iconOnly ? "px-6" : "pl-6 pr-5"}>
            <Link
              to="/"
              aria-label="webstack home"
              className="flex items-center no-underline"
              onClick={closeMobile}
            >
              {iconOnly ? (
                <span className="flex h-7 w-8 items-center justify-center">
                  <WebstackLogomark className="size-7" />
                </span>
              ) : (
                <WebstackLogo className="h-5 w-36 shrink-0 text-text-primary" />
              )}
            </Link>
          </div>

          <nav aria-label="Primary" className="flex flex-col gap-0.5 px-4">
            {primaryNavItems.map((item) => {
              const itemClass = `${itemLayoutClass} app-sidebar-item ${iconOnly ? "justify-center gap-0" : ""}`;
              if ("action" in item) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    title={iconOnly ? item.label : undefined}
                    aria-expanded={walletOpen}
                    aria-controls="app-wallet-drawer"
                    aria-current={walletOpen ? "page" : undefined}
                    className={itemClass}
                    onClick={() => {
                      closeMobile();
                      setWalletOpen(true);
                    }}
                  >
                    <SidebarGlyph src={item.icon} />
                    <span className={iconOnly ? "sr-only" : undefined}>
                      {item.label}
                    </span>
                  </button>
                );
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={iconOnly ? item.label : undefined}
                  onClick={closeMobile}
                  className={itemClass}
                >
                  <SidebarGlyph src={item.icon} />
                  <span className={iconOnly ? "sr-only" : undefined}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="px-4 pb-8">
          <nav aria-label="Secondary" className="flex flex-col gap-1">
            <button
              type="button"
              title={iconOnly ? "Support" : undefined}
              className={`${footerLayoutClass} app-sidebar-item app-sidebar-item-footer ${iconOnly ? "justify-center gap-0" : ""}`}
            >
              <SidebarGlyph src={supportIcon} />
              <span className={iconOnly ? "sr-only" : undefined}>Support</span>
            </button>
            <NavLink
              to="/settings"
              end
              title={iconOnly ? "Settings" : undefined}
              onClick={closeMobile}
              className={`${footerLayoutClass} app-sidebar-item app-sidebar-item-footer ${iconOnly ? "justify-center gap-0" : ""}`}
            >
              <SidebarGlyph src={settingsIcon} />
              <span className={iconOnly ? "sr-only" : undefined}>Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </Sidebar>
  );
}
