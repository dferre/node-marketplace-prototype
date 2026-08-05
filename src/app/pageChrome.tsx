import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type DependencyList,
  type ReactNode,
} from "react";

export type PageChromeAction = {
  id: string;
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  title?: string;
};

export type PageChromeConfig = {
  backTo?: string;
  backLabel?: string;
  actions?: PageChromeAction[];
};

type PageChromeContextValue = {
  override: PageChromeConfig | null;
  setOverride: (config: PageChromeConfig | null) => void;
};

const PageChromeContext = createContext<PageChromeContextValue | null>(null);

export function PageChromeProvider({ children }: { children: ReactNode }) {
  const [override, setOverrideState] = useState<PageChromeConfig | null>(null);
  const setOverride = useCallback((config: PageChromeConfig | null) => {
    setOverrideState(config);
  }, []);

  const value = useMemo(
    () => ({ override, setOverride }),
    [override, setOverride],
  );

  return (
    <PageChromeContext.Provider value={value}>
      {children}
    </PageChromeContext.Provider>
  );
}

export function usePageChromeOverride() {
  const context = useContext(PageChromeContext);
  if (!context) {
    throw new Error("usePageChromeOverride requires PageChromeProvider");
  }
  return context;
}

/** Register header back/actions for the current page; clears on unmount. */
export function usePageChrome(
  config: PageChromeConfig | null,
  deps: DependencyList,
) {
  const { setOverride } = usePageChromeOverride();

  useEffect(() => {
    setOverride(config);
    return () => setOverride(null);
    // Caller supplies deps that cover `config` contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional deps list
  }, [setOverride, ...deps]);
}

export function getDefaultPageChrome(pathname: string): PageChromeConfig {
  if (pathname.startsWith("/developer/apps/") && pathname !== "/developer/apps/new") {
    const appId = pathname.split("/")[3];
    const appBase = `/developer/apps/${appId}`;
    if (pathname === appBase) {
      return {
        backTo: "/developer/apps",
        backLabel: "My Apps",
        actions: [
          {
            id: "edit",
            label: "Edit listing",
            to: `${appBase}/edit`,
            variant: "primary",
          },
          {
            id: "preview",
            label: "Preview",
            to: `${appBase}/preview`,
            variant: "secondary",
          },
        ],
      };
    }
    return {
      backTo: appBase,
      backLabel: "App dashboard",
    };
  }

  if (pathname === "/developer/apps/new") {
    return {
      backTo: "/developer/apps",
      backLabel: "My Apps",
    };
  }

  if (pathname.startsWith("/developer")) {
    return {
      actions: [
        {
          id: "create",
          label: "Create app",
          to: "/developer/apps/new",
          variant: "primary",
        },
        {
          id: "apps",
          label: "My Apps",
          to: "/developer/apps",
          variant: "secondary",
        },
      ],
    };
  }

  if (pathname.startsWith("/onboarding/developer")) {
    return {
      backTo: "/onboarding",
      backLabel: "Onboarding hub",
      actions: [
        {
          id: "marketplace",
          label: "Marketplace",
          to: "/marketplace",
          variant: "secondary",
        },
      ],
    };
  }

  if (pathname.match(/^\/onboarding\/[^/]+(\/[^/]+)?$/)) {
    return {
      backTo: "/onboarding",
      backLabel: "Onboarding hub",
      actions: [
        {
          id: "skip",
          label: "Skip to overview",
          to: "/",
          variant: "secondary",
        },
      ],
    };
  }

  if (pathname === "/onboarding") {
    return {
      actions: [
        {
          id: "account",
          label: "Start account setup",
          to: "/onboarding/account",
          variant: "primary",
        },
        {
          id: "marketplace",
          label: "Browse marketplace",
          to: "/marketplace",
          variant: "secondary",
        },
      ],
    };
  }

  if (
    pathname.startsWith("/marketplace/apps/") &&
    pathname.includes("/install/results")
  ) {
    return {
      backTo: pathname.replace(/\/results$/, "/progress"),
      backLabel: "Back to progress",
      actions: [
        {
          id: "installed",
          label: "View installed apps",
          to: "/installed",
          variant: "primary",
        },
        {
          id: "marketplace",
          label: "Marketplace",
          to: "/marketplace",
          variant: "secondary",
        },
      ],
    };
  }

  if (
    pathname.startsWith("/marketplace/apps/") &&
    pathname.includes("/install/progress")
  ) {
    return {
      backTo: pathname.replace(/\/progress$/, "/review"),
      backLabel: "Back to review",
      actions: [
        {
          id: "results",
          label: "View results",
          to: pathname.replace(/\/progress$/, "/results"),
          variant: "primary",
        },
      ],
    };
  }

  if (
    pathname.startsWith("/marketplace/apps/") &&
    pathname.includes("/install/review")
  ) {
    const appBase = pathname.replace(/\/install\/review$/, "");
    return {
      backTo: `${appBase}/install`,
      backLabel: "Back to node selection",
      actions: [
        {
          id: "continue",
          label: "Continue install",
          to: pathname.replace(/\/review$/, "/progress"),
          variant: "primary",
        },
      ],
    };
  }

  if (
    pathname.startsWith("/marketplace/apps/") &&
    pathname.endsWith("/install")
  ) {
    const appId = pathname.split("/")[3];
    return {
      backTo: `/marketplace/apps/${appId}`,
      backLabel: "Back to app",
      actions: [
        {
          id: "review",
          label: "Review installation",
          to: `${pathname}/review`,
          variant: "primary",
        },
      ],
    };
  }

  if (pathname.startsWith("/marketplace/apps/")) {
    const appId = pathname.split("/")[3];
    return {
      backTo: "/marketplace/search",
      backLabel: "Back to browse",
      actions: [
        {
          id: "install",
          label: "Install on nodes",
          to: `/marketplace/apps/${appId}/install`,
          variant: "primary",
        },
      ],
    };
  }

  if (pathname.startsWith("/marketplace/search")) {
    return {
      backTo: "/marketplace",
      backLabel: "Marketplace home",
      actions: [
        {
          id: "installed",
          label: "Installed apps",
          to: "/installed",
          variant: "secondary",
        },
      ],
    };
  }

  if (pathname === "/marketplace") {
    return {
      actions: [
        {
          id: "search",
          label: "Search apps",
          to: "/marketplace/search",
          variant: "primary",
        },
        {
          id: "installed",
          label: "Installed apps",
          to: "/installed",
          variant: "secondary",
        },
      ],
    };
  }

  if (pathname.match(/^\/installed\/[^/]+\/nodes\//)) {
    const parts = pathname.split("/");
    const appId = parts[2];
    return {
      backTo: `/installed/${appId}`,
      backLabel: "Back to installed app",
      actions: [
        {
          id: "manage",
          label: "Manage app",
          to: `/installed/${appId}`,
          variant: "primary",
        },
      ],
    };
  }

  if (pathname.startsWith("/installed/") && pathname !== "/installed") {
    return {
      backTo: "/installed",
      backLabel: "All installed apps",
      actions: [
        {
          id: "marketplace",
          label: "Browse marketplace",
          to: "/marketplace",
          variant: "primary",
        },
      ],
    };
  }

  if (pathname === "/installed") {
    return {
      actions: [
        {
          id: "marketplace",
          label: "Browse marketplace",
          to: "/marketplace",
          variant: "primary",
        },
      ],
    };
  }

  if (pathname.startsWith("/nodes/") && pathname !== "/nodes") {
    return {
      backTo: "/nodes",
      backLabel: "Back to My Nodes",
      actions: [
        {
          id: "install",
          label: "Install app",
          to: "/marketplace",
          variant: "primary",
        },
        {
          id: "rewards",
          label: "Rewards",
          to: "/rewards",
          variant: "secondary",
        },
      ],
    };
  }

  if (pathname === "/nodes") {
    return {
      actions: [
        {
          id: "marketplace",
          label: "Browse marketplace",
          to: "/marketplace",
          variant: "primary",
        },
      ],
    };
  }

  if (pathname === "/rewards") {
    return {
      actions: [
        {
          id: "marketplace",
          label: "Find earning apps",
          to: "/marketplace",
          variant: "primary",
        },
      ],
    };
  }

  if (pathname === "/activity") {
    return {
      actions: [
        {
          id: "installed",
          label: "Installed apps",
          to: "/installed",
          variant: "primary",
        },
      ],
    };
  }

  if (pathname === "/settings") {
    return {
      actions: [
        {
          id: "nodes",
          label: "My Nodes",
          to: "/nodes",
          variant: "secondary",
        },
      ],
    };
  }

  // Overview and fallback
  return {
    actions: [
      {
        id: "marketplace",
        label: "Browse marketplace",
        to: "/marketplace",
        variant: "primary",
      },
      {
        id: "nodes",
        label: "My Nodes",
        to: "/nodes",
        variant: "secondary",
      },
    ],
  };
}

export function mergePageChrome(
  defaults: PageChromeConfig,
  override: PageChromeConfig | null,
): PageChromeConfig {
  if (!override) return defaults;
  return {
    backTo: override.backTo ?? defaults.backTo,
    backLabel: override.backLabel ?? defaults.backLabel,
    actions: override.actions ?? defaults.actions,
  };
}
